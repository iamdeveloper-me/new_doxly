module Controllers::SignatureGroups
  extend ActiveSupport::Concern
  include Controllers::OwningEntity
  include Controllers::SignatureChecks

  def self.included(base)
    base.layout 'deals', only: [:index]
  end

  def index
    check_read(:deals)
    signature_groups
    render 'counsel/signature_groups/index'
  end

  protected

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def signature_groups
    @signature_groups ||= deal.signature_groups
  end

end
