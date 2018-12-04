class TempUpload < ActiveRecord::Base

  belongs_to :user
  has_many   :conversions, as: :convertable, dependent: :destroy

  validates_presence_of :user

  SUPPORTED_FILE_OBJECTS = [File, ActionDispatch::Http::UploadedFile]

  def upload!(file)
    raise "Invalid file object." unless SUPPORTED_FILE_OBJECTS.any?{ |klass| file.is_a?(klass)  }

    # need to have a persisted temp-upload
    if self.new_record?
      self.file_name = file.try(:original_filename) || File.basename(file.path)
      self.save
    end

    # reopen to ensure it has not been read yet
    file_to_upload = File.open(file.is_a?(ActionDispatch::Http::UploadedFile) ? file.tempfile : file)
    begin
      # save file
      self.original_path = "#{get_path}/original#{File.extname(file_to_upload).downcase}"
      File.open(original_path, "wb") { |original_file| original_file.write(file_to_upload.read) }
      self.save
    ensure
      file_to_upload.close if file_to_upload.present?
    end
  end

  def view_path
    return self.converted_path if self.converted_path.present?
    extension = File.extname(self.original_path).downcase
    # perform the conversion (convert pdf to pdf as well)
    pdf_path = "#{get_path}/converted.pdf"
    begin
      FileConvert.process_file_conversion(self.original_path, pdf_path)
    rescue
      # since this needs to be run synchronously, we can't track this with conversions and retry
      # so, nothing to do here and we'll just show the "cannot convert" placeholder pdf
    end
    if File.exist?(pdf_path)
      self.converted_path = pdf_path
      self.save
    end
    self.converted_path
  end

  def preview_image_path
    return self.preview_path if self.preview_path.present?
    # generate the preview using the orignal path so we don't have to use IM if we can
    path = original_path
    if File.exist?(path)
      image_path  = "#{get_path}/preview.jpg"
      begin
        FileConvert.process_file_conversion(path, image_path)
      rescue
        # since this needs to be run synchronously, we can't track this with conversions and retry
        # so, nothing to do here and we'll just show the "cannot convert" placeholder pdf
      end
      # save the preview
      if File.exist?(image_path)
        self.preview_path = image_path
        self.save
      end
    end
    self.preview_path
  end

  private

  def get_path
    raise 'User is required.' if user.nil?
    raise 'Temp Upload has to be saved first.' if self.id.nil?

    path = "#{Doxly.config.temp_dir}/user-#{user.id}/temp-upload-#{self.id}"
    FileUtils.mkdir_p(path) unless Dir.exist?(path)
    path
  end
end
