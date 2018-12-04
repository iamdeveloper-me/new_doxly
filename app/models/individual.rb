class Individual < Entity
  validates :name, :presence => true, :length => { maximum: 250 }

  def display_name
    "Individual"
  end
end
