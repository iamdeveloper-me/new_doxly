class AddMissingReferences < ActiveRecord::Migration
  def change
    add_reference :signing_capacities, :block, index: true
    add_reference :signature_entities, :block, index: true
    add_reference :signature_page_collections, :block_collection, index: true
  end
end
