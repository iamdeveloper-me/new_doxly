module ApplicationHelper

  # for use in controllers
  def self.sanitize_filename(filename, options={})
    replacement_value = options.fetch(:replacement_value, '_')
    # clean the text
    clean_filename = filename.gsub(/[^\w\.]/, replacement_value)
    # limit the length
    clean_filename[0..200].gsub(/\s\w+\s*$/, '')
  end

  def sanitize_filename(filename, options={})
    return ApplicationHelper.sanitize_filename(filename, options)
  end

  # recursive search and replace empty values to nil in a hash
  def self.empty2nil(hash)
    hash.each_with_object({}) do |(key, value), object|
      object[key] = if (Hash === value)
        empty2nil(value)
      else
        value.blank? ? nil : value
      end
    end
  end

  def self.signature_management_root
    "#{Rails.root.to_s}/#{Doxly.config.signature_management_dir}"
  end

  def self.closing_books_root
    "#{Rails.root.to_s}/#{Doxly.config.closing_books_dir}"
  end

  def self.temp_dir_root
    "#{Rails.root.to_s}/#{Doxly.config.temp_dir}"
  end

  def self.hdd_storage_root
    "#{Rails.root.to_s}/#{Doxly.config.hdd_storage_dir}"
  end

  def self.im_image_from_path(path, options={})
    set_resolution = options.fetch(:set_resolution, true)
    set_background = options.fetch(:set_background, true)
    do_cleanup     = options.fetch(:do_cleanup, true)

    # attempt to load
    image = self.retry_command do
      Magick::Image.read(path) do
        if set_resolution
          self.quality = 80
          self.density = '300'
        end
      end.first
    end
    raise 'ImageMagick reading failed' unless image
    image.alpha = Magick::BackgroundAlphaChannel if set_background
    # run any custom commands
    yield image if block_given?
    # clean up
    if do_cleanup
      image.destroy!
      GC.start
    else
      image
    end
  end

  def self.viewer_url(path, options={})
    page_num = options.fetch(:page_num, nil)
    url = "/viewer/web/viewer.html?file=#{ERB::Util.url_encode(path)}"
    url += "#page=#{page_num}"
    url
  end

  def viewer_url(path, options={})
    ApplicationHelper.viewer_url(path, options)
  end


  # ******* ATTENTION!! AplicationHelper.retry_command swallows errors inside of it so that you can't
  # ******* trust the errors or even the critical error objects that get created from broken code inside of it.
  # ******* debuggers also don't work
  # ******* to debug, comment out the retry_command lines and run the code inside of it.
  
  def self.retry_command(total_attempts=4)
    result = nil
    begin
      attempts ||= 0
      result = yield
    rescue
      retry if (attempts += 1) < total_attempts
    end
    result
  end
end
