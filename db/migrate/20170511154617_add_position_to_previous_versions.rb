class AddPositionToPreviousVersions < ActiveRecord::Migration
  def change
    Attachment.all.each do |attachment|
      attachment.versions.order(:id).each.with_index(1) do |version, index|
        version.update_column(:position, index)
      end
    end
  end
end
