class Address < ActiveRecord::Base
  belongs_to :addressable, polymorphic: true, foreign_key: :addressable_id
  validates_presence_of :addressable

  after_save :remove_blank_addresses

  private

  def remove_blank_addresses
    self.destroy if all_attributes_blank
  end

  def all_attributes_blank
    [:address_line_one, :address_line_two, :city, :state_or_province, :postal_code].map{ |attr| self.send(attr).blank? }.all?
  end
end
