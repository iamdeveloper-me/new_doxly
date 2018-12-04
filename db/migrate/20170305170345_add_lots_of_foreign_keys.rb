class AddLotsOfForeignKeys < ActiveRecord::Migration
  def change
    add_foreign_key :signature_packets, :users, on_delete: :cascade
    add_foreign_key :signature_packets, :deals, on_delete: :cascade
    add_foreign_key :signature_groups, :deals, on_delete: :cascade
    add_foreign_key :signature_group_users, :users, on_delete: :cascade
    add_foreign_key :signature_group_users, :signature_groups, on_delete: :cascade
    add_foreign_key :signature_pages, :signature_group_users, on_delete: :cascade
    add_foreign_key :signature_pages, :tree_elements, on_delete: :cascade
    add_foreign_key :tree_element_signature_groups, :tree_elements, on_delete: :cascade
    add_foreign_key :tree_element_signature_groups, :signature_groups, on_delete: :cascade
    add_foreign_key :signature_packet_page_links, :signature_pages, on_delete: :cascade
    add_foreign_key :signature_packet_page_links, :signature_packets, on_delete: :cascade
  end
end
