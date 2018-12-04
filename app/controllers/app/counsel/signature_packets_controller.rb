class App::Counsel::SignaturePacketsController < App::ApplicationController
  include Controllers::SignaturePackets

  def send_packets_confirm
    check_update(:signature_management)
    forbid_if_deals_closed("Cannot send packets after deal has been closed"){return}
    @ready_packets    = []
    if ready_signing_capacities.any?
      @ready_packets  = ready_signers.map do |signer|
        user_ready_signing_capacities = ready_signing_capacities.select{ |signing_capacity| signing_capacity.user_id == signer.id }
        ready_pages   = user_ready_signing_capacities.map(&:ready_signature_pages).flatten
        get_documents(ready_pages, signer)
      end
    end
  end

  def send_packet_wizard
    check_update(:signature_management)
    forbid_if_deals_closed("Cannot send packets after deal has been closed"){return}
    if !user.email?
      flash.now[:error] = "Cannot send packet to a user without an email"
      render 'shared/blank' and return
    elsif !user.signature_pages.ready_to_send.select{|signature_page| signature_page.signing_capacity.get_signature_group.deal_id == deal.id}.any?
      flash.now[:error] = "User has no signature pages ready to send"
      render 'shared/blank' and return
    end
  end

  def send_packets
    check_update(:signature_management)
    forbid_if_deals_closed("Cannot send packets after deal has been closed"){return}
    unless ready_signing_capacities.empty?
      ready_signers.each do |signer|
        # attempts to send the packet(s) to the user.
        build_and_send_packets(signer) if signer.email?
      end
    end
    documents
    users_with_signing_capacities
  end

  def send_packet
    check_update(:signature_management)
    forbid_if_deals_closed("Cannot send packets after deal has been closed"){return}
    send_packet_to_signer(user, params[:custom_message]) if user.present? && user.email?
    @signing_capacity_ids = signing_capacities.select{|x| x.user_id == user.id}.map(&:id)
  end

  def upload_manual_signatures
    check_update(:signature_management)
    forbid_if_deals_closed("Cannot upload manual signatures after deal has been closed"){return}
    render 'shared/signing/upload_manual_signatures'
  end

  def uploaded_manual_signatures
    check_update(:signature_management)
    forbid_if_deals_closed("Cannot upload manual signatures after deal has been closed"){return}

    if params[:file].present?
      file_extension = File.extname(params[:file].original_filename)
      if SignaturePacket::ALLOWED_FILE_UPLOAD_TYPES.include?(file_extension.downcase)
        documents
        users_with_signing_capacities
        # build directories if necessary
        uploaded_packets_path = "#{ApplicationHelper.signature_management_root}/deal_#{deal.id}/manual_signatures/uploaded_packets"
        FileUtils.mkdir_p(uploaded_packets_path) unless Dir.exist?(uploaded_packets_path)

        # save file
        uploaded_file = params[:file]
        file_path = "#{uploaded_packets_path}/#{uploaded_file.original_filename.tr("[]", "")}" # ZXing library will throw an exception if brackets are in the filename
        File.open(file_path, 'wb') do |file|
          file.write(uploaded_file.read)
        end

        # create background job split and assign pages
        ProcessManualSignaturesJob.perform_later(deal, current_entity_user, file_path.to_s, Time.now.in_time_zone(request.cookies["timezone"]).to_s)
        flash.now[:success] = "Signatures currently being processed. Please allow a few minutes for processing to complete."
        render 'shared/signing/uploaded_manual_signatures'
      else
        deal
        flash.now[:error] = "File format not supported. Please upload a PDF or image."
        render 'shared/signing/upload_manual_signatures'
      end
    else
      deal
      flash.now[:error] = "File cannot be blank"
      render 'shared/signing/upload_manual_signatures'
    end
  end

  def manage_signature_packets
    check_update(:signature_management)
    @signature_packets        = signature_packets.where(user_id: params[:user_id]).order(:created_at)
    ready_signature_pages     = user_signing_capacities.map(&:ready_signature_pages).flatten
    @ready_manual_pages       = ready_signature_pages.select{|signature_page| signature_page.is_manual? }
    @ready_esignature_pages   = ready_signature_pages.select{|signature_page| signature_page.is_docusign? }
    if @signature_packets.empty? && ready_signature_pages.empty?
      flash.now[:error]       = "User has no signature packets"
      render 'shared/blank' and return
    end
    user
  end

  def view_signature_pages
    check_update(:signature_management)
    @title                    = params[:title]
    @ready_signature_pages    = user_signing_capacities.map(&:ready_signature_pages).flatten.select{|page| params[:signature_page_ids].include?(page.id.to_s)}
  end

  def display_signature_packet
    check_read(:signature_management)
    signed     = params[:signed].present?
    @url       = ApplicationHelper.viewer_url(view_deal_signature_packet_path(deal, signature_packet, signed: signed))
    @title     = params[:title]
    render 'shared/view_document'
  end

  def view
    check_read(:signature_management)
    signed = params[:signed] == "true"
    path   = signed ? signature_packet.signed_file_path : signature_packet.unsigned_file_path
    display_file(path)
  end

  def download
    check_read(:signature_management)
    signed      = params[:signed] == "true"
    path        = signed ? signature_packet.signed_file_path : signature_packet.unsigned_file_path
    packet_name = "signature_packet_for_#{ApplicationHelper.sanitize_filename(signature_packet.user.name.downcase)}#{signature_packet.file_type}"
    download_file(path, :filename => packet_name)
  end

  def void_signature_packet
    check_update(:signature_management)
    forbid_if_deals_closed("Cannot void signature packet after deal has been closed"){return}
    if signature_packet.signature_pages.ever_executed.any?
      flash.now[:error] = 'Cannot void signature packets after one or more pages in the packet have been executed'
      render 'shared/blank' and return
    else
      @signature_page_ids = signature_packet.signature_pages.pluck(:id)
      signature_packet.void(deal.owner_entity)
    end
    @has_manual_packets = deal.signature_packets.where(:docusign_envelope_id => nil).any?
  end

  def send_reminder
    check_read(:signature_management)
    forbid_if_deals_closed("Cannot send reminders after deal has been closed"){return}
    @user = user
    @signature_packets = signature_packets.with_email_type.where(user_id: params[:user_id])
    # allow reminder will either return true or a flash message.
    unless allow_reminder == true
      render 'shared/blank' and return
    end
  end

  def remind_signer
    check_read(:signature_management)
    forbid_if_deals_closed("Cannot send reminders after deal has been closed"){return}
    @signature_packets = signature_packets.where(user_id: params[:user_id])

    @tooltip_id = params[:tooltip_id]
    @signature_packets.each do |signature_packet|
      unless signature_packet.completed_at
        signature_packet.reminder_email_timestamp = Time.now.utc
        signature_packet.bypass_approval_validation = true
        signature_packet.save
      end
    end
    user = @signature_packets.first.user
    user.refresh_confirmation_token! if user.confirmation_token.present?
    DealMailer.remind_signer_email(user, current_entity_user, @deal, params[:custom_message]).deliver_later
    flash.now[:success] = "Reminder email sent."
    # show that all have been signed, so show no packets, or if there is a valid packet, but the reminder was already sent
  end

  def set_default_signature_type_confirm
    check_update(:signature_management)
    forbid_if_deals_closed("Cannot change the default signature type after deal has been closed"){return}
    @sign_manually = params["type"] == "manual"
    @documents_affected = documents.select{|document| document.sign_manually != @sign_manually && !document.is_executed?}
  end

  def set_default_signature_type
    check_update(:signature_management)
    forbid_if_deals_closed("Cannot change the default signature type after deal has been closed"){return}
    @sign_manually = params["sign_manually"] == "true" ? true : false
    @documents_affected = documents.select{|document| document.sign_manually != @sign_manually && !document.is_executed?}
    @documents_affected.each do |document|
      document.sign_manually = @sign_manually
      document.save
    end
    deal.sign_manually_by_default = @sign_manually
    deal.save
  end

  def cancel_set_default_signature_type
    check_update(:signature_management)
    deal
  end

  private

  def signature_packets
    @signature_packets ||= deal.signature_packets.includes(:signature_pages)
  end

  def signature_packet
    @signature_packet ||= signature_packets.find(params[:id] || params[:signature_packet_id])
  end

  def ready_signing_capacities
    @ready_signing_capacities ||= signing_capacities.reject{ |signing_capacity| signing_capacity.signature_pages.empty? || signing_capacity.all_signature_pages_sent? || signing_capacity.all_signature_pages_completed? || !signing_capacity.has_email? }
  end

  def signing_capacity
    @signing_capacity ||= signing_capacities.find{ |signing_capacity| signing_capacity.user_id == params[:user_id].to_i }
  end

  def user
    @user ||= signing_capacity&.user
  end

  def user_signing_capacities
    @user_signing_capacities ||= signing_capacities.select { |signing_capacity| signing_capacity.user_id == params[:user_id].to_i }
  end

  def ready_signers
    @ready_signers ||= ready_signing_capacities.map(&:user).uniq
  end

  def signers
    @signers ||= signing_capacities.map(&:user).uniq
  end

  def tree_element
    @tree_element ||= deal.closing_category.descendants.signature_required.find{ |tree_element| tree_element.id === params[:tree_element_id].to_i }
  end

  def get_documents(ready_pages, signer)
    ready_manual_pages     = ready_pages.select{|signature_page| signature_page.is_manual? }
    ready_esignature_pages = ready_pages.select{|signature_page| signature_page.is_docusign? }
    packet_count           = ready_manual_pages.any? ? 1 : 0
    packet_count           += ready_esignature_pages.any? ? 1 : 0

    {
      :name => signer.name,
      :email => signer.email,
      :manual_documents => ready_manual_pages.map{ |page| get_document_name(page) }.sort,
      :esignature_documents => ready_esignature_pages.map{ |page| get_document_name(page) }.sort,
      :packet_count => packet_count
    }
  end

  def get_document_name(page)
    name         = page.tree_element.document_name
    entity       = page.signing_capacity.signature_entity
    name         += " (#{entity.name})" if entity.present?
    name
  end

  def allow_reminder
    if !@user.email?
      flash.now[:error] = "User must have an email assigned"
    elsif !@signature_packets.present?
      flash.now[:error] = "Must send signature packets out using 'Email' type before you can remind"
    elsif @signature_packets.map(&:signature_pages).flatten.all?(&:sending?)
      flash.now[:error] = "Signature packets are being sent to signer. Reminders cannot be sent until packets have arrived."
    elsif @signature_packets.map(&:completed_at).all?
      flash.now[:error] = "All signature packets have already been signed"
    # check to see make sure they haven't sent a reminder in the last minute. Mostly to prevent double clicks or mistaken spamming.
    elsif !@signature_packets.first.reminder_email_timestamp.nil? && Time.now.utc - @signature_packets.first.reminder_email_timestamp < SignaturePacket::REMINDER_WAIT_TIME
      flash.now[:error] = "Please wait 1 minute to send another reminder email"
    else
      true
    end
  end

  def build_and_send_packets(signer)
    # if you do "send all", we will default to email type
    packet_type = 'email'
    manual_packet = signer.incomplete_manual_packet_on_deal(deal.id, packet_type) || signer.signature_packets.new(deal_id: deal.id)
    docusign_packet = signer.incomplete_docusign_packet_on_deal(deal.id, packet_type) || signer.signature_packets.new(deal_id: deal.id)
    manual_packet.message = params[:custom_message]
    docusign_packet.message = params[:custom_message]
    manual_packet.packet_type = packet_type
    docusign_packet.packet_type = packet_type
    manual_packet.send!(signer, false, current_entity_user, {multiple_send: true})
    docusign_packet.send!(signer, true, current_entity_user, {esignature_notifications_url: esignature_notifications_url, multiple_send: true})
  end

end
