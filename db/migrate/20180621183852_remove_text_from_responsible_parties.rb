class RemoveTextFromResponsibleParties < ActiveRecord::Migration
  def change
    remove_column :responsible_parties, :text
  end
end
