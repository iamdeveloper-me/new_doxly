class CreateCompletionStatus < ActiveRecord::Migration
  def change
    create_table :completion_statuses do |t|
      t.references :deal_organization, index: true
      t.references :tree_element, index: true
      t.boolean    :is_complete

      t.timestamps null: false
    end
  end
end
