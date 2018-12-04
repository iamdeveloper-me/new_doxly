class AddMinuteBookDealType < ActiveRecord::Migration
  def change
    deal_types_table = Arel::Table.new(:deal_types)

    insert_manager = Arel::InsertManager.new deal_types_table.engine
    insert_manager.insert [
      [deal_types_table[:name], "Minute Book"]
    ]
    ActiveRecord::Base.connection.execute insert_manager.to_sql
  end
end
