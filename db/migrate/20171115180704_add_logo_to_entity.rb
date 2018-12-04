class AddLogoToEntity < ActiveRecord::Migration
  def change
    add_column :entities, :logo, :string    
  end
end
