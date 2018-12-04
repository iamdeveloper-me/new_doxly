class RenameReleaseErrorsToSignatureErrors < ActiveRecord::Migration
  def change
    rename_column :deals, :releasing_errors, :signature_errors
  end
end
