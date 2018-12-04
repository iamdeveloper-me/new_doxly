class DownloadFromDmsAndConvertJob < ApplicationJob
  queue_as :download_from_dms_and_convert

  def perform(dms_version_storage)
    begin
      begin
        attempts = 0
        file_path = dms_version_storage.download
        file = File.open(file_path)
      rescue
        # attempt up to 3 times
        retry if attempts += 1 < 4
      end
      dms_version_storage.upload!(file)
      dms_version_storage.generate_converted
    ensure
      File.delete(file.path) if File.exist?(file&.path.to_s)
    end
  end
end
