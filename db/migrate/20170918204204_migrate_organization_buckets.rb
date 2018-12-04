class MigrateOrganizationBuckets < ActiveRecord::Migration
  def change
    puts "This may take a LONG time - depending on how many files you have stored in AWS"
    AwsEntityStorage.where.not(bucket: nil).each do |aws_entity_storage|
      # get old bucket
      old_bucket = aws_entity_storage.get_bucket
      aws_entity_storage.bucket = nil

      # create new bucket
      new_bucket = aws_entity_storage.get_bucket

      # copy everything over
      old_bucket.objects.each do |old_object|
        new_bucket.put_object({
          key: old_object.key,
          body: old_object.get().body
        })
      end

      # delete old bucket
      # old_bucket.delete() # I decided to comment this out because it seems too risky...what if the wrong bucket somehow got deleted by accident?
    end
  end
end
