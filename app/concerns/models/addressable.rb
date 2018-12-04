module Models::Addressable

  def full_address(address_attr=:primary_address)
    address      = self.send address_attr
    return unless address.present?
    full_address = ""
    full_address += "#{address.address_line_one}" if address.address_line_one.present?
    full_address += ", " if address.address_line_one.present? && address.address_line_two.present?
    full_address += address.address_line_two if address.address_line_two.present?
    full_address += "<br />" unless full_address.empty?
    full_address += "#{address.city}" if address.city.present?
    full_address += ", " if address.city.present? && (address.state_or_province.present? || address.postal_code.present?)
    full_address += [address.state_or_province, address.postal_code].reject(&:empty?).join(' ')
    full_address.html_safe
  end

end
