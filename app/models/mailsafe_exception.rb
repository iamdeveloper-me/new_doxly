class MailsafeException < ActiveRecord::Base

  validates :pattern, :presence => true, :uniqueness => true

  validate :ensure_mailsafe_enabled

  def self.allow_email?(email)
    return false unless Doxly.config.mail_safe
    email_matches =  all.to_a.select { |exception| exception.matches?(email) }
    # assume that the most recently added exception is the most relevant
    email_rule    =  email_matches.sort_by(&:created_at).last
    if email_rule
      email_rule.allow
    else
      false
    end
  end

  def matches?(email)
    pattern == email || email =~ pattern_regex
  end

  def pattern_regex
    Regexp.new("^" + Regexp.escape(pattern).gsub("\\*", ".*?") + "$")
  end

  protected

  def ensure_mailsafe_enabled
    if !Doxly.config.mail_safe
      errors.add(:base, "Mailsafe is not enabled, cannot save this record.")
    end
  end

end