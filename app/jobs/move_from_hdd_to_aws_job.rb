class MoveFromHddToAwsJob < ApplicationJob
  queue_as :move_from_hdd_to_aws

  def perform(version)
    old_version_storageable = version.version_storageable
    raise "Version storageable must be HddVersionStorage." unless old_version_storageable.is_a?(HddVersionStorage)

    # create
    aws_version_storage = AwsVersionStorage.new(version: version)

    # upload original file
    original_file = File.open(old_version_storageable.original_path)
    begin
      unless aws_version_storage.upload!(original_file, 'original')
        raise 'unable to save AwsVersionStorage.'
      end
      if File.extname(original_file).downcase == '.pdf'
        aws_version_storage.converted_aws_file = ConvertedAwsFile.new(
          aws_fileable: aws_version_storage,
          entity: version.get_entity,
          key: "#{aws_version_storage.get_base_aws_key}/original.pdf"
        )
        aws_version_storage.save
      else
        # upload converted file, if available
        if old_version_storageable.converted_path.present?
          converted_file = File.open(old_version_storageable.converted_path)
          aws_version_storage.upload!(converted_file, 'converted')
        end
      end
      old_version_storageable.destroy
    rescue StandardError => e
      aws_version_storage.destroy unless aws_version_storage.new_record?
      version.version_storageable = old_version_storageable
      version.save
      raise "unable to move file from HDD to AWS: #{e}"
    ensure
      original_file.close if original_file
      converted_file.close if converted_file
    end
  end
end
