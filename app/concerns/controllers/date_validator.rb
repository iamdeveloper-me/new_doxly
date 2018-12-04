module Controllers::DateValidator
  def set_date_if_valid(remindable, due_date, due_time)
    if due_date.present?
      begin
        remindable.due_date = DateTime.parse("#{due_date} #{due_time}")
      rescue
        remindable.errors.add(:due_date, "is not a valid date and time")
        return false
      end
    else
      remindable.due_date = nil
    end
    return true
  end
end
