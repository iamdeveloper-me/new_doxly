class AddIsExecutingToSignaturePages < ActiveRecord::Migration
  def change
    add_column :signature_pages, :is_executing, :boolean, default: false
  end
end
