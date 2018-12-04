class AddOwnableToComments < ActiveRecord::Migration
  def change
    change_table :comments do |t|
      t.references :ownable, :polymorphic => true
    end
    add_index :comments, :ownable_id
    add_index :comments, :ownable_type
  end
end
