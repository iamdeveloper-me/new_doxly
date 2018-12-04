class MoveLibraryIdOntoUserCredential < ActiveRecord::Migration
  def change
    remove_column :imanage10_entity_storages, :library_id
    add_column    :imanage10_user_credentials, :library_id, :string
  end
end
