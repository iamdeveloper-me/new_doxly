class AddCascadingDeletesOntoRemindersOrganizationalUserId < ActiveRecord::Migration
  def change
    add_foreign_key :reminders, :organization_users, on_delete: :cascade
  end
end
