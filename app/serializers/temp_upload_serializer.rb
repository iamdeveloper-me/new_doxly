class TempUploadSerializer < ApplicationSerializer
  include Rails.application.routes.url_helpers

  attributes :id, :file_name, :created_at, :url

  belongs_to :user

  def url
    ApplicationHelper.viewer_url(view_temp_upload_path(object.id))
  end
end
