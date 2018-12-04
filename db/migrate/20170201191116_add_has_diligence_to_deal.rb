class AddHasDiligenceToDeal < ActiveRecord::Migration
  def change
    add_column :deals, :has_diligence, :boolean, :default => true
  end
end
