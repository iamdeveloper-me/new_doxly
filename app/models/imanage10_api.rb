class Imanage10Api < BaseApi
  attr_accessor :base_url
  # routes object that will hold all of the specific urls to hit the iManage10 api.
  ROUTES = {
    authenticate: -> {"/session/login"},
    get_recent_workspaces: ->(customer_id, library_id) {"/customers/#{customer_id}/libraries/#{library_id}/recent-workspaces"},
    get_workspace_contents: ->(customer_id, library_id, workspace_id) {"/customers/#{customer_id}/libraries/#{library_id}/workspaces/#{workspace_id}/children"},
    get_folder_contents: ->(customer_id, library_id, folder_id) {"/customers/#{customer_id}/libraries/#{library_id}/folders/#{folder_id}/children"},
    get_document_profile: ->(customer_id, library_id, document_id) {"/customers/#{customer_id}/libraries/#{library_id}/documents/#{document_id}"},
    get_versions_list: ->(customer_id, library_id, document_id) {"/customers/#{customer_id}/libraries/#{library_id}/documents/#{document_id}/versions"},
    get_my_favorites: ->(customer_id, library_id) {"/customers/#{customer_id}/libraries/#{library_id}/my-favorites/children?limit=500"},
    get_my_matters: ->(customer_id, library_id, user_id) {"/customers/#{customer_id}/libraries/#{library_id}/users/#{user_id}/my-matters/children?exclude_emails=true"},
    get_recent_documents: -> (customer_id, library_id) {"/customers/#{customer_id}/libraries/#{library_id}/recent-documents"},
    download_version: -> (customer_id, library_id, document_id, version_number) {"/customers/#{customer_id}/libraries/#{library_id}/documents/#{document_id}/download?version=v#{version_number}"},
    create_new_document: -> (customer_id, library_id, folder_id) {"/customers/#{customer_id}/libraries/#{library_id}/folders/#{folder_id}/documents"},
    create_new_version: -> (customer_id, library_id, doc_id) {"/customers/#{customer_id}/libraries/#{library_id}/documents/#{doc_id}/versions"},
    search_documents: -> (customer_id, library_id) {"/customers/#{customer_id}/libraries/#{library_id}/documents/search"},
    search_workspaces: -> (customer_id, library_id, query) {"/customers/#{customer_id}/libraries/#{library_id}/workspaces?name=#{query}"}
  }

  DMS_TYPE = 'imanage10'
  TOKEN_EXPIRED_ERRORS = ["X-Auth-Token is invalid or missing"]

  IMANAGE_UPLOAD_CLASS = 'DOC'
  IMANAGE_UPLOAD_ACCESS_LEVEL = 'full_access'

  DOCUMENT_PROFILE_FIELDS = [
    "author",
    "author_description",
    "class",
    "class_description",
    "content_type",
    "create_date",
    "database",
    "declared",
    "default_security",
    "document_number",
    "edit_date",
    "edit_profile_date",
    "extension",
    "file_create_date",
    "file_edit_date",
    "id",
    "in_use",
    "indexable",
    "is_checked_out",
    "is_declared",
    "is_external",
    "is_external_as_normal",
    "is_hipaa",
    "is_in_use",
    "is_related",
    "is_restorable",
    "iwl",
    "last_user",
    "last_user_description",
    "name",
    "operator",
    "operator_description",
    "retain_days",
    "size",
    "type",
    "type_description",
    "version",
    "wstype"
  ]

  def initialize(entity_user)
    @entity_user             = entity_user
    @base_url                = @entity_user.entity.dms_entity_storageable.get_base_api_url
    @dms_user_credentialable = @entity_user&.dms_user_credentialable
    @access_token            = @dms_user_credentialable&.access_token
    @try_again               = true
    @customer_id             = @dms_user_credentialable&.customer_id
    @library_id              = @dms_user_credentialable&.imanage10_user_object&.[]("preferred_library")
    @imanage10_user_id       = @dms_user_credentialable&.imanage10_user_object&.[]("user_id")
    @dms_type = DMS_TYPE
  end

  # ======= AUTHENTICATION ========

  def get_access_token(username, password)
    @base_url = "https://sdksandbox.goimanage.com/imanage/api/v1"
    body = JSON.dump({
      user_id: username,
      password: password
    })
    headers = {'Content-Type': 'application/json', 'Accept' => 'application/json'}
    put({ path: ROUTES[:authenticate].call, data: body, headers: headers})
  end

  # ======= Handle iManage10 Resources ========

  def get_matter_worklist(options={})
    parser.results_parser(get({ path: ROUTES[:get_recent_workspaces].call(@customer_id, @library_id), headers: authorization_header_for_rest_api}))
  end

  def get_workspace_contents(options={})
    id = options.fetch(:id)
    parser.data_parser(get({path: ROUTES[:get_workspace_contents].call(@customer_id, @library_id, id), headers: authorization_header_for_rest_api}))
  end

  def get_folder_contents(options={})
    id = options.fetch(:id)
    parser.data_parser(get({path: ROUTES[:get_folder_contents].call(@customer_id, @library_id, id), headers: authorization_header_for_rest_api}))
  end

  def get_versions_list(options={})
    document_id = options.fetch(:document_id)
    # because of document shortcut objects, we're getting the actual document object as well here. For consistency doing it always, if too slow, we can only do it when in the My Favorites Tab.
    # we went a different route for seeUnity, but this seems to be a better performance.
    document = parser.data_parser(get({path: ROUTES[:get_document_profile].call(@customer_id, @library_id, document_id), headers: authorization_header_for_rest_api}))
    versions = parser.data_parser(get({path: ROUTES[:get_versions_list].call(@customer_id, @library_id, document_id), headers: authorization_header_for_rest_api}))
    document["versions"] = versions
    document
  end

  def get_my_favorites(options={})
    parser.data_parser(get({ path: ROUTES[:get_my_favorites].call(@customer_id, @library_id), headers: authorization_header_for_rest_api}))
  end

  def get_my_matters(options={})
    parser.data_parser(get({ path: ROUTES[:get_my_matters].call(@customer_id, @library_id, @imanage10_user_id), headers: authorization_header_for_rest_api}))
  end

  def get_recent_documents(options={})
    parser.results_parser(get({ path: ROUTES[:get_recent_documents].call(@customer_id, @library_id), headers: authorization_header_for_rest_api}))
  end

  def download_version(options={})
    id = options.fetch(:id)
    version_number = options.fetch(:version_number)
    get({path: ROUTES[:download_version].call(@customer_id, @library_id, id, version_number), headers: authorization_header_for_rest_api})
  end

  def create_new_document(options={})
    parent_id         = options.fetch(:destination)
    file_path         = options.fetch(:file_path)
    new_document_name = options.fetch(:document_name)
    begin
      file = File.open(file_path)
      folder_path = File.dirname(file_path) # drop the filename off
      extension = File.extname(file)
      new_path = "#{folder_path}/#{ApplicationHelper.sanitize_filename(new_document_name)}#{extension}"
      File.rename(file, new_path)
      renamed_file = File.open(new_path)
      # build the profile for the new document
      profile = {
        warnings_for_required_and_disabled_fields: true,
        doc_profile: {
          name: new_document_name,
          user_trustees: [
            {
              name: @imanage10_user_id,
              id: @imanage10_user_id,
              access: IMANAGE_UPLOAD_ACCESS_LEVEL
            }
          ]
        }.merge(common_doc_profile_fields(renamed_file))
      }
      payload = {
        profile: JSON.dump(profile),
        file: uploadio_for_file(renamed_file)
      }
      path = ROUTES[:create_new_document].call(@customer_id, @library_id, parent_id)
      parser.data_parser(post({ path: path, headers: authorization_header_for_rest_api.merge({ 'Accept' => 'application/json' }), data: payload, encoding_type: :multipart }))
    ensure
      file.close if file
      renamed_file.close if renamed_file
    end
  end

  def create_new_version(options={})
    file_path   = options.fetch(:file_path)
    document_id = options.fetch(:document_id)
    begin
      file      = File.open(file_path)
      extension = File.extname(file)
      profile   = {
        warnings_for_required_and_disabled_fields: true,
        doc_profile: {
          extension: extension.delete('.') # remove the period on the beginning of the file extension because imanage can't handle it.
        }.merge(common_doc_profile_fields(file))
      }
      payload   = {
        profile: JSON.dump(profile),
        file: uploadio_for_file(file)
      }
      path      = ROUTES[:create_new_version].call(@customer_id, @library_id, document_id)
      parser.data_parser(post({ path: path, headers: authorization_header_for_rest_api.merge({ 'Accept' => 'application/json' }), data: payload, encoding_type: :multipart }))
    ensure
      file.close if file
    end
  end

  def search(options={})
    query = options.fetch(:query)
    data_for_workspace_name_search = {
      filters: {
        name_or_description: query
      },
      limit: 50
    }
    document_name_results  = search_documents_by_name(query)
    document_id_results    = search_documents_by_id(query) if query.is_number?
    workspace_name_results = search_workspaces_by_name(query)
    document_name_results + document_id_results.to_a + workspace_name_results

  end

  def search_workspaces_by_name(query)
    parser.results_parser(get({ path: ROUTES[:search_workspaces].call(@customer_id, @library_id, query), headers: authorization_header_for_rest_api.merge({ 'Accept' => 'application/json' })}))
  end

  def search_documents_by_name(query)
    data = {
      profile_fields: {
        document: DOCUMENT_PROFILE_FIELDS
      },
      filters: {
        name: query,
        exclude_emails: true,
        exclude_shortcuts: true
      },
      limit: 50
    }
    parser.data_parser(post({ path: ROUTES[:search_documents].call(@customer_id, @library_id), data: JSON.dump(data), headers: authorization_header_for_rest_api.merge({"Content-Type": 'application/json'}) } ))
  end

  def search_documents_by_id(query)
    data = {
      profile_fields: {
        document: DOCUMENT_PROFILE_FIELDS
      },
      filters: {
        document_number: query,
        exclude_emails: true,
        exclude_shortcuts: true
      },
      limit: 50
    }
    parser.data_parser(post({ path: ROUTES[:search_documents].call(@customer_id, @library_id), data: JSON.dump(data), headers: authorization_header_for_rest_api.merge({"Content-Type": 'application/json'}) } ))
  end

  protected

  def dms_api_error?(response)
    response["error"].present?
  end

  def token_error?(response)
    self.class::TOKEN_EXPIRED_ERRORS.include?(response['error']&.[]('message'))
  end

  private

  def common_doc_profile_fields(file)
    content_type = get_file_content_type(file)
    imanage_type = get_imanage_type_from_content_type(content_type)
    {
      size: file.size,
      type: imanage_type,
      class: IMANAGE_UPLOAD_CLASS,
      author: @imanage10_user_id,
      database: @library_id
    }
  end

  def get_imanage_type_from_content_type(content_type)
    case content_type
    when ->(ct) { ['application/pdf', 'application/x-pdf'].include?(ct) }
      return 'ACROBAT'
    when 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      return 'WORDX'
    when 'application/msword'
      return 'WORD'
    when 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      return 'PPTX'
    else
      # It seems that iManage10 will accept Acrobat as a type even if its not a pdf and then corrects on the backend.
      # They don't seem to have any other options besides these 4, even though there are way more content types.
      'ACROBAT'
    end
  end

  def authorization_header_for_rest_api
    {Authorization: "Bearer #{@access_token}"}
  end

  def create_document_header
  end

  def parser
    Imanage10Parser.new
  end
end
