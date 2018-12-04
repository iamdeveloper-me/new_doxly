class RenameDealType < ActiveRecord::Migration
  def change
    commercial_lending = DealType.find_by :name => 'Commercial Lending'
    commercial_lending.name = 'Private Equity'
    commercial_lending.save
  end
end
