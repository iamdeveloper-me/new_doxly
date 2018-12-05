class Api::V1::EntityUsersController < Api::V1::ApplicationController
  include Controllers::Api::EntitySettings
  include Controllers::Api::EntityConnections
  
  api!
  def index
    check_read(:entity_user)
    entity_users = all_entity_users
    render_success(run_array_serializer(entity_users, EntityUserSerializer))
  end

  # api!
  # def new
  #   check_create(:entity_user)
  #   entity_user.build_user
  # end

  api!
  def show
    check_read(:entity_user)
    if entity
      scope         = entity.entity_users.includes(:all_deals => { :deal_entity_users => {:entity_user => :user }})
      entity_user   = scope.find(params[:id])
      # binding.pry
      render_success([entity_user,entity_user.user,entity_user.user.entities ])
    else
      render_unauthorized and return
    end
  end

  api!
  def create
    check_create(:entity_user)
    entity_user.assign_attributes(entity_user_params)
    user = User.find_by(email: params[:user][:email])
    # create new entity_user if user already exists
    if user
      new_entity_user = create_entity_user(user, entity_user.entity)
      
      # binding.pry
      render_success(new_entity_user) and return
    # create both new entity_user and a new user if user doesn't already exist
    else
      user, new_entity_user = save_entity_user_and_user(entity_user)
    end
    unless user.persisted? && new_entity_user.persisted?
      render_create_errors(user)
    else
      render_create_success
    end
  end

  # api!
  # def edit
  #   check_update(:entity_user) unless entity_user.id == current_entity_user.id
  #   check_read(:entity_user) if entity_user.id == current_entity_user.id
  #   render_unauthorized and return unless entity == current_entity || !entity_user.user.confirmed?
  # end

  api!
  def update
    check_update(:entity_user) unless entity_user.id == current_entity_user.id
    check_read(:entity_user) if entity_user.id == current_entity_user.id
    check_delete(:entity_user) if params[:user][:is_enabled]
    
    render_unauthorized and return unless entity == current_entity || !entity_user.user.confirmed?
    render_unauthorized and return if entity_user.id == current_entity_user.id && params[:user][:is_enabled].present?

    user                            = entity_user.user
    user.bypass_password_validation = true

    if !user.confirmed?
      if user.email != params[:user][:email] && params[:user][:email] != nil
        user.email = params[:user][:email]
        user.skip_reconfirmation!
      elsif user.email == nil
        user.bypass_email_validation = true
      end
    end
    user.assign_attributes(user_params)
    entity_user.title = params[:entity_user][:title]

    if user.valid? && entity_user.valid?
      user.save
      entity_user.save
      if entity == current_entity && params[:entity_user].present?
        entity_user.set_email_preference!(params[:entity_user][:email_digest_preference])
        entity_user.set_role!(params[:entity_user][:role], current_entity_user)
        entity_user.set_title!(params[:entity_user][:title])
      end
      render_success(entity_user)
      if is_current_entity
        # redirect_to entity_entity_user_path(entity, entity_user) and return
      else
        # respond_to_path(entities_path(:type => params[:type])) and return
      end
    else
      render_create_errors(user)
    end
  end

  api!
  def resend_invitation
    check_read(:entity_user)
    if entity_user.user.confirmation_token.present?
      entity_user.user.refresh_confirmation_token!
      #flash[:success] = "The invite has been resent"
      render_success({refresh_confirmation_token: entity_user.user.refresh_confirmation_token!})
      send_registration_invitation(entity_user.user, true)
    end
    # redirect_to :back
  end

  private

  def entity
    entity ||=  params[:entity_id].to_i == current_entity.id ? current_entity : current_entity.connected_entities.find_by(id: params[:entity_id])
  end

  def is_current_entity
    current_entity.id == entity.id
  end

  def all_entity_users
    current_entity.entity_users.joins(:user).includes(:user).order('first_name ASC')
  end

  # render errors
  def render_create_errors(user)
    user.errors.full_messages.each do |msg|
      # you can customize the error message here:
      entity_user.errors[:base] << msg
    end
    render_validation_failed(entity_user.errors.full_messages)
    # respond_to_turboboost('team_member_form', '.modal-body') and return
  end

  def render_create_success
    render_success(is_current_entity: is_current_entity, message: "User has been created successfully")
    # flash[:success] = "User has been created successfully"
    if is_current_entity

      # respond_to_path(entity_entity_users_path(current_entity)) and return
    else

      # respond_to_path(entities_path(:type => params[:type])) and return
    end
  end
  
end
