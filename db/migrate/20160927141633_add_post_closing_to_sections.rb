class AddPostClosingToSections < ActiveRecord::Migration
  def change
    add_column :sections, :is_post_closing, :boolean, :default => false
  end
end
