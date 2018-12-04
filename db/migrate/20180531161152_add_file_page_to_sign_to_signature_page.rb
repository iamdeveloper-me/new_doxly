class AddFilePageToSignToSignaturePage < ActiveRecord::Migration
  def change
    add_column :signature_pages, :file_page_to_sign, :integer
  end
end
