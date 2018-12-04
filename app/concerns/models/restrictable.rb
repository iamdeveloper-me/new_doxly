module Models::Restrictable
  def self.included(base)
    base.class_eval do
      has_many :tree_element_restrictions, as: :restrictable, dependent: :destroy
    end
  end
end