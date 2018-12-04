class AddUseDealEmailToDeals < ActiveRecord::Migration
  def change
    add_column :deals, :use_deal_email, :boolean, :null => false, :default => true
  end
end
