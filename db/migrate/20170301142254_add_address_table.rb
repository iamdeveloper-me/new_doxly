class AddAddressTable < ActiveRecord::Migration
  def change
    create_table :addresses do |t|
      t.references :addressable, polymorphic: true, index: true
      t.string :address_line_one
      t.string :address_line_two
      t.string :city
      t.string :state_or_province
      t.string :postal_code
      t.timestamps null: false
    end
  end
end
