module Models::AwsResourceable
  private

  def s3
    @s3 ||= create_aws_resource
  end

  def create_aws_resource
    Aws.config.update({
      credentials: Aws::Credentials.new(Doxly.config.aws_access_key_id, Doxly.config.aws_secret_access_key)
    })
    Aws::S3::Resource.new(region: Doxly.config.aws_region)
  end
end
