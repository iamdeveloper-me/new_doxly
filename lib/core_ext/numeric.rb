class Numeric
  ALPHA26 = ("a".."z").to_a
  ROMAN_MAPPING = {
    1000 => "M",
    900 => "CM",
    500 => "D",
    400 => "CD",
    100 => "C",
    90 => "XC",
    50 => "L",
    40 => "XL",
    10 => "X",
    9 => "IX",
    5 => "V",
    4 => "IV",
    1 => "I"
  }
  def to_s26
    return "" if self < 1
    string, quotient = "", self
    loop do
      quotient, remainder = (quotient - 1).divmod(26)
      string.prepend(ALPHA26[remainder])
      break if quotient.zero?
    end
    string
  end

  def to_roman
    result = ""
    number = self
    ROMAN_MAPPING.keys.each do |divisor|
      quotient, modulus = number.divmod(divisor)
      result << ROMAN_MAPPING[divisor] * quotient
      number = modulus
    end
    result
  end
end
