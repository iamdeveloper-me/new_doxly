module Models::Signable

  def ready_signature_pages
    signature_pages.includes(:tree_element_signature_group => :tree_element).select { |page| page.signature_status == 'not_sent' }
  end

  def signature_pages_sent?
    signature_page_statuses = signature_pages.map(&:signature_status)
    signature_page_statuses.any?{ |status| status != 'not_sent' }
  end

  def all_signature_pages_sent?
    signature_page_statuses = signature_pages.map(&:signature_status)
    signature_page_statuses.any?{ |status| status != 'not_sent' } && signature_page_statuses.all?{ |status| status != 'not_sent' }
  end

  def signature_pages_sending?
    signature_page_statuses = signature_pages.map(&:signature_status)
    signature_page_statuses.any?{ |status| SignaturePage::SENDING_SIGNATURE_STATUSES.include?(status) }
  end

  def all_signature_pages_completed?
    signature_page_statuses = signature_pages.map(&:signature_status)
    signature_page_statuses.any? && signature_page_statuses.all?{ |status| ['signed', 'declined'].include?(status)}
  end
end
