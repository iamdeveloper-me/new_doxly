class AddRepositoryIdsToSeeUnityImanageEntityStorages < ActiveRecord::Migration
  def change
    add_column :see_unity_imanage_user_credentials, :matter_worklist_repository_id, :string
    add_column :see_unity_imanage_user_credentials, :my_matters_repository_id, :string
    add_column :see_unity_imanage_user_credentials, :my_favorites_repository_id, :string
  end
end
