class AddFontColumnToDeal < ActiveRecord::Migration
  def change
    add_column :deals, :font_size, :string, :default => '11'
    add_column :deals, :font_type, :string, :default => 'Times New Roman'
  end
end
