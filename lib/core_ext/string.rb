class String
  # method to check whether a string is a valid number.
  # Of note, this is not checking whether something is "numeric"
  # For example "1111.2222.3333".is_number? => false.
  # "1113.4444".is_number? => true"
  def is_number?
    true if Float(self) rescue false
  end
end
