namespace :documents do

  # Task to back up the documents in a zip file for the data room or closing category of a deal. This currently backups the following:
  # -> all versions of each attachment if all_versions is 'yes'
  # -> only the latest version if all_versions is 'no'
  # :category_name => 'data_room' or 'closing'
  # :all_versions => 'yes' or 'no'
  task :backup, [:deal_id, :category_name, :all_versions] => :environment do |t, args|
    deal_id       = args[:deal_id]
    category_name = args[:category_name]
    all_versions  = args[:all_versions] == "yes"
    
    deal           = Deal.find(deal_id)
    category       = category_name == "data_room" ? deal.diligence_category : deal.closing_category
    zip_file_path  = "#{Rails.root}/documents.zip"
    documents_path = "#{Rails.root}/documents_backup"
    documents      = category.descendants.with_attachment
    count          = documents.size

    FileUtils.rm_r(documents_path) if Dir.exist?(documents_path)
    Dir.mkdir(documents_path)

    puts "INFO: Downloading and zipping #{count} #{category_name} documents of the deal '#{deal.title}'"

    documents.each_with_index do |tree_element, i|
      versions       = all_versions ? tree_element.attachment.versions : Array(tree_element.latest_version)
      document_name  = tree_element.name
      base_file_name = ApplicationHelper.sanitize_filename(document_name)

      puts "INFO: Downloading #{i+1} of #{count} documents (#{versions.size} versions)"

      versions.each do |version|
        position  = version.position
        file_path = "#{documents_path}/#{base_file_name}_v#{position}#{version.file_type}"

        # ensure that the file name is unique
        file_num  = 1
        until !File.exist?(file_path)
          file_path = "#{documents_path}/#{base_file_name}_#{file_num}_v#{position}#{version.file_type}"
          file_num += 1
        end

        begin
          open(file_path, 'wb') do |file|
            file << open(version.original_path).read
          end
        rescue StandardError => e
          puts "ERROR: Error downloading document version #{position} for #{document_name}"
          puts "ERROR DETAIL: #{e}"
          FileUtils.rm_rf(documents_path)
          exit 1
        end
      end
    end
    # create the zip file
    zip_file = ZipFileGenerator.new(documents_path, zip_file_path)
    if zip_file.write
      puts "SUCCESS: Zip file created with all the documents at #{zip_file_path}"
    else
      puts "ERROR: Could not create the zip file #{zip_file_path} from the downloaded documents"
    end
    # clean up
    FileUtils.rm_rf(documents_path)
  end

end