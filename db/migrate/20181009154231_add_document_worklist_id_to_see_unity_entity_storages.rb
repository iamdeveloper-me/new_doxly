class AddDocumentWorklistIdToSeeUnityEntityStorages < ActiveRecord::Migration
  def change
    add_column :see_unity_imanage_user_credentials, :document_worklist_repository_id, :string
  end
end
