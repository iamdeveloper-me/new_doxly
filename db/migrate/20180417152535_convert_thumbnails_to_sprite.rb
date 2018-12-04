class ConvertThumbnailsToSprite < ActiveRecord::Migration
  def change
    #### REMOVE EXISTING THUMBNAILS ####
    # delete thumbnail storages
    thumbnail_storages = Arel::Table.new(:thumbnail_storages)
    thumbnail_storages_delete_manager = Arel::DeleteManager.new(ActiveRecord::Base)
    thumbnail_storages_delete_manager.from(thumbnail_storages)
    thumbnail_storages_delete_manager.to_sql

    # delete thumbnails
    aws_files = Arel::Table.new(:aws_files)
    aws_files_delete_manager = Arel::DeleteManager.new(ActiveRecord::Base)
    aws_files_delete_manager.from(aws_files).where(aws_files[:aws_fileable_type].eq('ThumbnailStorage'))
    aws_files_delete_manager.to_sql

    #### GENERATE THUMBNAIL SPRITES ####
    # create thumbnail sprite for signature pages
    SignaturePage.where(signature_status: 'signed').each do |signature_page|
      CreateThumbnailsJob.perform_later(signature_page)
    end

    # create thumbnail sprite for latest versions of tree elements
    latest_versions = TreeElement.where(signature_required: true).map(&:latest_version)
    latest_versions.each do |latest_version|
      if latest_version && FileConvert.is_supported_file_type?(latest_version.file_type)
        CreateThumbnailsJob.perform_later(latest_version)
      end
    end
  end
end