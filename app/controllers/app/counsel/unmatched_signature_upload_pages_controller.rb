class App::Counsel::UnmatchedSignatureUploadPagesController < App::ApplicationController
  def view
    check_read(:signature_management)
    display_file(path)
  end

  def download
    check_read(:signature_management)
    extension = File.extname(path)
    download_file(path, :filename => "#{File.basename(unmatched_signature_upload.file_name, ".*")}_page_#{unmatched_signature_upload_page.page_number}#{extension}")
  end

  private

  def deal
    @deal ||= current_entity_user&.all_deals&.find_by(id: params[:deal_id])
  end

  def unmatched_signature_upload
    @unmatched_signature_upload ||= deal.unmatched_signature_uploads.find_by(id: params[:unmatched_signature_upload_id])
  end

  def unmatched_signature_upload_page
    @unmatched_signature_upload_page ||= unmatched_signature_upload.unmatched_signature_upload_pages.find_by(id: params[:id])
  end

  def path
    @path ||= unmatched_signature_upload_page.unmatched_page_aws_file.path
  end
end
