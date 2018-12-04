WickedPdf.config = {}.tap do |config|
  config.merge!(
    :disposition      => 'attachment',
    :layout           => 'pdf.html',
    :formats          => [:html, :erb, :pdf],
    :page_size        => 'Letter',
    :print_media_type => true
  )

  if Rails.env.development?
    config[:exe_path] = [
      '/usr/local/bin/wkhtmltopdf', # 1. Darwin - Mac
      `which wkhtmltopdf`.chomp,    # 2. Gem Binary
    ].find {|x| File.exist?(x)}
  end
end
