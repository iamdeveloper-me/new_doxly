module Models::DueDateable
  def self.included(base)
    base.class_eval do
      has_many :due_dates, :as => :due_dateable, :dependent => :destroy, :autosave => true, :inverse_of => :due_dateable
    end
  end

  def due_date(entity_id)
    due_dates.find_or_initialize_by(:entity_id => entity_id)
  end

end
