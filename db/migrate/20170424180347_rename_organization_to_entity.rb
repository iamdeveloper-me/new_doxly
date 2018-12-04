class RenameOrganizationToEntity < ActiveRecord::Migration
  def change
    rename_table :organizations, :entities
  end
end
