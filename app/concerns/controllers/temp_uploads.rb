module Controllers::TempUploads

  def view
    check_read(:none)
    render_unauthorized and return unless temp_upload
    pdf_path = temp_upload.view_path
    if pdf_path.nil? || !File.exist?(pdf_path)
      pdf_path = "#{Rails.root}/public/viewer/web/cannot-preview.pdf"
    end
    display_file(pdf_path)
  end

  def preview
    check_read(:none)
    render_unauthorized and return unless temp_upload
    image_path = temp_upload.preview_image_path
    if image_path.nil? || !File.exist?(image_path)
      image_path = "#{Rails.root}/app/assets/images/cannot-preview.jpg"
    end
    display_file(image_path, type: 'image/jpeg')
  end

  def download
    check_read(:none)
    render_unauthorized and return unless temp_upload
    download_file(temp_upload.original_path, :filename => temp_upload.file_name)
  end

  private

  def temp_upload
    @temp_upload ||= params[:id].present? ? current_user.temp_uploads.find_by(id: params[:id]) : current_user.temp_uploads.new
  end

end