class AddReleaseErrorsToDeal < ActiveRecord::Migration
  def change
    add_column :deals, :releasing_errors, :string
  end
end
