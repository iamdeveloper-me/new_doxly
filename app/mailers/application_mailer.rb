class ApplicationMailer < ActionMailer::Base
  default :from => Doxly.config.reply_email
end
