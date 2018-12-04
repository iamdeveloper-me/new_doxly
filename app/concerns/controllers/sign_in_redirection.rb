module Controllers::SignInRedirection
  extend ActiveSupport::Concern

  def self.included(base)
    base.after_filter :after_login
  end

  private

  def after_login
    return if current_user.blank? || current_user.entity_users.empty?
    current_user.create_authentication_cookie(cookies, entity_user_id)
  end

  def set_return_to_path
    return if session[:user_return_to].present? || params[:return_to].blank?
    path = URI(params[:return_to]).path
    # we are only allowing redirecting to the deals page at this time
    # return unless path.match /^\/deals\/[0-9]+/i
    session[:user_return_to] = path
  end

  def set_entity_user_id
    switch_entity(params[:entity_user_id])
  end

  def entity_user_id
    session[:entity_user_id] = current_user.get_entity_user.id
  end

end
