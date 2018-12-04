class ClientAppConstraint
  def self.matches?(request)
    user = request.env["warden"].try(:user)
    user.present? && user.entities.any? && !(user.get_entity_user).belongs_to_law_firm?
  end
end
