class App::Counsel::TreeElementsController < App::ApplicationController
  include Controllers::SignatureChecks

  def set_signature_type
    check_update(get_type)
    tree_element.sign_manually = params["type"] == "manual"
    tree_element.save
    render 'shared/blank'
  end

  def set_show_footer
    check_update(get_type)
    forbid_if_signatures_sent("Cannot change the footer after signatures have been sent"){return}
    tree_element.show_signature_page_footer = params[:checked] == "true"
    tree_element.save
    render 'shared/blank'
  end

  def set_show_header
    check_update(get_type)
    tree_element.show_signature_page_header = params[:checked] == "true"
    tree_element.save
    render 'shared/blank'
  end

  def set_show_address
    check_update(get_type)
    forbid_if_signatures_sent("Cannot change the address after signatures have been sent"){return}
    tree_element.show_address_on_signature_page = params[:checked] == "true"
    tree_element.save
    render 'shared/blank'
  end

  def set_show_date_signed
    check_update(get_type)
    forbid_if_signatures_sent("Cannot change the date signed after signatures have been sent"){return}
    tree_element.show_signing_capacity_date_signed = params[:checked] == "true"
    tree_element.save
    render 'shared/blank'
  end

  def set_signature_page_header
    check_update(get_type)
    if !params[:tree_element][:signature_page_header_text].blank?
      tree_element.signature_page_header_text = params[:tree_element][:signature_page_header_text].strip
      tree_element.save
      render 'signature_pages/update_signature_page_view' and return
    else
      tree_element.errors.add(:signature_page_header_text, "cannot be blank")
      render 'tree_elements/edit_signature_page_header' and return
    end
  end

  def set_signature_page_footer
    check_update(get_type)
    forbid_if_signatures_sent("Cannot change the footer after signatures have been sent"){return}
    if !params[:tree_element][:signature_page_document_name].blank?
      tree_element.signature_page_document_name = params[:tree_element][:signature_page_document_name].strip
      tree_element.save
      render 'signature_pages/update_signature_page_view' and return
    else
      tree_element.errors.add(:signature_page_document_name, "cannot be blank")
      render 'tree_elements/edit_signature_page_footer' and return
    end
  end

  def edit_signature_page_header
    check_update(get_type)
    tree_element
    render 'tree_elements/edit_signature_page_header'
  end

  def edit_signature_page_footer
    check_update(get_type)
    forbid_if_signatures_sent("Cannot change the footer after signatures have been sent"){return}
    tree_element
    render 'tree_elements/edit_signature_page_footer'
  end

  def update_multiple_pages
    check_update(get_type)
    if tree_element.has_signature_packets?
      flash.now[:error] = "Cannot change the number of signature page copies after signatures have been sent"
      render :update_multiple_pages and return
    end
    # update number_of_signature_page_copies field on the tree_element. No longer creating additional signature_page objects in database.
    if params[:document] && params[:document][:number_of_signature_page_copies]
      number_of_signature_page_copies = params[:document][:number_of_signature_page_copies].to_i
      tree_element.number_of_signature_page_copies = number_of_signature_page_copies
      tree_element.save
      flash.now[:success] = "Number of copies successfully changed"
      render 'shared/blank'
    end
  end

  def render_redline_pdf
    check_read(:version)
    # attachment is scoped to entity_user, so this is an effective security check.
    render_unauthorized and return unless attachment.present?
    filename = params[:pdf_path].split('/').last
    if params[:pdf_path].chomp('.pdf').length != params[:pdf_path]
      send_data(open(params[:pdf_path]){|f| f.read }, filename: filename, :type => "application/pdf", :disposition => "attachment")
    else
      send_file(params[:pdf_path], file_name: filename, type: 'application/docx')
    end
    File.delete(params[:pdf_path])
  end

  protected

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def category
    @category ||= deal.categories.find(params[:category_id])
  end

  def parent
    @parent ||= category.subtree.find(params[:parent_id])
  end

  def tree_element
    @tree_element ||= (params[:tree_element_id].blank? && params[:id].blank?) ? parent.children.new : category.descendants.find_by(id: params[:tree_element_id] || params[:id]) || (deal.unplaced_attachments.find_by(id: params[:tree_element_id] || params[:id]))
  end

  def attachment
    @attachment ||= tree_element.attachment || tree_element.build_attachment
  end

  private

  def tree_element_params
    params.require(:tree_element).permit(:name, :signature_page_document_name, :signature_page_header_text, :description, :deal_entity_user_id, :signature_type, :details)
  end

  def valid_tree_element_params
    return tree_element_params unless tree_element.has_signature_packets?
    # prevent modifying the signature options if the pages have already been sent
    tree_element_params.reject { |key, value| ["name", "signature_page_document_name", "signature_page_header_text", "signature_type"].include?(key) }
  end

  def get_type
    tree_element.type&.downcase&.to_sym || params[:type]&.downcase&.to_sym
  end

end
