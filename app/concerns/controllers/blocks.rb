module Controllers::Blocks

  private

  def set_user(user, params)
    # lamda that assigns the new user attributes when the user record has changed
    # don't have to save the user here as nested attributes auto save by default
    assign_attributes = -> (user_record, email_param=nil) {
      params         = params.slice(:first_name, :last_name, :use_placeholder_name)
      params[:email] = email_param if email_param.present?
      user_record.assign_attributes(params)
      user_record.bypass_password_validation = true
      user_record.bypass_email_validation    = true if user.email.blank?
      user_record.skip_confirmation_notification!
      # don't send an email to reconfirm in case an email change is being done to an existing user (no-email to new email)
      user_record.skip_reconfirmation! if user.persisted?
      user_record
    }

    user_to_use             = nil
    email_param             = params[:user][:email]&.downcase
    original_user_has_email = user.email.present?

    if email_param.present?
      user_to_use = if (existing_user = User.find_by(email: email_param))
        # found an existing user
        existing_user
      else
        # no user found with this email, create a new user or repurpose the original one (if there was no email)
        user_record = original_user_has_email ? User.new : user
        assign_attributes.call(user_record, email_param)
      end
    else
      user_to_use = if original_user_has_email
        # we are going from email to no-email, so need to create a new user record
        assign_attributes.call(User.new)
      else
        # no-email to no-email, so just use the same user
        user
      end
    end
    user_to_use
  end

  def build_address(object, address_params, key)
    use_copy_to    = address_params[:use_copy_to]
    address_params = address_params.except(:id, :addressable_id, :addressable_type, :use_copy_to, :updated_at, :created_at)
    address_record = object.send(key)
    # autosave on signing_capacity/signature_entity will save these automatically
    if address_record
      if key == :copy_to_address && !use_copy_to
        address_record.mark_for_destruction
      else
        address_record.send(:assign_attributes, address_params)
      end
    else
      return if key == :copy_to_address && !use_copy_to
      object.send("build_#{key.to_s}", address_params)
    end
  end

  def update_voting_interests
    voting_interests_attributes = Hash[Array(block_params[:voting_interests]).each_with_index.map { |voting_interest, index| [index, voting_interest] }]
    block.update({ voting_interests_attributes: voting_interests_attributes })
  end

  def block_params
    params.require(:block).permit(:voting_interests => [:id, :voting_interest_group_id, :number_of_shares, :_destroy])
  end

end
