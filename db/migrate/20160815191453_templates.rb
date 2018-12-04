class Templates < ActiveRecord::Migration
  def change
    create_table :deal_types do |t|
      t.string :name

      t.timestamps
    end
    create_table :templates do |t|
      t.string :name
      t.string :thumbnail

      t.timestamps
    end
    create_table :deal_type_templates do |t|
      t.references :deal_type
      t.references :template

      t.timestamps
    end

    rename_column :categories, :deal_id, :parent_id
    # seed 'Deal' as the default value
    add_column :categories, :parent_type, :string, :default => 'Deal'
    # reset default to null
    change_column_default :categories, :parent_type, nil
    add_index :categories, [:parent_id, :parent_type]
  end
end
