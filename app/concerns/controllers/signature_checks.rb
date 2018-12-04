module Controllers::SignatureChecks
  extend ActiveSupport::Concern

  def forbid_if_signatures_sent(message)
    if tree_element.has_signature_packets?
      flash.now[:error] = message
      render 'shared/blank' and yield
    end
  end

  def forbid_if_signature_pages_sent(message)
    if tree_element_signature_group.signature_pages_sent?
      flash.now[:error] = message
      render 'shared/blank' and yield
    end
  end

  def forbid_if_signature_page_sent(message)
    if signature_page.signature_status != "not_sent"
      flash.now[:error] = message
      render 'shared/blank' and yield
    end
  end

  def forbid_if_deals_closed(message)
    if deal.closed?
      flash.now[:error] = message
      render 'shared/blank' and yield
    end
  end

  def forbid_if_linked_blocks(message)
    if signature_page.has_linked_blocks?
      flash.now[:error] = message
      render 'shared/blank' and yield
    end
  end

end
