class AddOrganizationIdAndModuleToEvents < ActiveRecord::Migration
  def change
    add_column :events, :organization_id, :integer, :null => false
    add_column :events, :module, :string, :null => false
  end
end
