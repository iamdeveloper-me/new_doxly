class AddUseTemplateToSignaturePages < ActiveRecord::Migration
  def change
    add_column :signature_pages, :use_template, :boolean, :default => false, :null => false
  end
end
