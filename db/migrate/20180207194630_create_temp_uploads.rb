class CreateTempUploads < ActiveRecord::Migration
  def change
    create_table :temp_uploads do |t|
      t.references  :user, index: true, foreign_key: { on_delete: :cascade }
      t.string      :file_name, :null => false
      t.string      :original_path
      t.string      :converted_path
      t.string      :preview_path

      t.timestamps  null: false
    end
  end
end
