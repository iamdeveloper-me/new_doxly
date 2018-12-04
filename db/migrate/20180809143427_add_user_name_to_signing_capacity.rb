class AddUserNameToSigningCapacity < ActiveRecord::Migration
  def change
    SigningCapacity.all.each do |signing_capacity|
      user = signing_capacity.user
      signing_capacity.first_name = user.first_name
      signing_capacity.last_name = user.last_name
      if signing_capacity.full_name.size > 97 
        signing_capacity.save(:validate => false)
      else
        signing_capacity.save!
      end
    end
  end
end
