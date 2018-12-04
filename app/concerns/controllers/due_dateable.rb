module Controllers::DueDateable
  extend ActiveSupport::Concern

  def process_due_date(due_dateable)
    return if !(due_dateable.methods.include?(:due_date) && params[:due_dates].present?)
    due_dates = params[:due_dates]
    due_dates.each do |due_date|
      due_at = due_date[:value]
      if due_at.present?
        # set due date
        entity_due_date = due_dateable.due_date(current_entity.id)
        begin
          entity_due_date.value = Time.zone.parse(due_at) # parse the date
        rescue
          due_dateable.errors.add(:due_date, "is not a valid date and time") # record errors
        end
        due_dateable.due_dates << entity_due_date unless entity_due_date.new_record?
      else
        # remove due date
        due_dateable.due_date(current_entity.id).destroy
      end
    end
  end

  def process_due_date!(due_dateable)
    process_due_date(due_dateable)
    if !due_dateable.errors.present?
      return due_dateable.save
    end
    return false
  end

end
