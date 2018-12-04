class RemoveDealsForeignKeyOnCategories < ActiveRecord::Migration
  def change
    remove_foreign_key :categories, name: "fk_rails_cb16d038ea"
  end
end
