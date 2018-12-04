class SeeUnityImanageApi < BaseApi
  attr_reader :base_url
  ROUTES = {
    get_refresh_token: -> {"/tokens/retrieve"},
    get_access_token: -> {"/tokens/refresh"},
    get_repository_workspaces: -> (connector_id) {"/connectors/#{connector_id}/workspaces"},
    download_version: -> (id) {"/elements/#{id}"},
    get_folder_contents: ->(id) {"/elements/#{id}/children?returnFields=ALL"},
    get_matter_worklist: ->(connector_id, matter_worklist_repository_id) {"/elements/#{matter_worklist_repository_id}/children?returnFields=ALL"},
    get_my_favorites: ->(connector_id, my_favorites_repository_id) {"/elements/#{my_favorites_repository_id}/children?returnFields=ALL"},
    get_my_matters: ->(connector_id, my_matters_repository_id) {"/elements/#{my_matters_repository_id}/children?returnFields=ALL"},
    get_versions_list: ->(id) {"/elements/#{id}/versions"},
    search_documents_by_document_number: ->(connector_id, query) {"/connectors/#{connector_id}/search?criteria=imProfileDocNum=#{query}&returnFields=RAW"},
    search_by_name: ->(connector_id, query) {"/connectors/#{connector_id}/custom?type=LIST&cmd=10036&parms=imProfileName=#{query};parentType=all"},
    search_by_client_id: -> (connector_id, query) {"/connectors/#{connector_id}/custom?type=LIST&cmd=10036&parms=imProfileCustom1=#{query};parentType=all"},
    create_new_version: ->(id) {"/elements/#{id}/addversion"},
    create_new_document: ->(parent_id) {"/elements/#{parent_id}/files"},
    get_element_profile: ->(id) {"/elements/#{id}/profile?returnFields=ALL"},
    get_recent_documents: -> (connector_id, document_worklist_repository_id) {"/elements/#{document_worklist_repository_id}/children?returnFields=ALL"}
  }

  DMS_TYPE = 'see_unity_imanage'
  TOKEN_EXPIRED_ERRORS = ["Token has expired or is invalid.", "Access Token was not encoded correctly.", "Invalid Authorization header", "Invalid token", "Access token expired, please refresh"]

  def initialize(entity_user, options={})
    @entity_user = entity_user
    see_unity_imanage_entity_storage = @entity_user.entity.dms_entity_storageable
    @base_url = see_unity_imanage_entity_storage.get_base_api_url
    @dms_user_credentialable = @entity_user&.dms_user_credentialable
    @access_token = @dms_user_credentialable&.access_token
    @connector_id = see_unity_imanage_entity_storage.connector_id
    @my_matters_repository_id = @dms_user_credentialable&.my_matters_repository_id
    @my_favorites_repository_id = @dms_user_credentialable&.my_favorites_repository_id
    @matter_worklist_repository_id = @dms_user_credentialable&.matter_worklist_repository_id
    @document_worklist_repository_id = @dms_user_credentialable&.document_worklist_repository_id
    @dms_type = DMS_TYPE
    @try_again = true
  end

  # ======= AUTHENTICATION ========

  def get_refresh_token(username, password)
    body = {
      User: username,
      Password: password,
      Connector: @connector_id
    }
    headers = {}
    post({ path: ROUTES[:get_refresh_token].call, data: body.as_json, headers: headers, encoding_type: :url_encoded })
  end

  def get_access_token
    body = {
      RefreshToken: @dms_user_credentialable&.refresh_token
    }
    headers ={}
    post({ path: ROUTES[:get_access_token].call, data: body.as_json, headers: headers, encoding_type: :url_encoded})
  end

  def get_repository_workspace_ids
    parser.repository_workspaces_parser(get({ path: ROUTES[:get_repository_workspaces].call(@connector_id), headers: authorization_header_for_rest_api }))
  end

  # ======= Handle iManage Resources ========

  def get_matter_worklist(options={})
    parser.folders_parser(get({ path: ROUTES[:get_matter_worklist].call(@connector_id, @matter_worklist_repository_id), headers: authorization_header_for_rest_api }))
  end

  def get_folder_contents(options={})
    id = options.fetch(:id)
    parser.folders_parser(get({ path: ROUTES[:get_folder_contents].call(id), headers: authorization_header_for_rest_api }))
  end

  def get_versions_list(options={})
    id = options.fetch(:id)
    parser.versions_list_parser(get({ path: ROUTES[:get_versions_list].call(id), headers: authorization_header_for_rest_api }))
  end

  def download_version(options={})
    id = options.fetch(:id)
    get({ path: ROUTES[:download_version].call(id), headers: authorization_header_for_rest_api })
  end

  def get_my_matters(options={})
    parser.folders_parser(get({ path: ROUTES[:get_my_matters].call(@connector_id, @my_matters_repository_id), headers: authorization_header_for_rest_api }))
  end

  def get_my_favorites(options={})
    parser.folders_parser(get({ path: ROUTES[:get_my_favorites].call(@connector_id, @my_favorites_repository_id), headers: authorization_header_for_rest_api }))
  end

  def search(options={})
    query = options.fetch(:query, "")
    document_results_by_document_number = parser.documents_search_parser(get({ path: ROUTES[:search_documents_by_document_number].call(@connector_id, query), headers: authorization_header_for_rest_api })) if query&.is_number?
    workspace_results_by_client_id = parser.workspaces_search_parser(get({path: ROUTES[:search_by_client_id].call(@connector_id, query), headers: authorization_header_for_rest_api}), @connector_id) if query&.is_number?
    results = []
    results += document_results_by_document_number
    results += workspace_results_by_client_id if workspace_results_by_client_id
    results
  end

  def create_new_version(options={})
    id        = options.fetch(:document_id)
    file_path = options.fetch(:file_path, '')
    file      = File.open(file_path, 'rb')
    comment   = options.fetch(:comment)
    extension = File.extname(file_path).split('.').last

    # rename file to keep the same name as the original version. Ideally there would be an option I could pass in to avoid changing the name, but that doesn't seem to exist currently.
    document_name = options.fetch(:document_name)
    folder_path = File.dirname(file_path) # drop the filename off
    new_path = "#{folder_path}/#{ApplicationHelper.sanitize_filename(document_name)}.#{extension}"
    File.rename(file, new_path)
    renamed_file = File.open(new_path)

    body = {
      file: uploadio_for_file(renamed_file),
      imProfileComment: JSON.dump(comment)
    }
    post({ path: ROUTES[:create_new_version].call(id), headers: authorization_header_for_rest_api, data: body, encoding_type: :multipart })
  end

  def create_new_document(options={})
    parent_id         = options.fetch(:destination)
    file_path         = options.fetch(:file_path)
    new_document_name = options.fetch(:document_name)
    comment           = options.fetch(:comment)
    begin
      file = File.open(file_path)
      folder_path = File.dirname(file.path) # drop the filename off
      new_path = folder_path +'/' + ApplicationHelper.sanitize_filename(new_document_name) + File.extname(file)
      File.rename(file, new_path)
      renamed_file = File.open(new_path)
      body = {
        file: uploadio_for_file(renamed_file),
        imProfileComment: JSON.dump(comment)
      }
      post({ path: ROUTES[:create_new_document].call(parent_id), headers: authorization_header_for_rest_api, data: body, encoding_type: :multipart })
    ensure
      file.close if file
      renamed_file.close if renamed_file
    end
  end

  def get_element_profile(options={})
    id = options.fetch(:id)
    get({ path: ROUTES[:get_element_profile].call(id), headers: authorization_header_for_rest_api })
  end

  def get_recent_documents
    parser.folders_parser(get({ path: ROUTES[:get_recent_documents].call(@connector_id, @document_worklist_repository_id), headers: authorization_header_for_rest_api }))
  end

  protected

  def dms_api_error?(response)
    # there's no error key or anything, just have to add the all of the possible errors here.
    response["api_error"] == true
  end

  def token_error?(response)
    TOKEN_EXPIRED_ERRORS.include?(response["Message"])
  end

  private

  def parser
    SeeUnityImanageParser.new
  end

  def authorization_header_for_rest_api
    {Authorization: "Bearer #{@access_token}"}
  end
end
