class UnmatchedSignatureUpload < ActiveRecord::Base

  has_many    :unmatched_signature_upload_pages, -> { order('page_number asc') }
  belongs_to  :deal
  belongs_to  :uploader, class_name: "User"

  validates_presence_of :deal

end
