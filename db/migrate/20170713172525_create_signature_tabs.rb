class CreateSignatureTabs < ActiveRecord::Migration
  def change
    create_table :signature_tabs do |t|
      t.references :signature_page, index: true
      t.string :tab_type, index: true
      t.string :label
      t.integer :x_coordinate
      t.integer :y_coordinate
    end

    add_foreign_key :signature_tabs, :signature_pages, on_delete: :cascade
  end
end
