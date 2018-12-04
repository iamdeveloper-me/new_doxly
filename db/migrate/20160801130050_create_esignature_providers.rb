class CreateEsignatureProviders < ActiveRecord::Migration
  def change
    create_table :esignature_providers do |t|
      t.references :organization, :index => true
      t.string :name, :null => false
      t.text :authentication_info, :null => false
      t.boolean :is_demo, :default => false, :null => false

      t.timestamps
    end

    add_index :esignature_providers, :name
    add_index :esignature_providers, :authentication_info
    add_index :esignature_providers, :is_demo
    add_foreign_key(:esignature_providers, :organizations, dependent: :delete)
  end
end
