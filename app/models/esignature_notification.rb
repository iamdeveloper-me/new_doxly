class EsignatureNotification < ActiveRecord::Base
  
  RETRIEVAL_ATTEMPTS = 4
  ALLOWED_STATUSES   = ['sent', 'signed', 'declined', 'received']

  belongs_to :signature_packet
  has_many   :critical_errors, as: :critical_errorable

  validates_presence_of :signature_packet
  validates_presence_of :token
  validates_presence_of :envelope_id
  validates             :status, inclusion: { in: ALLOWED_STATUSES }

  def signed!
    self.update(status: 'signed')
  end

  def declined!
    self.update(status: 'declined')
  end

  def docusign_posted!
    self.update(docusign_posted: true)
  end

  def received!
    self.update(status: 'received')
  end

  def start_processing!
    self.update(is_processing: true)
  end

  def end_processing!
    self.update(is_processing: false)
  end

  def received?
    status == "received"
  end
end
