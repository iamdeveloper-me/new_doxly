class DateAnswer < QuestionAnswer

  before_save :ensure_values

  def value
    self.date_value
  end

  private

  def ensure_values
    self.option_id = nil
    self.numeric_value = nil
    self.text_value = nil
    self.other_option_value = nil
  end

end
