class ChangeIsDemoColumnDefaultInEsignatureProviders < ActiveRecord::Migration
  def change
    change_column_default(:esignature_providers, :is_demo, nil)
  end
end
