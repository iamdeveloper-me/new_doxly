class RenameCurrentlyResponsibleToIsActive < ActiveRecord::Migration
  def change
    rename_column :responsible_parties, :currently_responsible, :is_active
  end
end
