class CreateLoginTokens < ActiveRecord::Migration
  def change
    create_table :login_tokens do |t|
      t.references :user, index: true
      t.references :deal, index: true
      t.string :token, :null => false
      t.string :is_active, :null => false, :default => true

      t.timestamps null: false
    end

    add_foreign_key :login_tokens, :users, on_delete: :cascade
    add_foreign_key :login_tokens, :deals, on_delete: :cascade
  end
end
