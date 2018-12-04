class License < ActiveRecord::Base
  belongs_to :entity

  validates :entity, :presence => true
  validates_presence_of :start_date, :end_date, :deal_count

  validate :check_previous_licenses

  def check_previous_licenses
    licenses_table = License.arel_table
    licenses = entity.licenses.where(
                licenses_table[:ended_on].gt(start_date)
                .or(licenses_table[:ended_on].eq(nil)
                  .and(licenses_table[:end_date].gt(start_date))
                )
              )
    if licenses.any?
      self.errors.add(:base, 'Invalid start date, other licenses will still be active on that date')
    end
  end
end
