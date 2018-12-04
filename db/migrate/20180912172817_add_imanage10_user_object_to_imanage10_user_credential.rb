class AddImanage10UserObjectToImanage10UserCredential < ActiveRecord::Migration
  def change
    add_column :imanage10_user_credentials, :imanage10_user_object, :jsonb
    add_index :imanage10_user_credentials, :imanage10_user_object
    remove_column :imanage10_user_credentials, :library_id
  end
end
