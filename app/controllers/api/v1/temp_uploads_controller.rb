class Api::V1::TempUploadsController < Api::V1::ApplicationController
  include Controllers::TempUploads

  api!
  def index
    check_read(:none)
    render_success(run_array_serializer(current_user.temp_uploads, TempUploadSerializer))
  end

  api!
  def create
    check_read(:none)
    begin
      temp_upload.upload!(params[:file])
      if temp_upload.errors.empty?
        render_success(run_object_serializer(temp_upload, TempUploadSerializer))
      else
        render_validation_failed(temp_upload.errors.full_messages)
      end
    rescue StandardError => e
      report_to_rollbar(e)
      temp_upload.destroy if temp_upload&.persisted?
      render_validation_failed(temp_upload.errors.any? ? temp_upload.errors.full_messages : [t('errors.cannot_upload')])
    end
  end

  api!
  def destroy
    check_delete(:none)
    render_unauthorized and return unless temp_upload
    if temp_upload.destroy
      render_success
    else
      render_validation_failed(temp_upload.errors.full_messages)
    end
  end

  api!
  def view
    super
  end

  api!
  def preview
    super
  end

  api!
  def download
    super
  end

end
