require 'sprite_factory'

class CreateThumbnailsJob < ApplicationJob
  queue_as :create_thumbnails

  def perform(object)
    return unless FileConvert::SUPPORTED_FILE_FORMATS.include?(object.file_type)
    # create the object's thumbnail storage
    object.thumbnail_storage.destroy if object.thumbnail_storage.present?
    object.create_thumbnail_storage
    # try the download_converted method (for version) and the download_signed (for signature_pages)
    object_pdf_path = object.try(:converted_path) || object.try(:signed_file_path) || object.try(:unsigned_file_path) #downloads the pdf file and saves to a temp file
    combine_pdf_object = CombinePDF.load(object_pdf_path, allow_optional_content: true)
    if object.is_a?(Version)
      object.page_count = combine_pdf_object.pages.length
      object.save
    end

    # create directory
    thumbnail_dir = Dir.mktmpdir('/thumbnails-', ApplicationHelper.temp_dir_root)

    # create thumbnail for each page
    combine_pdf_object.pages.each_with_index do |page, i|
      begin
        # initialize
        attempts ||= 0

        # put the pdf page into a tempfile and save
        page_path = Tempfile.new(['page', '.pdf'], ApplicationHelper.temp_dir_root).path
        page_pdf = CombinePDF.new
        page_pdf << page
        page_pdf.save(page_path)

        # convert to thumbnail using ImageMagick, save to thumbnails directory
        ApplicationHelper.im_image_from_path(page_path) do |image|
          thumbnail           = image.change_geometry('85') {|cols, rows, image| image.resize!(cols, rows)}
          thumbnail.alpha     = Magick::BackgroundAlphaChannel
          thumbnail.write("#{thumbnail_dir}/thumbnail-#{i.to_s.rjust(6, "0")}.png") # allow up to 999,999 pages (6 digits) in the PDF
          thumbnail.destroy!
        end
      rescue
        # retry 3 times
        retry if (attempts += 1) <= 3

        # if all the retries failed, save the generic thumbnail instead
        FileUtils.cp("#{Rails.root}/app/assets/images/ic-page-placement-empty.png", "#{thumbnail_dir}/thumbnail-#{i.to_s.rjust(6, "0")}.png")
      ensure
        # close/delete
        File.delete(page_path) if File.exist?(page_path)
      end
    end

    if File.exist?(thumbnail_dir)
      sprite_path = "#{thumbnail_dir}/sprite.png"
      SpriteFactory.run!(thumbnail_dir, output_image: sprite_path)
      file = File.open(sprite_path)
      begin
        object.thumbnail_storage.upload_sprite!(file)
      ensure
        file.close if file
      end
      FileUtils.remove_entry_secure(thumbnail_dir)
    end
  end
end
