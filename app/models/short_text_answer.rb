class ShortTextAnswer < QuestionAnswer

  before_save :ensure_values

  def value
    self.text_value
  end

  private

  def ensure_values
    self.option_id          = nil
    self.numeric_value      = nil
    self.other_option_value = nil
    self.date_value         = nil
  end

end
