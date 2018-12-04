class ConvertToPdfJob < ApplicationJob
  queue_as :convert_to_pdf

  def perform(object, options={})
    synchronous_thumbnails = options.fetch(:synchronous_thumbnails, false)
    converted_temp_file = Tempfile.new(['converted', '.pdf'], ApplicationHelper.temp_dir_root)
    begin
      # perform conversion
      conversion_response = FileConvert.process_file_conversion(object.original_path, converted_temp_file.path)

      # save the conversion info
      save_conversion_info!(object, conversion_response)

      # check to make sure the conversion was successful
      conversion_file_size = File.size?(converted_temp_file.path)
      if conversion_file_size && conversion_file_size > 0
        if object.is_a?(Version)
          object.version_storageable.upload!(converted_temp_file, 'converted')
        else
          object.upload!(converted_temp_file, 'converted')
        end
        # We need this check, because now getting the converted_path for a dms object happens synchronously and potentially calls the convert_to_pdf job, so there's danger that this job would be run twice.
        # Made the check a proc for readability and performance
        already_creating_thumbnails = ->(version) { Delayed::Job.where(queue: 'create_thumbnails', failed_at: nil).where("handler LIKE '%gid://doxly/Version/#{version.id}%'").any? }
        if object.is_a?(Version) && object.attachment.attachable.try(:signature_required?) && !already_creating_thumbnails.(object)
          synchronous_thumbnails ? CreateThumbnailsJob.new.perform(object) : CreateThumbnailsJob.perform_later(object)
        end
      else
        # if we have already tried the max attempts, the job is not going to try anymore. So, we
        # need to email support/engg
        SupportMailer.conversion_failed_email(object) if object.conversions.reload.size >= object.class::CONVERSION_ATTEMPTS
      end
    rescue StandardError => e
      # we'll create a conversion response so the CRON job  can retry the conversion
      conversion_response = { tool: 'unknown', is_successful: false, response: { error: e.message } }
      save_conversion_info!(object, conversion_response)
    ensure
      # clean up
      converted_temp_file.close
      converted_temp_file.unlink

      # move to next storage
      object.move_to_next_storage if object.is_a?(Version)
    end
  end

  def save_conversion_info!(object, conversion_response)
    return unless conversion_response
    object.conversions.new.save_new!(conversion_response)
  end
end
