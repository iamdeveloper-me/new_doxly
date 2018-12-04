class MigrateVersionConverstions < ActiveRecord::Migration
  def change
    versions_table             = Arel::Table.new(:versions)
    conversions_table          = Arel::Table.new(:conversions)
    hdd_version_storages_table = Arel::Table.new(:hdd_version_storages)
    aws_version_storages_table = Arel::Table.new(:aws_version_storages)
    aws_files_table            = Arel::Table.new(:aws_files)

    versions_sql      = versions_table.project(Arel.sql("*")).to_sql
    versions          = ActiveRecord::Base.connection.execute(versions_sql)

    versions.each do |version|
      if version["version_storageable_id"].present?
        version_id = version["id"]

        if FileConvert::SUPPORTED_FILE_FORMATS.include?(version["file_type"])
          version_storageable_id     = version["version_storageable_id"]
          version_storageable_type   = version["version_storageable_type"]

          if version_storageable_type == "HddVersionStorage"
            hdd_version_storages_sql  = hdd_version_storages_table.where(hdd_version_storages_table["id"].eq(version_storageable_id)).project(Arel.sql("*")).to_sql
            hdd_version_storages      = ActiveRecord::Base.connection.execute(hdd_version_storages_sql)
            is_converted              = hdd_version_storages.first["converted_path"].present?
          else
            aws_version_storages_sql  = aws_version_storages_table.where(aws_version_storages_table["id"].eq(version_storageable_id)).project(Arel.sql("*")).to_sql
            aws_version_storages      = ActiveRecord::Base.connection.execute(aws_version_storages_sql)
            converted_aws_file_sql     = aws_files_table.where(aws_files_table["aws_fileable_id"].eq(aws_version_storages.first["id"]).and(aws_files_table["aws_fileable_type"].eq(version_storageable_type)).and(aws_files_table["type"].eq("ConvertedAwsFile"))).project(Arel.sql("*")).to_sql
            converted_aws_file         = ActiveRecord::Base.connection.execute(converted_aws_file_sql)
            is_converted               = converted_aws_file.count > 0
          end

          if is_converted
            insert_manager = Arel::InsertManager.new conversions_table.engine
            insert_manager.insert [
              [conversions_table[:tool], "unknown"],
              [conversions_table[:convertable_type], "Version"],
              [conversions_table[:convertable_id], version_id],
              [conversions_table[:is_successful], true],
              [conversions_table[:response], { message: "File successfully converted"}],
              [conversions_table[:created_at], Time.now.utc],
              [conversions_table[:updated_at], Time.now.utc]
            ]
            ActiveRecord::Base.connection.execute insert_manager.to_sql
          else
            insert_manager = Arel::InsertManager.new conversions_table.engine
            insert_manager.insert [
              [conversions_table[:tool], "unknown"],
              [conversions_table[:convertable_type], "Version"],
              [conversions_table[:convertable_id], version_id],
              [conversions_table[:is_successful], false],
              [conversions_table[:response], { message: "File could not be converted"}],
              [conversions_table[:created_at], Time.now.utc],
              [conversions_table[:updated_at], Time.now.utc]
            ]
            ActiveRecord::Base.connection.execute insert_manager.to_sql
          end
        else
          insert_manager = Arel::InsertManager.new conversions_table.engine
          insert_manager.insert [
            [conversions_table[:tool], "none"],
            [conversions_table[:convertable_type], "Version"],
            [conversions_table[:convertable_id], version_id],
            [conversions_table[:is_successful], false],
            [conversions_table[:response], { message: "Unsupported file or conversion format (#{version["file_type"]} to .pdf)"}],
            [conversions_table[:created_at], Time.now.utc],
            [conversions_table[:updated_at], Time.now.utc]
          ]
          ActiveRecord::Base.connection.execute insert_manager.to_sql
        end
      end
    end
  end
end
