class Organization < Entity
  validates :name, :presence => true,     :uniqueness => {:case_sensitive => false}, :length => { maximum: 250 }
end
