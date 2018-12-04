class SeedDealTypes < ActiveRecord::Migration
  def change
    deal_types_table = Arel::Table.new(:deal_types)
    
    deal_types = ["M&A", "Venture Capital", "Commercial Lending"]
    deal_types.each do |deal_type|
      insert_manager = Arel::InsertManager.new deal_types_table.engine
      insert_manager.insert [
        [deal_types_table[:name], deal_type]
      ]
      ActiveRecord::Base.connection.execute insert_manager.to_sql
    end
  end
end
