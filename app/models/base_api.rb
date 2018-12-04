class BaseApi

  JSON_CONTENT_TYPE = 'application/json'
  XML_CONTENT_TYPE  = 'text/xml'

  def get(options={})
    raise 'Path not present' unless options[:path].present?
    headers = options.fetch(:headers, {})
    path    = options.fetch(:path)
    response = connection(options).get(full_path(path))
    handle_response(response, 'get', options)
  end

  def post(options={})
    raise 'Path not present' unless options[:path].present?
    headers   = options.fetch(:headers, {})
    data      = options.fetch(:data, {})
    path      = options.fetch(:path)
    response = connection(options).post do |request|
      request.url full_path(path)
      request.body = data
    end
    handle_response(response, 'post', options)
  end

  def put(options={})
    raise 'Path not present' unless options[:path].present?
    headers   = options.fetch(:headers, {})
    data      = options.fetch(:data, {})
    path      = options.fetch(:path)
    response = connection(options).put do |request|
      request.url full_path(path)
      request.body = data
    end
    handle_response(response, 'put', options)
  end

  def delete(options={})
  end

  def get_refresh_token
  end

  def handle_response(response, action, options)
    path = options.fetch(:path)
    parsed_response = parse_response(response)
    return parsed_response unless response.nil? || !(200..299).include?(response.status)
    # if this is not a token error, raise a generic exception
    raise "API response error. Response: #{response.inspect}" unless token_error?(parsed_response)
    # this is a token error, try again or raise the token expired exception
    if @try_again == true && @dms_user_credentialable
      @try_again = false
      @dms_user_credentialable.set_access_token!(@entity_user)
      @access_token = @dms_user_credentialable.access_token
      new_headers = options[:headers] # pull out the headers for adding the new access token.
      new_headers.merge!(authorization_header_for_rest_api)
      self.send(action, options.merge(new_headers)) # merge in the new headers
    else
      raise DmsApiTokenExpiredError.new(@entity_user, path, @access_token, @dms_type)
    end
  end

  def dms_api_error?
  end

  def token_error?
  end

  def authorization_header_for_rest_api
  end

  def connection(options={})
    headers     = options.fetch(:headers)
    encoding_type = options.fetch(:encoding_type, nil)
    Faraday.new do |faraday|
      faraday.request encoding_type if encoding_type
      faraday.headers = headers
      faraday.response :logger, ::Logger.new(STDOUT), bodies: true
      faraday.adapter :net_http
    end
  end

  def parse_response(response)
    # have to use include? here because all sorts of things get tacked onto application/json, for example 'charset=utf-8'
    if response["content-type"]&.include?(JSON_CONTENT_TYPE)
      JSON.parse(response.body)
    elsif response["content-type"]&.include?(XML_CONTENT_TYPE)
      Hash.from_xml(response.body)
    else
      response.body
    end
  end

  def get_file_content_type(file)
    MIME::Types.type_for(File.basename(file))&.first&.content_type
  end

  def full_path(path)
    self.base_url + URI.encode(path)
  end

  def uploadio_for_file(file)
    UploadIO.new(file.path, get_file_content_type(file))
  end
end
