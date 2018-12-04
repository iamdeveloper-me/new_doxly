module Controllers::FileSender

  def display_file(path, options={})
    response.headers.delete('Cache-Control')
    content_type = options.fetch(:type, nil)
    options.merge!({ disposition: 'inline' })
    options.merge!({ type: 'application/pdf' }) unless content_type
    send_file_with_options path, options
  end

  def download_file(path, options={})
    response.headers.delete('Cache-Control')
    options.merge!({ disposition: 'attachment' })
    send_file_with_options path, options
  end

  def send_attachment(attachment, options={})
    render :nothing && return unless attachment.file.exists?
    filename     = options.fetch(:filename, nil)
    data         = open(attachment.url, "rb").read
    send_options = { type: attachment.content_type, disposition: 'attachment' }
    send_options.merge!({ filename: filename }) if filename

    send_data data, send_options
  end

  private

  def send_file_with_options(path, options={})
    filename     = options.fetch(:filename, nil)
    options.merge!({ filename: filename }) if filename
    data         = File.open(path).read

    send_data data, options
  end
end
