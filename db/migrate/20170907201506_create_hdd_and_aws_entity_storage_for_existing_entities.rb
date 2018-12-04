class CreateHddAndAwsEntityStorageForExistingEntities < ActiveRecord::Migration
  def change
    FileUtils.mkdir_p(ApplicationHelper.hdd_storage_root)
    FileUtils.mkdir_p(ApplicationHelper.temp_dir_root)
    FileUtils.mkdir_p(ApplicationHelper.signature_management_root)
    FileUtils.mkdir_p(ApplicationHelper.closing_books_root)
    Entity.all.each do |entity|
      entity.build_hdd_entity_storage unless entity.hdd_entity_storage
      entity.build_aws_entity_storage unless entity.aws_entity_storage
      entity.save
    end
  end
end
