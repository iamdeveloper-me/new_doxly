class FixTablesAndColumns < ActiveRecord::Migration
  def up
    drop_table :notifications
    drop_table :deal_collaborator_invites

    remove_column :organizations, :email_domain
    remove_column :deal_collaborators, :added_by
    remove_column :deals, :organization_user_id
    remove_columns :folders, :created_by, :deal_id, :visibility, :activated
    remove_columns :sections, :created_by, :deal_id, :visibility, :activated
    remove_columns :tasks, :organization_user_id, :deal_id, :visibility
    remove_column :events, :deal_id
    remove_columns :deal_documents, :deal_id
    remove_columns :documents, :deal_id, :visibility, :activated
    remove_column :categories, :activated

    rename_column :documents, :created_by, :organization_user_id
    rename_column :tasks, :assignee_id, :deal_collaborator_id
    rename_column :closing_book_documents, :document_id, :deal_document_id
    rename_column :categories, :name, :type
    rename_column :deal_collaborators, :type, :collaborator_type
    rename_column :deals, :activated, :is_active

    change_column_default :deals, :is_active, false
    
    add_foreign_key :organization_users, :organizations, on_delete: :cascade
    add_foreign_key :deals, :organizations, on_delete: :cascade
    add_foreign_key :events, :organizations, on_delete: :cascade
    add_foreign_key :categories, :deals, on_delete: :cascade
    add_foreign_key :closing_books, :deals, on_delete: :cascade

    add_foreign_key :sections, :categories, on_delete: :cascade
    add_foreign_key :tasks, :sections, on_delete: :cascade
    add_foreign_key :folders, :tasks, on_delete: :cascade
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
