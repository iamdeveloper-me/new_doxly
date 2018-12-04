class DocumentMailer < ApplicationMailer
  default :from => Doxly.config.support_email

  def no_deal_found_email(email, attempted_email)
    @email = email
    @attempted_email = attempted_email
    @url = new_user_session_url
    mail to: @email, subject: "No Matching Deal Found" do |format|
      format.text { render 'app/shared/mailer/no_deal_found_email' }
      format.html { render 'app/shared/mailer/no_deal_found_email' }
    end
  end

  def unauthorized_user_email(email)
    @email = email
    mail to: @email, subject: "Unauthorized Upload" do |format|
      format.text { render 'app/shared/mailer/unauthorized_user_email' }
      format.html { render 'app/shared/mailer/unauthorized_user_email' }
    end
  end

  def uploading_errors_email(email, deal, errors)
    @email = email
    @deal = deal
    @errors = errors
    mail to: @email, subject: "Document(s) Failed to Upload to Doxly" do |format|
      format.text { render 'app/shared/mailer/uploading_errors_email' }
      format.html { render 'app/shared/mailer/uploading_errors_email' }
    end
  end
end
