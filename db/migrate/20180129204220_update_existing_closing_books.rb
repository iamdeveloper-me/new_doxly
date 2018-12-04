class UpdateExistingClosingBooks < ActiveRecord::Migration
  def change
    # Get the tables we need
    deals_table             = Arel::Table.new(:deals)
    deal_entity_users_table = Arel::Table.new(:deal_entity_users)
    deal_entities_table     = Arel::Table.new(:deal_entities)
    closing_books_table     = Arel::Table.new(:closing_books)

    deals_sql               = deals_table.project(Arel.sql("*")).to_sql
    deals                   = ActiveRecord::Base.connection.execute(deals_sql)

    # Find the owning deal entity and owning deal entity user also setting the name
    # Set creator of closing books to the owning deal entity user
    deals.each do |deal|
      number_of_closing_books      = 0
      deal_closing_books_sql       = closing_books_table.where(closing_books_table[:deal_id].eq(deal["id"])).order(closing_books_table[:created_at]).project(Arel.sql("*")).to_sql
      deal_closing_books           = ActiveRecord::Base.connection.execute(deal_closing_books_sql)
      deal_entities_sql            = deal_entities_table.where(deal_entities_table["deal_id"].eq(deal["id"])).project(Arel.sql("*")).to_sql
      deal_entities                = ActiveRecord::Base.connection.execute(deal_entities_sql)
      owning_deal_entity           = deal_entities.select{ |deal_entity| deal_entity["is_owner"] == 't' }.first
      owning_deal_entity_user_sql  = deal_entity_users_table.where(deal_entity_users_table["deal_entity_id"].eq(owning_deal_entity["id"]).and(deal_entity_users_table["is_owner"].eq("t"))).project(Arel.sql("*")).to_sql
      owning_deal_entity_user      = ActiveRecord::Base.connection.execute(owning_deal_entity_user_sql).first

      deal_closing_books.each do |closing_book|
        number_of_closing_books += 1
        closing_books_update_manager = Arel::UpdateManager.new closing_books_table.engine
        closing_books_update_manager.table closing_books_table
        closing_books_update_manager.set([
          [closing_books_table["creator_id"], owning_deal_entity_user["id"]],
          [closing_books_table["name"], "Closing Book #{number_of_closing_books}"]
          ]).where(closing_books_table["id"].eq(closing_book["id"]))
        ActiveRecord::Base.connection.execute closing_books_update_manager.to_sql
      end
    end

    change_column_null :closing_books, :name, false
  end
end
