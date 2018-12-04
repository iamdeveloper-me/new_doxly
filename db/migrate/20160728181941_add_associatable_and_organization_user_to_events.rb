class AddAssociatableAndOrganizationUserToEvents < ActiveRecord::Migration
  def change
    add_column :events, :organization_user_id, :integer, :null => false
    add_column :events, :associatable_type, :string, :null => false
    add_column :events, :associatable_id, :integer, :null => false

    add_index :events, :organization_user_id
  end
end
