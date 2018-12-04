class SignerAppConstraint
  def self.matches?(request)
    user = request.env["warden"].try(:user)
    user.present? ? true : false
  end
end
