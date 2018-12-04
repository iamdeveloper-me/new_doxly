class MigrateOrphanDocumentsToDealAttachments < ActiveRecord::Migration
  def change
    Attachment.all.each do |attachment|
      tree_element = attachment.attachable
      if tree_element.is_a?(Document) && tree_element.owner_type == "Deal"
        attachment.attachable_id = tree_element.owner_id
        attachment.attachable_type = tree_element.owner_type
        attachment.save

        version = attachment.versions.first
        version.file_name = "#{tree_element.name}"
        version.save

        tree_element.reload.destroy
      end
    end
  end
end
