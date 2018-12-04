class App::Counsel::QuestionnairesController < App::ApplicationController
  helper QuestionnaireHelper

  def new
    check_create(:question_response)
    questionnaire
    question_responses
  end

  def save_responses
    check_update(:question_response)
    question_responses
    question_response_params["question_responses_attributes"].each do |question_response_param|
      question = questionnaire.questions.find_by(:id => question_response_param["question_id"].to_i)
      next unless question
      answer_class                           = QuestionAnswer.answer_class question.class.name
      question_response                      = deal.question_responses.find_or_initialize_by :question_id => question.id
      question_response.deal_entity_user_id = deal.deal_entity_users.find_by(:entity_user_id => current_entity_user.id).id

      question_response.question_answers.destroy_all

      question_answers_attributes = question_response_param["question_answers_attributes"]
      # pop out the first element for numeric answers as the plugin we use submits 2 numeric values
      question_answers_attributes.shift if answer_class.equal?(NumericAnswer) && question_answers_attributes.size > 1

      question_answers_attributes.each do |question_answer_param|
        question_answer = question_response.question_answers.new
        question_answer = question_answer.becomes!(answer_class)
        question_answer.attributes = question_answer_param
        next if question_answer.value.blank?
      end

      deal.question_responses << question_response
    end
    if deal.save!
      redirect_to new_deal_closing_book_path(deal)
    else
      render :new
    end
  end

  def edit
    check_update(:question_response)
    questionnaire
    question_responses
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def questionnaire
    @questionnaire = deal.deal_type.questionnaire
  end

  def question_responses
    @question_responses = deal.question_responses
  end

  def question_response_params
    params.require(:deal).permit(
      question_responses_attributes: [
        :question_id, :deal_entity_user_id,
        question_answers_attributes: [:numeric_value, :text_value, :option_id, :other_option_value, :date_value]
      ]
    )
  end

end
