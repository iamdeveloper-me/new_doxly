class SignaturePageCollection < ActiveRecord::Base
  belongs_to :tree_element_signature_group
  belongs_to :block_collection

  has_many   :signature_pages, dependent: :destroy
  has_one    :signature_packet_signature_page_collection, dependent: :destroy
  has_one    :tree_element, through: :tree_element_signature_group
  has_one    :signature_packet, through: :signature_packet_signature_page_collection
  has_one    :unsigned_aws_file, as: :aws_fileable, dependent: :destroy, autosave: true
  has_many   :signing_capacities, through: :signature_pages

  validates_presence_of :tree_element_signature_group, :unique_key
  validate :must_have_all_the_same_users
  validate :must_have_only_one_block_collection_through_signature_pages

  before_validation :set_unique_key

  def upload!(file)
    raise 'Need ID to upload. Please save the signature page_collection first.' if !id
      file_type = File.extname(file)
      self.unsigned_aws_file = UnsignedAwsFile.new(
        aws_fileable: self,
        entity: tree_element.deal.owner_entity,
        key: "#{get_base_aws_key}/unsigned-signature-page-collection#{file_type}"
      )
      self.unsigned_aws_file.upload(file)
    self.save
  end

  def get_base_aws_key
    "deal-#{tree_element.deal.id}/signature-management/signature-page-collections/signature-page-collections#{id}"
  end

  def generate(deal_signature_pages_base)
    blocks = block_collection.blocks
    file_path = "#{deal_signature_pages_base}/signature_page_collection#{self.id}.pdf"
    number_of_pages = 0

    # ******* ATTENTION!! AplicationHelper.retry_command swallows errors inside of it so that you can't
    # ******* trust the errors or even the critical error objects that get created from broken code inside of it.
    # ******* debuggers also don't work
    # ******* to debug, comment out the retry_command lines and run the code inside of it.
    # pdf = ApplicationHelper.retry_command do
      combined_pdf = CombinePDF.new
      custom_page_number = 0
      number_of_pages    = 0
      signature_pages.where(is_custom: true).each do |signature_page|
        signature_page.set_file_page_to_sign!(custom_page_number+=1)
        add_custom_pdf_signature_page(deal_signature_pages_base, combined_pdf, signature_page, custom_page_number)
        number_of_pages += 1 # add one for every custom page.
      end
      non_custom_pages = signature_pages.where(is_custom: false)
      if non_custom_pages.any?
        attempts = 0
        while non_custom_pages.where(file_page_to_sign: nil).any? && attempts < 3
          pdf_to_add_to = CombinePDF.new
          split_signature_page_collection = SignaturePageSplitter.split_signature_page(self, deal_signature_pages_base)
          number_of_pages += split_signature_page_collection.length # intialize as the split pages.length
          split_signature_page_collection.each do |key, value|
            normal_page_number = key.to_s.split('_').last.to_i + custom_page_number
            # kinda nasty and slow, but the arrays will be small and we can clean up later by transforming one the arrays into a index hash
            # page number in the file, only gets set if is_file_page_to_sign == true
            is_file_page_to_sign_array = []
            non_custom_pages.each do |signature_page|
              is_file_page_to_sign = value.map{|block| block[:ids] }.flatten.include?(signature_page.get_block&.id) # is this the file page to sign for this particular signature_page?
              is_file_page_to_sign_array << is_file_page_to_sign
              if is_file_page_to_sign
                signature_page.set_file_page_to_sign!(normal_page_number)
              end
            end
            add_pdf_signature_page(deal_signature_pages_base, value, pdf_to_add_to, { file_page_gets_signed: is_file_page_to_sign_array.include?(true), page_number: normal_page_number })
          end
          attempts += 1
        end
        # only add the pdf at then end to allow chances for success
        combined_pdf << pdf_to_add_to
      end
      combined_pdf.save file_path
    # end
    # need to clean up after creating the PDF, but we have to wait until the PDF is saved
    # delete all possible qr codes that could have been created
    delete_qr_codes(deal_signature_pages_base, (1..number_of_pages).to_a)
    # return the page file path
    [file_path, number_of_pages]
  end

  def has_linked_blocks?
    block_collection && block_collection.blocks.length > 1
  end

  def unique_key_for_address
    new_unique_key = self.unique_key.split('-').join
    new_unique_key[6..8] + new_unique_key[0..5]
  end

  def add_pdf_signature_page(deal_signature_pages_base, blocks, combined_pdf, options={})
    file_page_gets_signed = options.fetch(:file_page_gets_signed, false)
    page_number           = options.fetch(:page_number, nil)
    page_html = ApplicationController.new.render_to_string(template: 'app/counsel/signing_capacities/templates/signature_page_layout', locals: { signature_page_collection: self, :base_path => deal_signature_pages_base, blocks: blocks, file_page_gets_signed: file_page_gets_signed, page_number: page_number }, layout: false)
    combined_pdf << CombinePDF.parse(WickedPdf.new.pdf_from_string(page_html, {disable_internal_links: false, disable_external_links: false}))
  end

  def add_custom_pdf_signature_page(deal_signature_pages_base, combined_pdf, signature_page, page_number)
    ready_to_send_path = signature_page.add_qr_code_to_pdf(deal_signature_pages_base, page_number)
    combined_pdf << CombinePDF.load(ready_to_send_path, allow_optional_content: true)
  end

  def generate_qr_code(deal_signature_pages_base, options={})
    page_number = options.fetch(:page_number, nil)
    value       = options.fetch(:value, nil)
    value     ||= self.unique_key + page_number.to_s
    qr_code = Barby::QrCode.new(value, level: :q, size: 2)
    qr_code_image = File.open(qr_code_image_path(deal_signature_pages_base, page_number), 'wb'){|f| f.write Barby::PngOutputter.new(qr_code).to_png(xdim: 200, ydim: 200, margin: 0) }
    qr_code_image_path(deal_signature_pages_base, page_number)
  end

  def delete_qr_codes(deal_signature_pages_base, page_numbers_array)
    page_numbers_array.each do |page_number|
      File.delete(qr_code_image_path(deal_signature_pages_base, page_number)) if File.exist?(qr_code_image_path(deal_signature_pages_base, page_number))
    end
  end

  def qr_code_image_path(deal_signature_pages_base, page_number)
    "#{deal_signature_pages_base}/qr_code_#{self.id}#{page_number}.png"
  end

  private

  # ========= THESE ARE EXPENSIVE VALIDATIONS, BUT NECESSARY FOR INTEGRITY OF THE DB ========
  def must_have_all_the_same_users
    if signature_pages.map{|signature_page| signature_page.signing_capacity.user }.uniq.length > 1
      errors.add(:base, "Cannot hold more than one user's signature pages")
    end
  end

  def must_have_only_one_block_collection_through_signature_pages
    if signature_pages.map(&:block_collection).uniq.length > 1
      errors.add(:base, "Cannot have more than one block collection through signature_pages")
    end
  end

  def set_unique_key
    return if unique_key
    is_unique_key = false
    current_key   = nil
    until is_unique_key
      current_key = (0..3).map{ (0..3).map{ rand(10) }.join("") }.join("-")
      # need to make sure it is unique across all signature pages
      is_unique_key = SignaturePageCollection.where(:unique_key => current_key).empty?
    end
    self.unique_key = current_key
  end

end
