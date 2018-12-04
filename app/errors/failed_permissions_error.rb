class FailedPermissionsError < StandardError
  attr_accessor :entity_user, :permission, :key, :object

  def initialize(attempting_entity_user, failed_permission, failed_key, attempted_object=nil)
    self.entity_user       = attempting_entity_user
    self.permission        = failed_permission
    self.key               = failed_key
    self.object            = attempted_object
  end

  def message
    # Custom message to log or show the entity_user can be implemented here, as needed
  end
end
