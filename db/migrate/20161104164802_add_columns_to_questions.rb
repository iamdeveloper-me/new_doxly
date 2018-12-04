class AddColumnsToQuestions < ActiveRecord::Migration
  def change
    add_column :questions, :unit_type, :string
    add_column :questions, :value_key, :string
    add_column :questions, :is_disabled, :boolean, :default => false
  end
end
