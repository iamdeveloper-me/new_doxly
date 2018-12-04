include Asposewordsjavaforruby

# This class takes care of processing all the coversions using the tools as needed
class FileConvert

  SUPPORTED_FILE_FORMATS       = [".doc", ".docx", ".htm", ".html", ".ods", ".odt", ".rtf", ".txt", ".xls",
                                    ".xlsm", ".xlsx", ".xml", ".xsd", ".odp", ".ppt", ".pptx", ".pdf", ".bmp",
                                    ".gif", ".jpeg", ".jpg", ".png", ".tif", ".tiff", ".svg", ".pages", ".key"]
  SUPPORTED_CONVERSION_FORMATS = [".pdf", ".jpg"]

  class << self
    def process_file_conversion(file_path, output_file_path, only_first_page=false)
      file_convert = FileConvert.new(file_path, output_file_path, only_first_page)
      file_convert.convert
    end

    def is_supported_file_type?(file_type)
      SUPPORTED_FILE_FORMATS.include?(file_type)
    end
  end

  # instance methods
  def initialize(file_path, output_file_path, only_first_page=false)
    @result           = {}
    @file_path        = file_path
    @output_file_path = output_file_path
    @extension        = File.extname(@file_path).downcase
    @format           = @extension.delete('.').to_sym
    @output_extension = File.extname(@output_file_path).downcase
    @output_format    = @output_extension.delete('.').to_sym
    @only_first_page  = only_first_page
  end

  def convert
    # only allow supported formats
    unless SUPPORTED_FILE_FORMATS.include?(@extension) && SUPPORTED_CONVERSION_FORMATS.include?(@output_extension)
        @result = { tool: "none", response: { :message => "Unsupported file or conversion format (#{@extension} to #{@output_extension})" } }
      return @result
    end

    # try converting with Aspose if this is Word (.doc/.docx)
    try_aspose if ['.docx', '.doc'].include?(@extension)

    # try converting with ImageMagick if we are going from pdf to jpg
    try_imagemagick if !output_file_has_size? && pdf_to_jpg?

    # if Aspose & ImageMagick are both no-go, user cloudconvert!
    try_cloudconvert if !output_file_has_size? && Doxly.config.cloudconvert_api_key

    # return the result
    return @result
  end

  private

  def try_aspose
    @result[:tool] = "aspose"
    begin
      initialize_aspose_words
      document     = Rjb::import('com.aspose.words.Document').new(@file_path)
      if @output_format == :pdf && @only_first_page
        pdf_save_options            = Rjb::import('com.aspose.words.PdfSaveOptions').new
        pdf_save_options.page_index = 0        
        pdf_save_options.page_count = 1       
        document.save(@output_file_path, pdf_save_options)
      else
        save_format  = Rjb::import('com.aspose.words.SaveFormat')
        format_const = @output_format == :pdf ? save_format.PDF : save_format.JPEG
        document.save(@output_file_path, format_const)
      end
      # do the conversion
      @result[:is_successful] = output_file_has_size?
    rescue StandardError => e
      @result[:response] = { error: e.message }
    end
  end

  def try_imagemagick
    @result[:tool] = "imagemagick"
    begin
      ApplicationHelper.im_image_from_path(@file_path) do |image|
        image.alpha = Magick::BackgroundAlphaChannel
        image.write(@output_file_path)
      end
      @result[:is_successful] = output_file_has_size?
    rescue StandardError => e
      @result[:response] = { error: e.message }
    end
  end

  def try_cloudconvert
    # initialize
    @result[:tool]          = "cloudconvert"
    is_successful, response = [false, {}]
    # create the process
    process            = build_cloudconvert_process
    process_response   = process.create
    process_successful = process_response[:success] == true
    if process_successful
      # We don't have an option to specify the name on conversion download. It will match the name provided when uploading. So, overriding it here
      # so the downloaded file will be "converted-xxx.pdf"
      input_filename        = File.basename(@output_file_path, ".*") + @extension
      conversion_successful = false
      input_file_base64     = Base64.encode64(File.open(@file_path, "rb").read)
      begin
        conversion_options  = {
          input: "base64",
          outputformat: @output_format,
          file: input_file_base64,
          download: "false",
          wait: "true",
          filename: input_filename,
          timeout: 1200
        }
        conversion_options.merge!({ converteroptions: { page_range: "1-1" } }) if @only_first_page
        conversion_response = process.convert(conversion_options)
        conversion_successful = conversion_response && conversion_response[:success] && conversion_response[:step] == "finished"
        # download the converted file, if conversion was successful
        if conversion_successful
          output_path = File.dirname(@output_file_path)
          process.download(output_path)
          # if the filename does not match, change it to match (if we are doing same type conversions, CC appends a .1 to the end of the converted file name)
          converted_filename = conversion_response[:output][:filename]
          if File.basename(@output_file_path) != converted_filename
            File.rename("#{output_path}/#{converted_filename}", @output_file_path)
          end
        end
        is_successful, response = if output_file_has_size?
                                    [conversion_successful, conversion_response]
                                  else
                                    [false, { error: "Unable to download the converted file from CloudConvert", conversion_response: conversion_response }]
                                  end
      rescue StandardError => e
        is_successful, response = [false, { error: e.message }]
      ensure
        # delete the process, which deletes all the files with it
        # there is a bug in the CC gem so cannot call process.delete. There is an open issue on the repo for this.
        url = "#{CloudConvert::PROTOCOL}:#{process_response[:url]}"
        Faraday.delete(url, query: { apikey: Doxly.config.cloudconvert_api_key})
      end
    else
      is_successful, response = [process_successful, process_response]
    end

    # return the response details
    @result[:is_successful] = is_successful
    @result[:response]      = response
  end

  def pdf_to_jpg?
    @format == :pdf && [:jpg, :jpeg].include?(@output_format)
  end

  def output_file_has_size?
    size = File.size?(@output_file_path)
    size && size > 0
  end

  def build_cloudconvert_process
    client = CloudConvert::Client.new(api_key: Doxly.config.cloudconvert_api_key)
    client.build_process(input_format: @format, output_format: @output_format)
  end

end
