class CreateThumbnailsForAllFinalVersions < ActiveRecord::Migration
  def change
    deals = Deal.where(status: 'open').where('created_at > ?', 5.months.ago)
    errors_count = 0
    deals_count = deals.length
    puts "Found #{deals_count} relevant deals"
    deals.each_with_index do |deal, x|
      deal_number = (x + 1)
      puts "Starting deal number #{deal_number} with id of #{deal.id} out of #{deals_count} total"
      deal_versions = deal.closing_category.descendants.where(type: 'Document').map(&:latest_version).compact.select{ |document| document.status == 'final' }
      deal_versions_count = deal_versions.length
      puts "found #{deal_versions_count} final versions for deal with id #{deal.id}"
      deal_versions.each_with_index do |object, z|
        begin
          puts "starting on version with id of #{object.id} in deal with id #{deal.id}"
          object.create_thumbnail_storage
          puts "created thumbnail storage"
        # try the download_converted method (for version) and the download_signed (for signature_pages)
          object_pdf_path = object.view_path #downloads the pdf file and saves to a temp file
          puts "downloaded thumbnail storage"
          combine_pdf_object = CombinePDF.load(object_pdf_path, allow_optional_content: true)
        rescue StandardError => error
          errors_count += 1
          puts "======================================================="
          puts "======================================================="
          puts "version id #{object.id} with position #{z + 1} broke:"
          puts error
          puts "======================================================="
          puts "======================================================="
          next
        ensure
          if object_pdf_path
            File.delete(object_pdf_path)
          end
        end

        combine_pdf_object.pages.each_with_index do |page, i|
          begin
            # put the pdf page into a tempfile and save

            page_path = Tempfile.new("", ApplicationHelper.temp_dir_root).path
            page_pdf = CombinePDF.new
            page_pdf << page
            page_pdf.save(page_path)
            puts "saved individual pdf"
            # convert to thumbnail using ImageMagick

            img = Magick::Image.read(page_path) do
              self.quality = 80
              self.density = '300'
            end.first
            width = '85'
            thumbnail = img.change_geometry(width) {|cols, rows, img| img.resize!(cols, rows)}
            thumbnail.alpha = Magick::BackgroundAlphaChannel # set the background to be white
            puts "converted to an image using ImageMagick"
            # save the thumbnail in a tempfile path
            thumbnail_file_path = Tempfile.new("", ApplicationHelper.temp_dir_root).path
            thumbnail.write(thumbnail_file_path)
            # clean up
            img.destroy!
            thumbnail.destroy!
            # open the thumbnail file and upload to aws
            file = File.open(thumbnail_file_path) if File.exist?(thumbnail_file_path)
            puts "saved new image into a tempfile"
            unless object.thumbnail_storage.upload!(file, i + 1)
              raise object.thumbnail_storage.errors.full_messages
            end
            puts "uploaded successfully to aws"
          rescue StandardError => error
            puts "======================================================="
            puts "======================================================="
            puts "thumbnail for page #{i + 1} broke:"
            puts error
            puts "======================================================="
            puts "======================================================="
          ensure
            # close/delete all the files if anything breaks.
            file.close if file
            File.delete(page_path) if File.exist?(page_path.to_s)
            File.delete(thumbnail_file_path) if File.exist?(thumbnail_file_path.to_s)
          end
        end
      end
    end
  end
end
