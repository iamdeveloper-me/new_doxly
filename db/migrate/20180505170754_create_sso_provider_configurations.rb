class CreateSsoProviderConfigurations < ActiveRecord::Migration
  def change
    create_table :sso_provider_configurations do |t|
      t.references :sso_provider_configurationable, polymorphic: true, index: { name: 'index_on_prov_configurable_type_and_prov_configurable_id' }
      t.references :entity, index: true
      t.string :provider_type
      t.boolean :is_active, null: false, default: true, index: true


      t.timestamps  null: false
    end
  end
end
