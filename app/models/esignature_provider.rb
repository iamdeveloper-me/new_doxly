class EsignatureProvider < ActiveRecord::Base
  include Models::Encryptable

  store :authentication_info, accessors: [:username, :password, :account_id, :endpoint, :salt]

  # set as either true or false and ensures we don't try to decrypt an unencrypted_password in the docusign_rest_client method below.
  attr_accessor :unencrypted_password
  # if we want to manually reset the api password
  attr_accessor :bypass_set_attrs

  belongs_to :entity

  validates_presence_of :entity
  validates :name,
            :presence => true
  validates :username,
            :presence => true
  validates :password,
            :presence => true
  validates :is_demo, inclusion: { in: [true, false] }

  before_validation :set_name
  before_save :set_attrs, unless: :bypass_set_attrs?

  # Set this to be true if you want to update the api settings without a force reload of the account id
  def bypass_set_attrs?
    bypass_set_attrs
  end

  def api_client
    @api_client ||= begin
      client = docusign_rest_client
      # The actual production endpoint varies. The correct value is stored as :endpoint as part of validation.
      client.endpoint = endpoint unless is_demo?
      client
    end
  end

  def create_envelope_from_document(file_path, signature_packet, signature_page_collection_objects, notifications_url)
    user                 = signature_packet.user
    deal                 = signature_packet.deal
    deal_title           = deal.title
    signer_name          = signature_packet.signing_capacities.first.name

    sign_here_tabs = []
    text_tabs = []
    date_signed_tabs = []
    build_signature_tabs_per_signature_page_collection = ->(signature_page_collection, number_of_pages_in_the_file) {
      unique_id = Random.rand(99999999)
      sign_here_tabs = sign_here_tabs + build_sign_here_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id)
      text_tabs = text_tabs + build_title_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id)
      text_tabs = text_tabs + build_full_name_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id)
      text_tabs = text_tabs + build_address_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id)
      date_signed_tabs = date_signed_tabs + build_date_signed_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id)
    }
    signature_page_collection_objects.uniq.each do |signature_page_collection_object| # we uniq here because we deal with multiple copies inside the tab building methods, we don't want to here.
      signature_page_collection   = signature_page_collection_object[:signature_page_collection]
      number_of_pages_in_the_file = signature_page_collection_object[:number_of_pages_in_the_file]
      build_signature_tabs_per_signature_page_collection.call(signature_page_collection, number_of_pages_in_the_file)
    end

    signers = [
      {
        embedded: true,
        name: signer_name,
        email: user.email,
        recipient_id: 1,
        routing_order: 0,
        role_name: "signer_1",
        signer_id: user.id,
        sign_here_tabs: sign_here_tabs,
        text_tabs: text_tabs,
        date_signed_tabs: date_signed_tabs
      }
    ]

    envelope_json = create_envelope_json(file_path.to_s, user, signer_name, deal_title, signers, notifications_url)
    response = begin
      api_client.create_envelope_from_document(envelope_json)
    rescue StandardError => e
      Rails.logger.error e
      e
    end
    { envelope_id: response["envelopeId"], response: response }
  end

  def add_recipient_to_envelope(envelope, entity_user)
    email        = entity_user.user.email
    recipient_id = SecureRandom.uuid
    recipient_json = {
      envelope_id: envelope.envelope_id,
      certified_deliveries: [
        {
          embedded: true,
          name: entity_user.name,
          email: email,
          recipient_id: recipient_id
        }
      ]
    }
    response = begin
      api_client.add_envelope_certified_deliveries(recipient_json)
    rescue StandardError => e
      Rails.logger.error e
      {}
    end
    success = response.present? && response["errorCode"].nil? && response["certifiedDeliveries"].first.keys.exclude?("errorDetails")
    envelope.create_recipient!(entity_user.id, recipient_id) if success
    success
  end

  def get_recipient_url(envelope_id, user, redirect_path)
    view_json = {
      envelope_id: envelope_id,
      email: user.email,
      name: user.name,
      return_url: redirect_path
    }
    response = begin
      api_client.get_recipient_view(view_json)
    rescue StandardError => e
      Rails.logger.error e
      {}
    end
    # most likely if name or email has been changed since packet has been sent.
    if response["errorCode"].present?
      begin
        signer_response = api_client.get_envelope_recipients({envelope_id: envelope_id})["signers"].first
      rescue StandardError => e
        Rails.logger.error e
        signer_response = {}
      end
      view_json_from_api = {
        envelope_id: envelope_id,
        email: signer_response["email"],
        name: signer_response["name"],
        return_url: redirect_path
      }
      response = begin
        api_client.get_recipient_view(view_json_from_api)
      rescue StandardError => e
        Rails.logger.error e
        {}
      end
    end
    response['url']
  end

  def get_sender_url(envelope_id, redirect_path)
    view_json = {
      envelope_id: envelope_id,
      return_url: redirect_path
    }
    response = begin
      api_client.get_sender_view(view_json)
    rescue StandardError => e
      Rails.logger.error e
      {}
    end
    response
  end

  def void_envelope(envelope_id)
    envelope_json = {
      envelope_id: envelope_id,
      voided_reason: 'Reset Signatures'
    }
    begin
      api_client.void_envelope(envelope_json)
    rescue StandardError => e
      Rails.logger.error e
    end
  end

  def add_envelope_document_with_tabs(signature_packet, signature_page_collection, number_of_pages_in_the_file, file_path)
    # unique id that ties the page to it's tabs. Previously were using the page_id, but that doesn't work since copies share the same page.
    # have to use this because it seems that the id has to be an integer and cannot be very large.
    # Should be fine, since the document_id only needs to be unique per envelope.
    unique_id = Random.rand(99999999)
    @copy_number = 0 #ignored
    response = {}
    # build_document_json
    document_json = {
      envelope_id: signature_packet.docusign_envelope_id,
      document_id: unique_id,
      file_path: file_path
    }
    # send_document_to_docusign
    response = api_client.add_envelope_document(document_json)
    success_of_document = response.code == '200'
    if success_of_document
      tabs_json = {
        envelope_id: signature_packet.docusign_envelope_id,
        recipient_id: 1,
        tabs: {
          signHereTabs: api_client.get_tabs(build_sign_here_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id, true), {}, 0),
          textTabs: api_client.get_tabs(build_full_name_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id, true) + build_title_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id, true) + build_address_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id, true), {}, 0),
          dateSignedTabs: api_client.get_tabs(build_date_signed_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id, true), {}, 0)
        }
      }
      response = api_client.add_recipient_tabs(tabs_json)
      unless success_of_tabs(response)
        delete_json = {
          envelope_id: signature_packet.docusign_envelope_id,
          document_id: unique_id
        }
        api_client.delete_envelope_document(delete_json)
      end
    end
    { success: (success_of_document && success_of_tabs(response)), response: response }
  end

  private

  def create_envelope_json(file_path, user, signer_name, deal_title, signers, notifications_url)
    title        = "Signature Packet for #{signer_name} on #{deal_title}"
    content_type = 'application/pdf'

    envelope_json = {
      status: 'sent',
      email: {
        subject: title,
        body: title
      },
      files: [
        {
          :name => title,
          :content_type => content_type,
          :path => file_path
        }
      ],
      enable_wet_sign: false,
      signers: signers,
      event_notification: {
        url: notifications_url,
        logging: true,
        require_acknowledgement: true,
        envelope_events: [
          { envelope_event_status_code: "Completed" },
          { envelope_event_status_code: "Voided" }
        ],
        recipient_events: [
          {include_documents: true},
          {recipient_event_status_code: "Sent"},
          {recipient_event_status_code: "Delivered"},
          {recipient_event_status_code: "Completed"},
          {recipient_event_status_code: "Declined"}
        ]
      }
    }
  end

  def get_content_type(tree_element)
    case tree_element&.attachment&.versions&.last.file_type.downcase
    when '.txt'
      'text/plain'
    when '.pdf'
      'application/pdf'
    when '.doc'
      'application/msword'
    when '.docx'
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    when '.xls'
      'application/vnd.ms-excel'
    when 'xlsx'
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    when '.rtf'
      'application/rtf'
    when '.tiff'
      'image/tiff'
    else
      'application/octet-stream'
    end
  end

  def docusign_rest_client
    actual_password = unencrypted_password ? password : self.decrypt(password)
    DocusignRest::Client.new(
      :username       => username,
      :password       => actual_password,
      :integrator_key => Doxly.config.docusign_integrator_key,
      :account_id     => account_id,
      :endpoint       => is_demo? ? Doxly.config.docusign_demo_url : Doxly.config.docusign_live_url,
      :api_version    => Doxly.config.docusign_api_version
    )
  end

  def login_information
    @login_information ||= begin
      JSON.parse(docusign_rest_client.get_login_information(:api_password => true).body)
    rescue StandardError => e
      Rails.logger.error e
      {}
    end
  end

  def production_endpoint
    uri = URI.parse(login_information["loginAccounts"][0]['baseUrl'])
    "https://#{uri.host}/restapi"
  rescue
    nil
  end

  def docusign_account_id
    login_information["loginAccounts"][0]["accountId"]
  rescue
    nil
  end

  def set_attrs
    self.account_id = docusign_account_id
    self.endpoint   = production_endpoint unless self.is_demo?
    # we use the api password and not the entered web account password
    self.password   = self.encrypt("salt", login_information["apiPassword"])
    if (!self.is_demo? && self.endpoint.blank?) || self.password.blank?
      self.errors.add(:base, 'Could not verify the Docusign account. Please check the credentials and try again.')
      return false
    end
    true
  end

  def set_name
    self.name = self.entity.name if self.name.blank?
  end


  # ======== THE COMMENTS IN THIS METHOD APPLY TO ALL OF THE 'BUILD_X_TABS METHODS' =========
  def build_sign_here_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id, additional_page=false)
    signature_packet     = signature_page_collection.signature_packet
    user                 = signature_packet.user
    sign_here_tabs       = []
    signature_page_collection.signature_pages.where(is_custom: true).each do |signature_page|
      # We loop through the number of signature_page_copies to add the tabs for each copy,
      # since for every custom page copy we need to add separate tabs (there's no anchor string)
      # and we are doing multiple copies at once when sending a new packet.
      signature_page_collection.tree_element.number_of_signature_page_copies.times do |copy_number|
        # however, we break after one set of tabs if we are adding an additional page
        # because we are adding each copy separately in this case.
        break if copy_number > 0 && additional_page
        signature_page.signature_tabs.where(tab_type: "Signature").each do |tab|
          y_value = (tab.y_coordinate.to_i - 20).to_s
          tab_hash = {
            x_position: tab.x_coordinate,
            y_position: y_value,
            # this page number will get overwritten below if we're adding to a packet.
            # Here, however, it's important
            page_number: "#{signature_page.packet_page_number + (copy_number * number_of_pages_in_the_file)}"
          }
          # here the page number AND the document Id are crucial.
          # The Page Number is the page number WITHIN the document (defined by the document_id)
          # Every time we add to an existing envelope, including every copy of a tree_element's signature_pages, it's a new 'document'
          # Thus we use file_page_to_sign here
          tab_hash.merge!({ page_number: signature_page.file_page_to_sign, document_id: unique_id }) if additional_page
          sign_here_tabs << tab_hash
        end
      end
    end
    if signature_page_collection.signature_pages.where(is_custom: false).any?
      tab_hash = {
        anchor_string: "#{user.unique_key}#{signature_page_collection.id}",
        anchor_x_offset: '5',
        anchor_y_offset: '-10',
        page_number: '1' # ignored by docusign because of anchor string, but still needed somehow? Possibly could remove entirely from the non-custom page json
      }

      # the page_number will be ignored because of the anchor string,
      # but the document_id is crucial because it prevents doubling of tabs.
      # The anchor string is the exact same in ALL copies, but Docusign won't apply the tab except to this document (IE this copy)
      tab_hash.merge!({ page_number: 1, document_id: unique_id }) if additional_page
      sign_here_tabs << tab_hash
    end
    sign_here_tabs
  end

  def build_full_name_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id, additional_page=false)
    signature_packet     = signature_page_collection.signature_packet
    user                 = signature_packet.user
    font_size            = signature_packet.deal.font_size.to_i

    common_full_name_tab_fields = -> (signature_page_collection, additional_page) {
      {
        label: "Full Name #{SecureRandom.hex}",
        name: "Full Name",
        width: "180"
      }.merge!(common_tab_fields(signature_page_collection, unique_id, additional_page))
    }

    full_name_tabs = []
    signature_page_collection.signature_pages.where(is_custom:  true).each do |signature_page|
      signature_page_collection.tree_element.number_of_signature_page_copies.times do |copy_number|
        break if copy_number > 0 && additional_page
        signature_page.signature_tabs.where(label: "Full Name").each do |tab|
          y_value = (tab.y_coordinate.to_i - 2).to_s
          tab_hash = {
            x_position: tab.x_coordinate,
            y_position: y_value,
            page_number: (signature_page.packet_page_number + (copy_number * number_of_pages_in_the_file)).to_s
          }
          tab_hash.merge!({ page_number: signature_page.file_page_to_sign, document_id: unique_id }) if additional_page
          tab_hash.merge!(common_full_name_tab_fields.call(signature_page_collection, additional_page))
          full_name_tabs << tab_hash
        end
      end
    end
    non_custom_pages = signature_page_collection.signature_pages.where(is_custom: false)
    non_custom_no_name_signing_capacity = non_custom_pages.find{ |signature_page| !signature_page.signing_capacity.full_name_present? }
    if non_custom_no_name_signing_capacity.present?
      name_x_offset = (font_size/SignaturePage::NAME_PLACEHOLDER_MULTIPLIER).round
      tab_hash = {
        anchor_string: "#{user.unique_key_for_name}#{signature_page_collection.id}",
        anchor_x_offset: "#{name_x_offset}",
        anchor_y_offset: "-25",
        page_number: '1' # ignored by docusign because of anchor string
      }
      tab_hash.merge!(common_full_name_tab_fields.call(signature_page_collection, additional_page))
      full_name_tabs << tab_hash
    end
    full_name_tabs
  end

  def build_title_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id, additional_page=false)
    signature_packet     = signature_page_collection.signature_packet
    user                 = signature_packet.user
    font_size            = signature_packet.deal.font_size.to_i
    signing_capacities   = signature_page_collection.signing_capacities

    common_title_tab_fields = -> (signature_page_collection, additional_page) {
      {
        label: "Title #{SecureRandom.hex}",
        name: "Title",
        width: "200",
      }.merge(common_tab_fields(signature_page_collection, unique_id, additional_page))
    }

    title_tabs = []

    signature_page_collection.signature_pages.where(is_custom:  true).each do |signature_page|
      signature_page_collection.tree_element.number_of_signature_page_copies.times do |copy_number|
        break if copy_number > 0 && additional_page
        signature_page.signature_tabs.where(label: "Title").each do |tab|
          y_value = (tab.y_coordinate.to_i - 2).to_s
          tab_hash = {
            x_position: tab.x_coordinate,
            y_position: y_value,
            page_number: (signature_page.packet_page_number + (copy_number * number_of_pages_in_the_file)).to_s
          }
          tab_hash.merge!({ page_number: signature_page.file_page_to_sign, document_id: unique_id }) if additional_page
          tab_hash.merge!(common_title_tab_fields.call(signature_page, additional_page))
          title_tabs << tab_hash
        end
      end
    end
    if signature_page_collection.signature_pages.where(is_custom: false).any?
      if signing_capacities.select{|signing_capacity| signing_capacity.signature_entity && !signing_capacity.title_present?}.any?
        title_x_offset = (font_size/SignaturePage::TITLE_PLACEHOLDER_MULTIPLIER).round
        tab_hash = {
          anchor_string: "#{user.unique_key_for_title}#{signature_page_collection.id}",
          anchor_x_offset: "#{title_x_offset}",
          anchor_y_offset: "-25",
          page_number: '1' # ignored by docusign because of anchor string
        }
        tab_hash.merge!(common_title_tab_fields.call(signature_page_collection, additional_page))
        title_tabs << tab_hash
      end
    end
    title_tabs
  end

  def build_date_signed_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id, additional_page=false)
    signature_packet     = signature_page_collection.signature_packet
    user                 = signature_packet.user
    font_size            = signature_packet.deal.font_size.to_i
    date_signed_tabs     = []
    signature_page_collection.signature_pages.where(is_custom: true).each do |signature_page|
      signature_page_collection.tree_element.number_of_signature_page_copies.times do |copy_number|
        break if copy_number > 0 && additional_page
        signature_page.signature_tabs.where(tab_type: "DateSigned").each do |tab|
          y_value = (tab.y_coordinate.to_i+4).to_s
          tab_hash = {
            x_position: tab.x_coordinate,
            y_position: y_value,
            page_number: (signature_page.packet_page_number + (copy_number * number_of_pages_in_the_file)).to_s
          }
          tab_hash.merge!({ page_number: signature_page.file_page_to_sign, document_id: unique_id }) if additional_page
          date_signed_tabs << tab_hash
        end
      end
    end
    if signature_page_collection.signature_pages.where(is_custom: false).any?
      if signature_page_collection.tree_element.show_signing_capacity_date_signed
        date_signed_x_offset = (font_size/SignaturePage::DATE_SIGNED_PLACEHOLDER_MULTIPLIER).round
        tab_hash = {
          anchor_string: "#{user.unique_key_for_date_signed}#{signature_page_collection.id}",
          anchor_x_offset: "#{date_signed_x_offset}",
          anchor_y_offset: "-18",
          page_number: '1' # ignored by docusign because of anchor string
        }
        tab_hash.merge!({ page_number: 1, document_id: unique_id }) if additional_page
        date_signed_tabs << tab_hash
      end
    end
    date_signed_tabs
  end

  def build_address_tabs(signature_page_collection, number_of_pages_in_the_file, unique_id, additional_page=false)
    signature_packet     = signature_page_collection.signature_packet
    user                 = signature_packet.user
    font_size            = signature_packet.deal.font_size.to_i
    tree_element         = signature_page_collection.tree_element

    common_address_tab_fields = -> (signature_page_collection, additional_page) {
      {
        label: "Address Line #{SecureRandom.hex}", # lambda so secureRandom is different each time.
        name: "Text",
        width: "200",
      }.merge(common_tab_fields(signature_page_collection, unique_id, additional_page))
    }
    address_tabs = []
    signature_page_collection.signature_pages.where(is_custom: true).each do |signature_page|
      tree_element.number_of_signature_page_copies.times do |copy_number|
        break if copy_number > 0 && additional_page
        signature_page.signature_tabs.where(label: "Address Line").each do |tab|
          y_value = (tab.y_coordinate.to_i - 2).to_s
          tab_hash = {
            x_position: tab.x_coordinate,
            y_position: y_value,
            page_number: signature_page.packet_page_number + (copy_number * number_of_pages_in_the_file) # ignored_by_docusign when not a custom page
          }
          tab_hash.merge!({ page_number: signature_page.file_page_to_sign, document_id: unique_id }) if additional_page
          tab_hash.merge!(common_address_tab_fields.call(signature_page_collection, additional_page))
          address_tabs << tab_hash
        end
      end
    end
    if tree_element.show_address_on_signature_page? # check this first before doing the expensive work below. Don't need to check if any non-custom pages since below checks does it.
      # lambdas for performance and cleanliness
      entity_signer_no_address = ->(page) { page.signing_capacity.is_entity_signer? && page.signing_capacity.signature_entity.root.primary_address.nil?}
      individual_signer_no_address = ->(page) { !page.signing_capacity.is_entity_signer? && page.signing_capacity.primary_address.nil? }

      # to handle consolidated blocks that only do one address.
      entity_signature_pages = signature_page_collection.signature_pages.where(is_custom: false).select{ |signature_page| entity_signer_no_address.call(signature_page)}

      # get all of the signature_capacities together that exist on one signature_block (and that could share an address)
      grouped_signature_capacities = signature_page_collection.block_collection.consolidated_blocks.values

      grouped_signature_pages_for_consolidation = []
      grouped_signature_capacities.each_with_index do |signature_capacity_group, index|
        array_for_index = []
        # for every signature_page that is for an entity_signer, loop through and match it to the correct group of signing_capacities.
        # There will be one for every signature page if no consolidation, but there could be multiple if consolidated.
        entity_signature_pages.each do |signature_page|
          array_for_index << signature_page if signature_capacity_group.include?(signature_page.signing_capacity)
        end

        # here after this loop has run it's course, grouped_signature_pages_for_consolidation will be an array of arrays of signature pages that would share an address on the signature_page file.
        # Thus can loop through them below to build the address tabs for them.
        grouped_signature_pages_for_consolidation << array_for_index
      end

      grouped_signature_pages_for_consolidation.each do |array_of_signature_pages|
        next unless array_of_signature_pages.any?
        largest_root_entity_id = array_of_signature_pages.map{|signature_page| signature_page.signing_capacity.signature_entity.root.id}.sort.last
        address_x_offset = (font_size/SignaturePage::ADDRESS_PLACEHOLDER_MULTIPLIER).round
        2.times do |i|
            tab_hash = {
            anchor_string: "#{signature_page_collection.unique_key_for_address}#{largest_root_entity_id}",
            anchor_x_offset: "#{address_x_offset}",
            anchor_y_offset: "#{i == 0 ? '-20' : '0'}",
            page_number: '1' # ignored by docusign because of anchor string
          }
          tab_hash.merge!(common_address_tab_fields.call(signature_page_collection, additional_page))
          address_tabs << tab_hash
        end
      end
      signature_page_collection.signature_pages.where(is_custom: false).select{ |signature_page| individual_signer_no_address.call(signature_page)}.each do |signature_page|
        address_x_offset = (font_size/SignaturePage::ADDRESS_PLACEHOLDER_MULTIPLIER).round
        2.times do |i|
            tab_hash = {
            anchor_string: "#{signature_page_collection.unique_key_for_address}#{signature_page.signing_capacity.id}",
            anchor_x_offset: "#{address_x_offset}",
            anchor_y_offset: "#{i == 0 ? '-20' : '0'}",
            page_number: '1' # ignored by docusign because of anchor string
          }
          tab_hash.merge!(common_address_tab_fields.call(signature_page_collection, additional_page))
          address_tabs << tab_hash
        end
      end
    end
    address_tabs
  end

  def common_tab_fields(signature_page_collection, unique_id, additional_page)
    {
      height: "20",
      font_size: "Size10",
      bold: true,
      required: true
    }
  end

  def success_of_tabs(response)
    begin
      if response["errorCode"].present?
        return false
      else
        response.each do |tab_group|
          tab_group.second.each do |tab_response|
            return false if tab_response["errorDetails"].present?
          end
        end
      end
      true
    rescue
      return false
    end
  end

end
