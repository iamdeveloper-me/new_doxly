namespace :conversions do

  task :process => :environment do
    # only select versions where the latest conversion attempt was a failure
    versions = Version.includes(:conversions).joins(:conversions).where("conversions.id = (SELECT id FROM conversions WHERE 
        convertable_type = 'Version' AND 
        convertable_id = versions.id 
        ORDER BY created_at DESC 
        LIMIT 1) AND conversions.is_successful IS FALSE AND conversions.tool != 'none'"
    ).select do |version|
      storageable = version.version_storageable
      storageable.try(:converted_aws_file).nil? && storageable.try(:cached_converted_aws_file).nil? && storageable.try(:converted_path).nil? 
    end
    versions.each do |version|
      # we try a total of 4 times and give up
      if version.conversions.size < Version::CONVERSION_ATTEMPTS
        # Retry the conversion
        ConvertToPdfJob.perform_later(version)
      end
    end
  end

end