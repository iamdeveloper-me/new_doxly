class MigrateDeals < ActiveRecord::Migration
  def change
    add_column :deals, :deal_type_id, :integer, :null => true

    # get tables
    deals_table = Arel::Table.new(:deals)
    deal_types_table = Arel::Table.new(:deal_types)

    # get deals
    deals_sql = deals_table.project(Arel.sql("*")).to_sql
    deals = ActiveRecord::Base.connection.execute(deals_sql)

    deals.each do |deal|
      # get the corresponding DealType
      deal_type = deal['transaction_type']
      deal_type_sql = deal_types_table.project(Arel.sql("*")).where(deal_types_table['name'].eq(deal_type)).to_sql
      deal_type_record = ActiveRecord::Base.connection.execute(deal_type_sql)

      # set the deal_type_id on the deal
      update_manager = Arel::UpdateManager.new deals_table.engine
      update_manager.table deals_table
      update_manager.set [
        [deals_table[:deal_type_id], deal_type_record.first['id']]
      ]

      # save the change
      update_manager.where deals_table[:id].eq deal['id']
      ActiveRecord::Base.connection.execute update_manager.to_sql
    end

    remove_column :deals, :transaction_type, :string
    change_column_null :deals, :deal_type_id, false
  end
end
