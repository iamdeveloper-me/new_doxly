module Controllers::Roles
  extend ActiveSupport::Concern

  def self.included(base)
    base.layout 'deals'
  end

  def index
    check_read(:role)
    @deal_roles = deal.roles.sort_by(&:created_at)
    render 'app/shared/roles/index'
  end

  def completed_working_group_intro
    check_read(:role)
    has_completed_intro = current_entity_user.intros_completed.include?("work-group-list-#{deal.id}")
    render json: has_completed_intro || !deal.can?('R', :collaborators) # don't show the intro to closings users
  end

  def update_completed_working_group_intro
    check_read(:role)
    user = current_entity_user
    render json: (user.intros_completed << "work-group-list-#{deal.id}")
    user.bypass_title_validation = true
    user.save
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find(params[:deal_id])
  end

end
