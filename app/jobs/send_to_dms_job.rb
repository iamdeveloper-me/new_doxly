class SendToDmsJob < ApplicationJob
  queue_as :send_to_dms

  def perform(version, entity_user, options = {})
    begin
      document_id = options.fetch(:document_id, nil)
      # will raise exception if api call wasn't successful
      version.send_to_dms(entity_user, options)
    rescue StandardError => e
      # TODO figure out how to do this on job complete failure, not just if it fails once. It will, though, get overridden if it eventually succeeds, so not the worst problem.
      version.failed_to_send_to_dms!
      raise e
    end
    version.successfully_sent_to_dms!
  end
end
