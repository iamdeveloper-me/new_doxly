class DropTableKpis < ActiveRecord::Migration
   def up
    drop_table :kpis
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
