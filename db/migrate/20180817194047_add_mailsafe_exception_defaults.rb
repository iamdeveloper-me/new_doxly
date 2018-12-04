# DO NOT DELETE THIS MIGRATION
class AddMailsafeExceptionDefaults < ActiveRecord::Migration
  def change
    if Doxly.config.mail_safe
      default_exceptions = [
        ["*@doxly.com", true],
        ["*@highalpha.com", true],
        ["*@qualitlabs.com", true],
        ["*@qualityintent.com", true]
      ]

      default_exceptions.each do |(pattern, allowed)|
        mailsafe_exception = MailsafeException.new(:pattern => pattern, :allow => allowed)
        mailsafe_exception.save!
      end
    end
  end
end
