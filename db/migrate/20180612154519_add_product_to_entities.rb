class AddProductToEntities < ActiveRecord::Migration
  def change
    add_column :entities, :product, :string, default: 'closing'
  end
end
