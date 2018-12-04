class CreateSignaturePageRelease < ActiveRecord::Migration
  def change
    create_table :signature_page_executions do |t|
      t.references :signature_page, index: true
      t.references :version, index: true

      t.timestamps  null: false
    end
  end
end
