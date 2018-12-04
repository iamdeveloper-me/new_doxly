class RemoveSignatureErrorsFromDeals < ActiveRecord::Migration
  def change
    remove_column :deals, :signature_errors
  end
end
