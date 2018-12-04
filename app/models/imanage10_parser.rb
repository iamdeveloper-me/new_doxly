class Imanage10Parser

  def results_parser(response)
    response["data"]["results"]
  end

  def data_parser(response)
    response["data"]
  end

end
