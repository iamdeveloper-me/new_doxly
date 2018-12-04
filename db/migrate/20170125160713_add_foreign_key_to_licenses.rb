class AddForeignKeyToLicenses < ActiveRecord::Migration
  def change
    add_foreign_key :licenses, :organizations, on_delete: :cascade
  end
end
