module Controllers::DealEmails

  #These methods are for sending reminder deal invitation

  def prepare_deal_invitation
    check_create(:entity_connection)
    @user = deal_entity_user.user
  end

  def send_deal_invitation
    check_create(:entity_connection)
    if deal_entity_user.user.is_enabled
      DealMailer.deal_invitation_email(deal_entity_user.entity_user, deal, params[:custom_message]).deliver_later
      flash.now[:success] = "Deal invitation has been emailed"
    else
      flash.now[:error] = "Cannot send deal invitation email to a disabled user"
    end
  end

  private

  #This helper method is being called in the context of adding new users to deals
  def send_deal_email(entity_user, deal)
    return unless params[:send_deal_invitation_email].present?
    DealMailer.deal_invitation_email(entity_user, deal, params[:custom_message]).deliver_later
  end

end
