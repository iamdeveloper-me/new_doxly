class AddSubdomainToOrganizations < ActiveRecord::Migration
  def change
    add_column :entities, :subdomain, :string

    add_index :entities, :subdomain
  end
end
