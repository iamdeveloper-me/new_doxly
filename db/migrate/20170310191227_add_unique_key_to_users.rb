class AddUniqueKeyToUsers < ActiveRecord::Migration
  def change
    add_column :users, :unique_key, :string

    add_index :users, :unique_key

    #populate current users
    User.all.each do |user|
      is_unique_key = false
      current_key   = nil
      until is_unique_key
        current_key = SecureRandom.hex(4)
        is_unique_key = User.find_by(:unique_key => current_key).nil?
      end
      user.unique_key = current_key
      user.bypass_password_validation = true
      user.save
    end
  end
end
