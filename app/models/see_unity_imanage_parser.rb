class SeeUnityImanageParser

  def folders_parser(response)
    response["Elements"]
  end

  def versions_list_parser(response)
    response["Versions"]
  end

  def workspaces_search_parser(response, connector_id)
    response["Results"].map do |resource|
      {
        "EID": "#{connector_id}#{resource["p1"]}",
        "Name": resource["p5"],
        "Extension": resource["p7"]
      }
    end
  end

  def documents_search_parser(response)
    response["Elements"].map do |resource|
      resource["Name"] = resource["Description"]
      resource
    end
  end

  def repository_workspaces_parser(response)
    response["Workspaces"]
  end
end
