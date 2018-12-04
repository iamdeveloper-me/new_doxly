module Controllers::Permissable
  extend ActiveSupport::Concern

  def self.included(base)
    base.after_filter :ensure_entity_user_permission_processed
    base.helper_method :current_deal_entity_user
  end

  def check_create(key)
    return true if bypass_permission_check?(key)
    permission = check_role(key)
    return true if permission.include?('C')
    Rails.logger.info "Create permissions failed for #{current_entity_user.inspect}"
    raise FailedPermissionsError.new(current_entity_user, :create, key)
  end

  def check_read(key)
    return true if bypass_permission_check?(key)
    permission = check_role(key)
    return true if permission.include?('R')
    Rails.logger.info "View permissions failed for #{current_entity_user.inspect}"
    raise FailedPermissionsError.new(current_entity_user, :read, key)
  end

  def check_update(key)
    return true if bypass_permission_check?(key)
    permission = check_role(key)
    return true if permission.include?('U')
    Rails.logger.info "Update permissions failed for #{current_entity_user.inspect}"
    raise FailedPermissionsError.new(current_entity_user, :update, key)
  end

  def check_delete(key)
    return true if bypass_permission_check?(key)
    permission = check_role(key)
    return true if permission.include?('D')
    Rails.logger.info "Delete permissions failed for #{current_entity_user.inspect}"
    raise FailedPermissionsError.new(current_entity_user, :delete, key)
  end

  def check_role(key)
    if is_deal_context? && deal&.persisted?
      render_unauthorized and return unless check_participate(deal)
      permission = DealEntityUser::ROLES[current_deal_entity_user(deal).role][key]
      return permission if permission.present?
    else
      @deal = nil
    end
    EntityUser::ROLES[current_entity_user.role][key] || []
  end

  def check_participate(deal)
    deal.participatable_by?(current_entity_user)
  end

  def ensure_entity_user_permission_processed
    return if @permission_processed
    raise "The action '#{action_name}' in '#{self.class.name}' did not go through the permissions check"
  end

  def assert_current_entity_user!
    if !respond_to?(:current_entity_user)
      raise "current_entity_user not defined for #{self.class.name}, cannot authorize entity_user access"
    end
  end

  def bypass_permission_check?(key = nil)
    @permission_processed = true
    return true if key == :none
    # -- add rules here to bypass permissions check if needed (ex: guest user)--
    assert_current_entity_user!
    false
  end

  private

  def current_deal_entity_user(current_deal=nil)
    if (!current_deal && is_deal_context? && deal&.persisted?)
      current_deal = deal
    end
    return unless current_deal.present?
    return unless current_entity_user.present?
    @current_deal_entity_user ||= current_deal.deal_entity_user_for(current_entity_user.id)
  end

  # maybe not the appropriate place for this since it's not used in this file, but it draws on the method above, so this felt right.
  def current_deal_entity
    current_deal_entity_user.deal_entity
  end

  def is_deal_context?
    self.methods.include?(:deal) || self.private_methods.include?(:deal)
  end

end
