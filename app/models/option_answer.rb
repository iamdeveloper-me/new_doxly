class OptionAnswer < QuestionAnswer

  before_save :ensure_values

  def value
    self.option_id || self.other_option_value
  end

  private

  def ensure_values
    self.text_value    = nil
    self.numeric_value = nil
    self.date_value    = nil
  end
end
