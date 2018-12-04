class AddSignatureReviewDocuments < ActiveRecord::Migration
  def change
    create_table :signature_packet_review_documents do |t|
      t.references  :tree_element, index: true, foreign_key: {on_delete: :cascade}
      t.references  :signature_packet, index: true, foreign_key: {on_delete: :cascade}

      t.timestamps  null: false
    end
  end
end
