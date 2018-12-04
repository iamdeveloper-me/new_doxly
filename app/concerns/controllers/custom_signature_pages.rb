module Controllers::CustomSignaturePages

  def signature_pages_directory_path
    @signature_pages_directory_path ||= begin
      path = "#{ApplicationHelper.signature_management_root}/deal_#{deal.id}"
      FileUtils.mkdir_p(path) unless Dir.exist?(path)
      path
    end
  end

  def unprocessed_custom_signature_pages_path
    @unprocessed_custom_signature_pages_path ||= begin
      path = signature_pages_directory_path + "/unprocessed"
      FileUtils.mkdir_p(path) unless Dir.exist?(path)
      path
    end
  end

  def processed_custom_signature_pages_path
    @processed_custom_signature_pages_path ||= begin
      path = signature_pages_directory_path + "/processed"
      FileUtils.mkdir_p(path) unless Dir.exist?(path)
      path
    end
  end

  def get_file_path(options={})
    file_extension = options.fetch(:file_extension, '.pdf')
    processed      = options.fetch(:processed, true)
    base_path      = processed ? processed_custom_signature_pages_path : unprocessed_custom_signature_pages_path
    base_path + "/custom_signature_page_#{signature_page.id}#{file_extension}"
  end

end
