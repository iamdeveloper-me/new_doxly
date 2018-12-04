class AddNumberOfPlaceholders < ActiveRecord::Migration
  def change
    add_column :deals, :number_of_placeholder_signers, :integer, :default => 0, :null => false
  end
end
