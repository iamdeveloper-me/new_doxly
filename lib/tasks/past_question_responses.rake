require 'csv'

namespace :past_question_responses do

  task :import, [:path, :entity_name, :deal_type] => :environment do |t, args|

    # intialize the errors csv file.
    CSV.open("lib/tasks/past_question_responses/#{args.entity_name}_question_answer_errors.csv", "wb") do |csv|
      csv << ["Row #", "Question Type", "Question Text", "Acceptable Options", "Answer Given" ]
    end

    # method to write errors to the errors csv file.
    def write_errors_to_csv(args, question_hash, row, header, i)
      CSV.open("lib/tasks/past_question_responses/#{args.entity_name}_question_answer_errors.csv", "ab") do |csv|
        csv << [i, question_hash[header].type, question_hash[header].field, question_hash[header].question_options.map{|qo| qo.text_value}, row[header]|| "N/A"] if question_hash[header]
        csv << [i, "No questionnaire question for: #{header}", "", "", row[header] || "N/A"] if question_hash[header] == nil
      end
    end

    # find or initialize the entity.
    entity = Entity.find_or_initialize_by(name: args.entity_name)
    entity.is_counsel = true
    entity.save
    # initialize empty Entity User
    entity_user = EntityUser.create!(entity_id: entity.id)
    # find the appropriate deal type and questionnaire.
    deal_type = DealType.find_by(name: args.deal_type)
    questionnaire = deal_type.questionnaire

    # read and encode the file
    csv_text = File.read(args.path)
    encoding_options = {
      :invalid           => :replace,  # Replace invalid byte sequences
      :undef             => :replace,  # Replace anything not defined in ASCII
      :replace           => '',        # Use a blank for those replacements
      :universal_newline => true       # Always break lines with \n
    }
    converted_text = csv_text.encode(Encoding.find('ASCII'), encoding_options)

    # parse the CSV with headers.
    csv = CSV.parse(converted_text, headers: true)

    # initialize hash to hold question objects.
    question_hash = {}

    # map csv headers to questions on the questionnaire
    csv.headers.map{|header| question_hash[header] = questionnaire.questions.find_by(field: header)}

    # iterate over each row in the csv.
    csv.each_with_index do |row, i|
      # create the deal and deal_entity_user for each row.
      deal = entity.owned_deals.create!(title: "#{row['What client is being represented?']}-#{row['What is the amount of financing?']}", deal_size: row["What is the amount of financing?"].to_i, deal_type_id: deal_type.id, projected_close_date: Date.yesterday, status: "archived", is_active: true, client_matter_number: "Test1234")
      deal_entity_user = entity_user.deal_entity_users.create!(deal_id: deal.id, entity_user_id: entity_user.id)
      # iterate through each row header, which also gives access to the associated question in the question hash.
      row.headers.each do |header|
        if question_hash[header]
          question_response = deal.question_responses.create!(question_id: question_hash[header].id, deal_id: deal.id, deal_entity_user_id: deal_entity_user.id)
          # checking question type to determine what to do with it
          case question_hash[header].type
          when "ShortTextQuestion"
            puts "text"
            question_response.question_answers.create!(type: "ShortTextAnswer", text_value: row[header])
          when "NumericQuestion"
            # essentially checking to make sure that the value coming in is actually a number, and doesn't just evaluate to one when I call to_i on it.
            if /\A\d+\z/.match(row[header]&.delete("$,% ")) || row[header] == nil
              puts "numeric"
              question_response.question_answers.create!(type: "NumericAnswer", numeric_value: row[header].delete("$%, ").to_i) unless row[header] == nil
              question_response.question_answers.create!(type: "NumericAnswer", numeric_value: row[header]) if row[header] == nil
            else
              puts "error"
              write_errors_to_csv(args, question_hash, row, header, i)
            end
          when "DropdownQuestion"
            question_option = question_hash[header].question_options.find_by(text_value: row[header])
            if question_option
              puts "dropdown"
              question_response.question_answers.create!(type: "OptionAnswer", option_id: question_option.id)
            else
              puts "error"
              write_errors_to_csv(args, question_hash, row, header, i)
            end
          when "ChecklistQuestion"
            puts "checklist"
            if row[header]
              row[header].split(",").each do |answer|
                question_option = question_hash[header].question_options.find_by(text_value: answer)
                other_option = question_hash[header].question_options.find_by(text_value: "Other")
                if question_option
                  question_response.question_answers.create!(type: "OptionAnswer", option_id: question_option.id)
                elsif other_option
                  question_response.question_answers.create!(type: "OptionAnswer", option_id: other_option.id, other_option_value: row[header])
                else
                  write_errors_to_csv(args, question_hash, row, header, i)
                end
              end
            end
          end
        else
          puts "no question found."
          write_errors_to_csv(args, question_hash, row, header, i)
        end
      end
    end
  end
end
