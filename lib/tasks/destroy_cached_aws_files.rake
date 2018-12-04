namespace :cached_aws_files do

  task :expire => :environment do
    CachedOriginalAwsFile.where.not(expiration_datetime: nil).where("expiration_datetime < ?", Time.now.utc).each { |cached_aws_file| cached_aws_file.destroy }
    CachedConvertedAwsFile.where.not(expiration_datetime: nil).where("expiration_datetime < ?", Time.now.utc).each { |cached_aws_file| cached_aws_file.destroy }
  end
end
