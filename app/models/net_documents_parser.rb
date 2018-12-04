class NetDocumentsParser

  def cabinets_parser(response)
    parsed_response = response["ArrayOfndCabinetInfo"]&.[]("ndCabinetInfo")
    parse_as_array(parsed_response)
  end

  def folders_parser(response)
    parsed_response = response["ndList"]&.[]("standardList")&.[]("ndProfile.DocumentStat")
    parse_as_array(parsed_response)
  end

  def document_parser(response)
    version_value = response["ndProfile.DocumentInformation"]&.[]("docVersions")&.[]("version")
    return [] unless response["ndProfile.DocumentInformation"] && version_value
    response["ndProfile.DocumentInformation"]["docVersions"]["version"] = parse_as_array(version_value)
    response["ndProfile.DocumentInformation"]
  end

  def create_new_document_parser(response)
    response["ndProfile.DocumentStat"]&.[]("envId")
  end

  def document_version_number_parser(response)
    response["ndProfile.DocumentStat"]&.[]("newVer")
  end

  def version_parser(response)
    response["ndProfile.DocVersionInfo"]
  end

  private

  # turn into an array if it's not already.
  def parse_as_array(response)
    return [] unless response
    if response.is_a?(Array)
      response
    else
      [response]
    end
  end
end
