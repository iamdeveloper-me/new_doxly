class CreateQuestionOptions < ActiveRecord::Migration
  def change
    create_table :question_options do |t|
      t.references :question, index: true
      t.string :text_value
      t.integer :position

      t.timestamps null: false
    end

    add_foreign_key :question_options, :questions, on_delete: :cascade
  end
end
