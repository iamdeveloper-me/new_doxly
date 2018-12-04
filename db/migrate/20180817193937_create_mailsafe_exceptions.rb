class CreateMailsafeExceptions < ActiveRecord::Migration
  def change
    create_table :mailsafe_exceptions do |t|
      t.string  :pattern,   :null => false
      t.boolean :allow,     :null => false, :default => true
      
      t.timestamps null: false
    end
  end
end