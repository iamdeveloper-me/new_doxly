class NetDocumentsApi < BaseApi
  attr_reader :base_url
  # routes object that will hold all of the specific urls to hit the net documents api.
  ROUTES = {
    oauth: ->(client_id) {},
    get_token: -> {'/OAuth'},
    get_cabinets: -> {'/User/cabinets'},
    get_cabinet_folders: ->(id) {"/Cabinet/#{id}/folders?$select=standardAttributes"},
    get_folder_contents: ->(id) {"/Folder/#{id}?$select=standardAttributes"},
    get_document_profile: ->(id) {"/Document/#{id}/info?getVersions=true"},
    get_recently_accessed_documents: -> {"/User/recentlyAccessedDocs?$select=standardAttributes"},
    get_document_location: ->(id) {"/Document/#{id}/locations."},
    download_version: ->(id, version_number) {"/Document/#{id}/#{version_number}"},
    create_new_version: ->(id, extension) {"/Document/#{id}/new?extension=#{extension}&getVersions=true"},
    create_new_document: -> {"/Document/upload"},
    get_recent_workspaces: -> {"/User/wsRecent?$select=standardAttributes"},
    get_favorite_workspaces: -> {"/User/wsFav?$select=standardAttributes"},
    get_workspace_contents: ->(id) {"/Workspace/#{id}/documents?$select=standardAttributes"},
    # TODO figure out how to search by docId as well. Currently, can't seem to search by more than one parameter using OR
    search_by_name: ->(query, cabinetIds) {"/Search?q==10(#{cabinetIds})=3(#{query}) NOT =11(msg OR eml)&$select=standardAttributes"}, # space after the NOT is crucial.
    search_by_id: ->(query, cabinetIds) {"/Search?q==10(#{cabinetIds})=999(#{query}) NOT =11(msg OR eml OR ndsq OR ndfld)&$select=standardAttributes"}, # space after the NOT is crucial.
    get_version_details: -> (id, version_number) {"/Document/#{id}/#{version_number}/info"}
  }

  DMS_TYPE = 'net_documents'
  TOKEN_EXPIRED_ERRORS = ["Token has expired or is invalid.", "Access Token was not encoded correctly.", "Invalid grant"]

  def initialize(entity_user, options={})
    @entity_user = entity_user
    @base_url = @entity_user.entity.dms_entity_storageable.get_base_api_url
    @dms_user_credentialable = @entity_user&.dms_user_credentialable
    @access_token = @dms_user_credentialable&.access_token
    @dms_type = DMS_TYPE
    @try_again = options.fetch(:try_again, true)
  end

  # ======= AUTHENTICATION ========

  def get_refresh_token(code)
    body = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: @entity_user.entity.dms_entity_storageable.get_redirect_uri # unused, but required by oath2 standards
    }
    post({ path: ROUTES[:get_token].call, headers: {Authorization: authorization_header_for_token_retrieval}, data: body, encoding_type: :url_encoded })
  end

  def get_access_token
    body = {
      grant_type: 'refresh_token',
      refresh_token: @entity_user.dms_user_credentialable&.refresh_token
    }
    post({ path: ROUTES[:get_token].call, headers: {Authorization: authorization_header_for_token_retrieval}, data: body, encoding_type: :url_encoded })
  end

  # ======= Handle ND Resources ========

  def get_cabinets(options={})
    parser.cabinets_parser(get({ path: ROUTES[:get_cabinets].call, headers: authorization_header_for_rest_api }))
  end

  def get_cabinet_folders(options={})
    id = options.fetch(:id)
    parser.folders_parser(get({ path: ROUTES[:get_cabinet_folders].call(id), headers: authorization_header_for_rest_api }))
  end

  def get_folder_contents(options={})
    id = options.fetch(:id)
    parser.folders_parser(get({ path: ROUTES[:get_folder_contents].call(id), headers: authorization_header_for_rest_api }))
  end

  def get_document(options={})
    id = options.fetch(:id)
    parser.document_parser(get({ path: ROUTES[:get_document_profile].call(id), headers: authorization_header_for_rest_api }))
  end

  def get_recently_accessed_documents(options={})
    parser.folders_parser(get({ path: ROUTES[:get_recently_accessed_documents].call, headers: authorization_header_for_rest_api }))
  end

  def get_recent_workspaces(options={})
    parser.folders_parser(get({ path: ROUTES[:get_recent_workspaces].call, headers: authorization_header_for_rest_api }))
  end

  def get_favorite_workspaces(options={})
    parser.folders_parser(get({ path: ROUTES[:get_favorite_workspaces].call, headers: authorization_header_for_rest_api }))
  end

  def get_workspace_documents(options={})
    id = options.fetch(:id)
    parser.folders_parser(get({ path: ROUTES[:get_workspace_contents].call(id), headers: authorization_header_for_rest_api }))
  end

  def download_version(options={})
    id             = options.fetch(:id)
    version_number = options.fetch(:version_number)
    get({ path: ROUTES[:download_version].call(id, version_number), headers: authorization_header_for_rest_api })
  end

  def create_new_version(options={})
    id        = options.fetch(:id)
    file_path = options.fetch(:file_path, '')
    file      = File.open(file_path, 'rb')
    extension = File.extname(file_path).split('.').last
    body = {
      file: uploadio_for_file(file),
    }
    parser.document_version_number_parser(put({ path: ROUTES[:create_new_version].call(id, extension), headers: authorization_header_for_rest_api, data: body, encoding_type: :multipart }))
  end

  def create_new_document(options={})
    file_path     = options.fetch(:file_path, '')
    document_name = options.fetch(:document_name, '')
    file          = File.open(file_path, 'rb')
    extension     = File.extname(file_path).split('.').last
    destination   = options.fetch(:destination, '')
    raise 'Must specify document name' unless document_name.present?
    raise 'Must specify location' unless destination.present?
    raise 'File must exist' unless File.exist?(file_path)
    raise 'Must specify extension' unless extension.present?
    body = {
      file: uploadio_for_file(file),
      name: document_name,
      extension: extension,
      destination: destination
    }
    parser.create_new_document_parser(post({ path: ROUTES[:create_new_document].call, headers: authorization_header_for_rest_api.merge(create_document_header), data: body, encoding_type: :multipart }))
  end

  def search(options={})
    query = options.fetch(:query, '')
    query = '*' + query + '*'
    cabinet_string = ''
    get_cabinets.each do |cabinet|
      cabinet_string += "[#{cabinet["id"]}]"
    end
    id_results = parser.folders_parser(get({ path: ROUTES[:search_by_id].call(query, cabinet_string), headers: authorization_header_for_rest_api }))
    return id_results if id_results.any?
    parser.folders_parser(get({path: ROUTES[:search_by_name].call(query, cabinet_string), headers: authorization_header_for_rest_api }))
  end

  def get_version_details(options={})
    id              = options.fetch(:id)
    version_number  = options.fetch(:version_number)
    parser.version_parser(get({ path: ROUTES[:get_version_details].call(id, version_number), headers: authorization_header_for_rest_api }))
  end

  protected

  def dms_api_error?(response)
    response["Error"].present?
  end

  def token_error?(response)
    self.class::TOKEN_EXPIRED_ERRORS.include?(response['Error']&.[]('error'))
  end

  private

  def authorization_header_for_token_retrieval
    net_documents_entity_storage = @entity_user.entity.dms_entity_storageable
    client_string = "#{net_documents_entity_storage.get_client_id}:#{net_documents_entity_storage.get_client_secret}"
    "Basic #{Base64.strict_encode64(client_string)}"
  end

  def authorization_header_for_rest_api
    {Authorization: "Bearer #{@access_token}"}
  end

  def create_document_header
    {"Content-Disposition": "form-data; name='extension'"}
  end

  def parser
    NetDocumentsParser.new
  end
end
