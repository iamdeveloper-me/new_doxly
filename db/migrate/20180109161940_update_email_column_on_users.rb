class UpdateEmailColumnOnUsers < ActiveRecord::Migration
  def change
    change_column :users, :email, :string, :default => nil, :null => true
  end
end
