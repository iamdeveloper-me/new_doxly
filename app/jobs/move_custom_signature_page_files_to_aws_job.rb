class MoveCustomSignaturePageFilesToAwsJob < ApplicationJob
  queue_as :move_custom_signature_page_files_to_aws

  def perform(signature_page, options={})
    original_file_path          = options.fetch(:original_file_path, nil)
    converted_file_path         = options.fetch(:converted_file_path, nil)
    converted_file_preview_path = options.fetch(:converted_file_preview_path, nil)

    # process all the file moves
    move_file(signature_page, original_file_path, 'original_custom_page')
    move_file(signature_page, converted_file_path, 'converted_custom_page')
    move_file(signature_page, converted_file_preview_path, 'custom_page_preview')
    # generate the thumbnail and move it
    thumbnail_file = Tempfile.new(['custom_page_thumbnail', '.png'], ApplicationHelper.temp_dir_root)
    begin
      ApplicationHelper.im_image_from_path(converted_file_preview_path) do |image|
        preview           = image.change_geometry(230*2) {|cols, rows, image| image.resize!(cols, rows)}
        preview.alpha     = Magick::BackgroundAlphaChannel
        preview.write(thumbnail_file.path)
        preview.destroy!
      end
      move_file(signature_page, thumbnail_file.path, 'custom_page_thumbnail')
    rescue
      # couldn't generate the thumbnail, just use the preview image as the thumbnail
      move_file(signature_page, converted_file_preview_path, 'custom_page_thumbnail')
    end

    # destroy all the files from the server
    # Note: we don't destroy the converted_file_path yet as this will be uploaded as 'unsigned' once tabs are placed and saved
    # in the case of selecing page from the document, original and converted are the same, so we don't destroy original in that case as well
    File.delete(original_file_path) if File.exist?(original_file_path) && original_file_path != converted_file_path
    File.delete(converted_file_preview_path) if File.exist?(converted_file_preview_path)
    File.delete(thumbnail_file.path) if File.exist?(thumbnail_file.path)
  end

  def move_file(signature_page, file_path, key)
    return unless File.exist?(file_path.to_s)
    file_object = File.open(file_path)
    begin
      ApplicationHelper.retry_command do
        signature_page.upload!(file_object, key)
      end
    ensure
      file_object.close
    end
  end
end