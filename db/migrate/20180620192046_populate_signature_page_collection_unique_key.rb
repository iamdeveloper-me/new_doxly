class PopulateSignaturePageCollectionUniqueKey < ActiveRecord::Migration
  def change
    SignaturePageCollection.all.each do |signature_page_collection|
      # before validation :set_unique_key will set the unique key for the 
      signature_page_collection.save!
    end
  end
end
