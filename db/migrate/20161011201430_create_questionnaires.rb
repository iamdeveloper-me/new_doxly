class CreateQuestionnaires < ActiveRecord::Migration
  def change
    create_table :questionnaires do |t|
      t.references :deal_type, index: true

      t.timestamps null: false
    end

    add_foreign_key :questionnaires, :deal_types, on_delete: :cascade
  end
end
