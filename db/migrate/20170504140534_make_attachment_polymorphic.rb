class MakeAttachmentPolymorphic < ActiveRecord::Migration
  def change
    rename_column :attachments, :tree_element_id, :attachable_id
    add_column :attachments, :attachable_type, :string, default: "TreeElement"
    add_index :attachments, [:attachable_id, :attachable_type]
  end
end
