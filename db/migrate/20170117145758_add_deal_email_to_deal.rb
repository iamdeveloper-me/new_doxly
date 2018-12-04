class AddDealEmailToDeal < ActiveRecord::Migration
  def change
    add_column :deals, :deal_email, :string
  end
end
