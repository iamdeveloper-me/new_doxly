module QuestionnaireHelper

  def questionniare_answer_value(deal, value_key)
    case value_key
    when 'closing_date'
      deal.projected_close_date
    end
  end

end
