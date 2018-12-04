class FixUnamedSignersWithoutPlaceholderNumbers < ActiveRecord::Migration
  def change
    signing_capacities_that_need_to_be_fixed = SigningCapacity.joins(:user).where(placeholder_id: nil).where(:users => { first_name: User::FIRST_NAME_PLACEHOLDER, last_name: User::LAST_NAME_PLACEHOLDER })
    signing_capacities_that_need_to_be_fixed.each do |signing_capacity|
      signing_capacity.update_placeholder_signers
      signing_capacity.save
    end
  end
end
