class AwsEntityStorage < ActiveRecord::Base
  include Models::AwsResourceable

  belongs_to :entity
  validates :entity, presence: true
  
  def get_bucket
    if !bucket || !s3.bucket(bucket).exists?
      stack_path = File.join(Rails.root, "STACK")
      environment = File.exist?(stack_path) ? File.read(stack_path).chomp : Rails.env
      loop do
        self.bucket = "#{environment}-entity-#{entity.id}-#{SecureRandom.urlsafe_base64}".downcase
        break if !s3.bucket(bucket).exists? # this could break if someone were to create a bucket with the exact same name between this check and the create line below - but the odds of that are essentially zero
      end
      s3.bucket(bucket).create
      self.save
    end
    s3.bucket(bucket)
  end
end
