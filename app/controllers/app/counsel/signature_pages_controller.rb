class App::Counsel::SignaturePagesController < App::ApplicationController
  layout 'deals'
  include Controllers::OwningEntity
  include Controllers::SignatureChecks
  include Controllers::CustomSignaturePages

  def index
    check_read(:signature_management)
    @tree_elements        = deal.closing_category.documents_requiring_signature_with_position
    @signature_groups     = deal.signature_groups
  end

  def signature_groups
    check_read(:signature_management)
    tree_element
    render 'update_signature_groups_view'
  end

  def show_signature_page
    check_read(:signature_management)
    tree_element
    signature_group
    @signing_capacity = @signature_group.all_signing_capacities.find{|signing_capacity| signing_capacity.id == params[:signing_capacity_id].to_i}
    render 'update_signature_page_view'
  end

  def show_signature_page_entity
    check_read(:signature_management)
    tree_element
    signature_group
    @signature_entity = @signature_group.signature_entities.find(params[:signature_entity_id])
    render 'update_signature_page_entity_view'
  end

  def view_signature_page
    check_read(:signature_management)
    signature_group
    signing_capacity
    @signature_pages = tree_element_signature_group.signature_pages.where :signing_capacity_id => signing_capacity.id
  end

  def upload_custom_signature_page
    check_create(:signature_management)
    if use_template
      forbid_if_signature_pages_sent("Cannot upload the custom page template because one or more signature page have already been sent"){return}
    else
      forbid_if_signature_page_sent("Cannot upload custom page because signature page has already been sent"){return}
      tree_element
    end
    signature_page
  end

  def uploaded_custom_signature_page
    check_create(:signature_management)
    if use_template
      forbid_if_signature_pages_sent("Cannot upload the custom page template because one or more signature page have already been sent"){return}
    else
      forbid_if_signature_page_sent("Cannot upload custom page because signature page has already been sent"){return}
      tree_element
    end
    uploaded_file = params[:signature_page][:file]
    file_extension = File.extname(uploaded_file.original_filename.downcase) if uploaded_file.present?
    if uploaded_file.present? && SignaturePage::SUPPORTED_CUSTOM_PAGE_FORMATS.include?(file_extension)
      if save_custom_page(file_extension)
        @tree_element = signature_page.tree_element
      else
        signature_page.errors.add(:base, :could_not_convert_file)
        render :upload_custom_signature_page and return
      end
    else
      signature_page.errors.add(:base, :custom_page_upload_must_be_right_extension)
      render :upload_custom_signature_page and return
    end
  end

  def choose_from_document
    check_create(:signature_management)
    signature_page
    @version = signature_page.tree_element.latest_version
  end

  def view_document_page
    check_create(:signature_management)
    document = signature_page.tree_element
    version  = document.latest_version
    page     = params[:page].to_i
    @url     = ApplicationHelper.viewer_url(view_deal_category_tree_element_attachment_version_path(deal.id, deal.closing_category, document, version.attachment, version), :page_num => page+1)
    @title   = document.name
  end

  def process_choose_from_document
    check_create(:signature_management)
    signature_page
    @tree_element = signature_page.tree_element
    @coming_from  = :document
    if params[:page].present?
      if @tree_element.latest_version
        if save_document_custom_page
          render 'uploaded_custom_signature_page' and return
        end
        # if it made it to here, something broke with combine PDF
        signature_page.errors.add(:base, :document_page_could_not_be_saved)
      else
        signature_page.errors.add(:base, :document_could_not_be_retrieved)
      end
    else
      @version = signature_page.tree_element.latest_version
      signature_page.errors.add(:base, :select_a_document_page)
    end
    render 'choose_from_document'
  end

  def remove_custom_signature_page
    check_create(:signature_management)
    if use_template
      forbid_if_signature_pages_sent("Cannot remove the signature page template as one or more pages have already been sent"){return}
    else
      forbid_if_signature_page_sent("Cannot remove a signature page that has already been sent"){return}
      signing_capacity
      tree_element
    end
    signature_group
    # reset all the pages including the copies if signature_page has not been sent
    pages = use_template ? tree_element_signature_group.signature_pages.using_template : tree_element_signature_group.signature_pages.where(signing_capacity_id: signature_page.signing_capacity_id)
    pages.each do |page|
      page.reset_signature_page_to_non_custom
    end
    render 'update_signature_page_view'
  end

  def edit_custom_signature_page
    check_create(:signature_management)
    if use_template
      forbid_if_signature_pages_sent("Cannot edit the signature page template as one or more pages have already been sent"){return}
    else
      forbid_if_signature_page_sent("Cannot edit a signature page that has already been sent"){return}
    end
    signing_capacity
    tree_element
    signature_page
    @editing = true
    render :uploaded_custom_signature_page
  end

  def view
    check_read(:signature_management)
    display_file(signature_page_path)
  end

  def download
    check_read(:signature_management)
    page_name = "signature_page_for_#{ApplicationHelper.sanitize_filename(signature_page_to_view.signing_capacity.name.downcase)}#{signature_page_to_view.file_type}"
    download_file(signature_page_path, :filename => page_name)
  end

  def download_thumbnail_sprite
    check_read(:signature_management)
    display_file(signature_page.thumbnail_sprite.path, { type: 'image/png' })
  end

  def download_custom_page_thumbnail
    check_read(:signature_management)
    display_file(signature_page.custom_page_thumbnail_aws_file&.path || "#{Rails.root}/app/assets/images/default-custom-signature-page-preview-image.png", { type: 'image/png' })
  end

  def show_custom_signature_page
    check_create(:signature_management)
    path = get_file_path({ file_extension: '.jpg' })
    path = signature_page.custom_page_preview_aws_file&.path unless File.exist?(path)
    display_file(path, { type: 'image/jpeg' })
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def tree_element
    @tree_element ||= deal.closing_category.descendants.find_by(id: params[:tree_element_id])
  end

  def signature_group
    @signature_group ||= deal.signature_groups.find(params[:signature_group_id])
  end

  def signing_capacity
    @signing_capacity ||= signature_group.all_signing_capacities.find{|signing_capacity| signing_capacity.id == params[:signing_capacity_id].to_i}
  end

  def signature_page
    @signature_page ||= signing_capacity.signature_pages.find(params[:signature_page_id] || params[:id])
  end

  def tree_element_signature_group
    @tree_element_signature_group ||= tree_element.tree_element_signature_groups.find_by(signature_group_id: signature_group.id)
  end

  def save_custom_page(file_extension)
    convert_to_pdf = -> (unprocessed_file_path, output_pdf_path) {
      begin
        conversion_response = FileConvert.process_file_conversion(unprocessed_file_path, output_pdf_path, true)
        save_conversion_response(conversion_response)
      rescue StandardError => e
        conversion_response = { tool: 'unknown', is_successful: false, response: { error: e.message } }
        save_conversion_response(conversion_response)
      end
      # don't move forward if the conversion was not successful
      return false unless File.exist?(output_pdf_path)
      # successful
      true
    }

    begin
      # write the uploaded file to a local path
      unprocessed_file_path = get_file_path({ processed: false, file_extension: file_extension })
      output_pdf_path       = get_file_path
      output_jpg_path       = get_file_path({ file_extension: '.jpg' })

      File.delete(output_pdf_path) if File.exist?(output_pdf_path)
      # download the file
      File.open(unprocessed_file_path, "wb") { |f| f.write(params[:signature_page][:file].read) }

      # convert first page to pdf
      return false unless convert_to_pdf.call(unprocessed_file_path, output_pdf_path)
     
      # convert the pdf to jpg for preview
      return false unless convert_to_jpg(output_pdf_path, output_jpg_path)

      # move all the files to aws
      move_files_to_aws(unprocessed_file_path, output_pdf_path, output_jpg_path)

      # return success
      true
    rescue Exception => e
      deal.create_critical_error(:custom_page_error, { user_message: "Unable to process custom page", exception: e })
      false
    end
  end

  def save_document_custom_page
    page_number        = params[:page].to_i
    document_path      = @tree_element.latest_version.converted_path
    output_pdf_path    = get_file_path
    output_jpg_path    = get_file_path({ file_extension: '.jpg' })
    # load the document
    combine_pdf_object = ApplicationHelper.retry_command do
      CombinePDF.load(document_path, allow_optional_content: true)
    end
    # nothing to do if unable to load
    return false unless combine_pdf_object
    begin
      page_to_copy = combine_pdf_object.pages[page_number]
      # nothing to do if page doesn't exist
      return false unless page_to_copy
      # delete the existing file
      File.delete(output_pdf_path) if File.exist?(output_pdf_path)
      # save the page to a new file
      custom_page = CombinePDF.new
      begin
        custom_page << page_to_copy
        custom_page.save(output_pdf_path)
      ensure
        custom_page = nil
      end
      if File.size?(output_pdf_path) && convert_to_jpg(output_pdf_path, output_jpg_path)
        # in this case, the converted pdf and the original file are the save
        move_files_to_aws(output_pdf_path, output_pdf_path, output_jpg_path)
        # everything was successful
        true
      else
        false
      end
    ensure
      combine_pdf_object = nil
    end
  end

  def signature_page_to_view
    @signature_page_to_view ||= deal.signature_pages.find(params[:id])
  end

  def signature_page_path
    (params[:signed] == "true") ? signature_page_to_view.signed_file_path : signature_page_to_view.unsigned_file_path
  end

  def use_template
    params[:use_template] == "true"
  end

  def save_conversion_response(response)
    signature_page.conversions.new.save_new!(response)
  end

  def convert_to_jpg(output_pdf_path, output_jpg_path)
    ApplicationHelper.im_image_from_path(output_pdf_path) do |image|
      image.write(output_jpg_path)
    end
    # don't move forward if the conversion was not successful
    File.exist?(output_jpg_path)
  end

  def move_files_to_aws(unprocessed_file_path, output_pdf_path, output_jpg_path)
    MoveCustomSignaturePageFilesToAwsJob.perform_later(signature_page, {
      original_file_path: unprocessed_file_path,
      converted_file_path: output_pdf_path,
      converted_file_preview_path: output_jpg_path
    })
  end

end
