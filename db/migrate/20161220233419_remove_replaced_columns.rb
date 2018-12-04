class RemoveReplacedColumns < ActiveRecord::Migration
  def change
    remove_column :deal_organization_users, :deal_id
    remove_column :deals, :client_organization_id
  end
end
