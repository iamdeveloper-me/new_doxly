class AddClientMatterNumberToDeals < ActiveRecord::Migration
  def change
    add_column :deals, :client_matter_number, :string
  end
end
