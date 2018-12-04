class ScopedDeviseMailer < Devise::Mailer
  include Devise::Controllers::UrlHelpers

  def reconfirmation_instructions(record, token, opts={})
    opts = opts.merge({
        :subject       => 'Confirm Email Address',
        :template_path => "app/shared/mailer",
        :template_name => 'reconfirmation_instructions'
    })
    @token = token
    devise_mail(record, :reconfirmation_instructions, opts)
  end

  def reset_password_instructions(record, token, opts={})
    opts = opts.merge({
        :subject       => 'Doxly Reset Password Instructions',
        :template_path => "app/shared/mailer",
        :template_name => 'reset_password_instructions'
    })
    super(record, token, opts)
  end

  def password_change(record, opts={})
    opts = opts.merge({
        :subject       => 'Password Changed',
        :template_path => "app/shared/mailer",
        :template_name => 'password_change'
    })
    super(record, opts)
  end

  def unlock_instructions(record, token, opts={})
    opts = opts.merge({
        :subject       => 'Doxly Account Locked',
        :template_path => "app/shared/mailer",
        :template_name => 'unlock_instructions'
    })
    super(record, token, opts)
  end
end
