class DmsApiTokenExpiredError < StandardError
  attr_accessor :entity_user, :attempted_url, :failed_access_token, :dms_type

  def initialize(attempting_entity_user, attempted_url, failed_access_token, dms_type)
    self.entity_user              = attempting_entity_user
    self.attempted_url            = attempted_url
    self.failed_access_token      = failed_access_token
    self.dms_type                 = dms_type
  end

  def message
    I18n.t("errors.dms_token_errors.#{dms_type}")
  end
end
