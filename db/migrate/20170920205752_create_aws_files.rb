class CreateAwsFiles < ActiveRecord::Migration
  def change
    create_table :aws_files do |t|
      t.string      :key
      t.string      :type
      t.references  :entity, index: true
      t.references  :aws_fileable, polymorphic: true, index: true
      t.timestamps  null: false
    end
  end
end
