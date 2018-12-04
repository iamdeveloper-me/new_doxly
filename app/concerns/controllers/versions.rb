module Controllers::Versions

  def view
    # This is used for signer as well so have to use :none. Since everyone has 'R' for version anyway, it should be OK.
    check_read(:none)
    render_unauthorized and return if tree_element&.tree_element_restrictions&.where(restrictable: current_deal_entity_user)&.any?
    path = version.view_path

    path = get_alternative_pdf_path unless path
    display_file(path)
  end

  def download
    # This is used for signer as well so have to use :none. Since everyone has 'R' for version anyway, it should be OK.
    check_read(:none)
    render_unauthorized and return if tree_element.tree_element_restrictions.where(restrictable: current_deal_entity_user).any?
    extension = File.extname(version.file_name)
    filename = extension.present? ? version.file_name : "#{version.file_name}#{version.file_type}"
    current_entity.events.create(module: 'Deal', action: "DOCUMENT_DOWNLOADED", eventable: version, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
    download_file(version.download_path, :filename => filename)
  end

  def download_thumbnail_sprite
    check_read(:none)
    render_unauthorized and return if tree_element.tree_element_restrictions.where(restrictable: current_deal_entity_user).any?
    path = version.thumbnail_sprite&.path || "#{Rails.root}/app/assets/images/ic-page-placement-empty.png"
    display_file(path, { type: 'image/png' })
  end

  private

  def deal
    @deal ||= current_entity_user&.all_deals&.find_by(id: params[:deal_id]) || current_user.signature_packets.where(deal_id: params[:deal_id]).first&.deal
  end

  def category
    @category ||= deal.categories.find_by(id: params[:category_id])
  end

  def tree_element
    @tree_element ||= category&.descendants&.find_by(id: params[:tree_element_id])
  end

  def attachment
    # attachment may be unplaced, in which case tree_element will return nil
    if tree_element
      @attachment ||= tree_element.attachment
    else
      @attachment ||= deal.unplaced_attachments.find(params[:attachment_id])
    end
  end

  def version
    @version ||= attachment.versions.find_by(id: params[:version_id] || params[:id])
  end

  def get_alternative_pdf_path
    if Delayed::Job.where(queue: 'download_from_dms_and_convert', failed_at: nil).where("handler LIKE '%gid://doxly/NetDocumentsVersionStorage/#{version&.version_storageable&.id}%'").any?
      path = "#{Rails.root}/public/viewer/web/downloading-from-net-documents.pdf"
    elsif Delayed::Job.where("handler LIKE '%gid://doxly/Version/#{version.id}%'").where(queue:"convert_to_pdf").any?
      path = "#{Rails.root}/public/viewer/web/converting-to-pdf.pdf"
    else
      path = "#{Rails.root}/public/viewer/web/cannot-preview.pdf"
    end
    path
  end

end
