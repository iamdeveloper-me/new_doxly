class NumericAnswer < QuestionAnswer

  before_save :ensure_values

  def value
    self.numeric_value
  end

  private

  def ensure_values
    self.option_id          = nil
    self.text_value         = nil
    self.other_option_value = nil
    self.date_value         = nil
  end

end
