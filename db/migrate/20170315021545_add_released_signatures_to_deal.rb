class AddReleasedSignaturesToDeal < ActiveRecord::Migration
  def change
    add_column :deals, :released_signatures, :boolean, default: false
    add_column :deals, :released_signatures_organization_user_id, :integer
  end
end
