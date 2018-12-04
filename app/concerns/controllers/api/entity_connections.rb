module Controllers::Api::EntityConnections
  include Controllers::Api::Addressable

  def save_entity_connections_and_entities(entity, entity_connection)
    return true if entity.connected_entities.include?(current_entity)
    entity_connection.connected_entity = entity
    org_entity_params = entity_params.merge(type: 'Organization')
    entity.assign_attributes(org_entity_params) unless entity.persisted?
    entity.is_counsel = true if params[:type].present? && params[:type] == 'law_firm'
    is_valid = entity.valid?
    ActiveRecord::Base.transaction do
      # also saves the entity
      entity_connection.save
      entity.build_primary_address(primary_address_params).save
      entity.reload
      # create the reverse entity connection for the new entity
      if !entity.connected_entities.include?(current_entity)
        new_entity_entity_connection = entity.entity_connections.new
        new_entity_entity_connection.connected_entity = current_entity
        new_entity_entity_connection.save
        set_entity_connection_as_pending(entity_connection, new_entity_entity_connection) if !entity.is_counsel && !entity.entity_users.empty?
      end
    end if is_valid

    is_valid
  end

  def save_entity_user_and_user(entity_user, send_email = true)
    user       = entity_user.build_user
    user.assign_attributes(user_params)
    user.email = params[:user][:email]
    user.skip_confirmation_notification!
    user_saved = user.save if entity_user.valid?
    send_registration_invitation(user) if user_saved && send_email

    # allows validity to pass since user is potentially already persisted
    user.bypass_password_validation = true
    entity_user.save if user.valid? && user_saved
    [user, entity_user]
  end

  def create_entity_user(user, entity)
    entity_user = user.entity_users.new(entity_user_params)
    entity_user.entity_id = entity.id
    entity_user.save
    entity_user
  end

  def create_entity_connections(first_entity, second_entity)
    return true if first_entity == second_entity

    EntityConnection.transaction do
      unless first_entity.connected_entities.include?(second_entity)
        # build the first entity_connection
        first_entity_connection                               = first_entity.entity_connections.new
        first_entity_connection.connected_entity              = second_entity
        first_entity_connection.save
      end

      unless second_entity.connected_entities.include?(first_entity)
        # build the second entity_connection
        second_entity_connection                     = second_entity.entity_connections.new
        second_entity_connection.connected_entity    = first_entity
        second_entity_connection.save
      end
    end

    first_entity_connection ||= nil
    second_entity_connection ||= nil

    set_entity_connection_as_pending(first_entity_connection, second_entity_connection) if !second_entity.is_counsel && !second_entity.entity_users.empty? && first_entity_connection && second_entity_connection
  end

  protected

  def entity_connection
    @entity_connection ||= params[:id].blank? ? current_entity.entity_connections.new : current_entity.entity_connections.find(params[:id])
  end

  def entity_user
    @entity_user ||= params[:id].blank? ? entity.entity_users.new : entity.entity_users.find(params[:id])
  end

  def entity_params
    return {} unless params[:entity].present?
    params.require(:entity).permit(:name, :is_counsel)
  end

  def user_params
    return {} unless params[:user].present?
    params.require(:user).except(:modules).permit(:first_name, :last_name, :phone, :fax, :address, :city, :state, :zip, :avatar, :avatar_cache, :remove_avatar, :email_digest_preference, :is_enabled)
  end

  def entity_user_params
    return {} unless params[:entity_user].present?
    params.require(:entity_user).permit(:title, :email_digest_preference, :role)
  end

  private

  def send_registration_invitation(user, is_reminding=false)
    return if params[:send_signup_invitation_email].blank? && !is_reminding
    if current_entity.id == entity.id
      InvitationMailer.entity_invitation_email(user, current_entity).deliver_later
    else
      current_entity.events.create(module: 'Deal', action: "COLLABORATOR_INVITED", eventable: entity_user, entity_user_id: current_entity_user.id, associatable_type: 'Entity', associatable_id: entity.id)
      InvitationMailer.entity_user_invitation_email(user, entity, current_entity_user).deliver_later
    end
  end

  def set_entity_connection_as_pending(entity_connection, new_entity_entity_connection)
    new_token = SecureRandom.hex
    entity_connection.is_pending = true
    entity_connection.confirmation_token = new_token
    entity_connection.save
    new_entity_entity_connection.is_pending = true
    new_entity_entity_connection.confirmation_token = new_token
    new_entity_entity_connection.save
    InvitationMailer.entity_connection_invitation_email(entity_connection).deliver_later
  end

  def all_entity_connections(counsel_param)
    current_entity.entity_connections.joins(:connected_entity)
      .joins('
          LEFT JOIN entity_users ON entity_users.entity_id = entity_connections.connected_entity_id
          LEFT JOIN users ON users.id = entity_users.user_id
      ')
      .includes(:connected_entity => :entity_users).where(entities: { is_counsel: counsel_param })
  end

end
