class AddNumberOfSignaturePageCopiesToTreeElements < ActiveRecord::Migration
  def change
    add_column :tree_elements, :number_of_signature_page_copies, :integer, :default => 1
  end
end
