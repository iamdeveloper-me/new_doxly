module Controllers::EntitySwitch

  def switch_entity(entity_user_id)
    if current_user && entity_user_id.present? && entity_user_id != self.try(:current_entity_user)&.id.to_s
      new_entity_user = current_user.entity_users.find_by(id: entity_user_id)
      return false if new_entity_user.nil?
      new_entity_user_id = new_entity_user.id
      new_entity_user.make_default!
      session[:entity_user_id] = entity_user_id.to_i
      current_user.update_authentication_cookie(cookies, new_entity_user_id)
    end
    true
  end

end