class ChangeColumnsForQuesitonnaires < ActiveRecord::Migration
  def change
    rename_column :question_options, :text_value, :label
    rename_column :questions, :is_disabled, :is_active
    change_column_default(:questions, :is_active, true)
  end
end
