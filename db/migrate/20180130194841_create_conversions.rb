class CreateConversions < ActiveRecord::Migration
  def change
    create_table :conversions do |t|
      t.references  :convertable, polymorphic: true, index: true
      t.string      :tool, :null => false
      t.string      :error
      t.text        :response

      t.timestamps  null: false
    end
  end
end
