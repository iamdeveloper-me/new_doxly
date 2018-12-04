class DropTableDocumentSigners < ActiveRecord::Migration
  def up
    drop_table :document_signers
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
