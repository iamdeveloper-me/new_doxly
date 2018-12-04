module Models::Permissable
  def owned_by?(entity_user)
    false
  end

  def participatable_by?(entity_user)
    false
  end

  def viewable_by?(entity_user)
    owned_by?(entity_user) || false
  end
end
