class Conversion < ActiveRecord::Base

  store :response

  belongs_to :convertable, polymorphic: true

  validates_presence_of :convertable

  def save_new!(response)
    return unless response
    self.tool           = response[:tool]
    self.is_successful  = response[:is_successful] || false
    self.response       = response[:response]
    self.save
  end

end
