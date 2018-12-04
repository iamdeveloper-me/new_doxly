class VersionSerializer < ApplicationSerializer
  include Rails.application.routes.url_helpers

  attributes :id, :attachment_id, :uploader_id, :url, :file_name, :file_size, :file_type, :status, :position, :upload_method, :created_at, :updated_at, :sending_to_dms_status, :version_storageable_type, :conversion_successful

  belongs_to :attachment
  belongs_to :uploader
  has_many :signature_page_executions
  belongs_to :version_storageable

  def conversion_successful
    begin
      object.version_storageable.converted_object.present?
    rescue
      # otherwise for some reason the object wasn't in the S3 and it broke the checklist. Probably wiser long term to throw a specific error here, but fixing for now this way in 2.14.2
      return false
    end
  end

  def url
    ApplicationHelper.viewer_url(viewer_path)
  end

  private

  def viewer_path
    attachable = object.attachment.attachable
    if attachable.is_a?(Deal)
      view_deal_attachment_version_path(attachable.id, object.attachment.id, object.id)
    else
      view_deal_category_tree_element_attachment_version_path(attachable.root.deal.id, attachable.root.id, attachable.id, object.attachment.id, object.id)
    end
  end
end
