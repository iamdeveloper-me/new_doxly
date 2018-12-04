class ChangeSignatureGroupToSignatureEntity < ActiveRecord::Migration
  def change
    rename_table :signature_groups, :signature_entities
  end
end
