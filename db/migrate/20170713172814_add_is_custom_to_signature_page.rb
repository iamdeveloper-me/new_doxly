class AddIsCustomToSignaturePage < ActiveRecord::Migration
  def change
    add_column :signature_pages, :is_custom, :boolean, null: false, default: false
  end
end
