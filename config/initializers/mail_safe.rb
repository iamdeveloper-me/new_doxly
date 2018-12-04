if Doxly.config.mail_safe
  require 'mail_safe'
  MailSafe::Config.internal_address_definition = lambda { |address|
    MailsafeException.allow_email?(address)
  }

  MailSafe::Config.replacement_address = Doxly.config.mail_safe_destination
end