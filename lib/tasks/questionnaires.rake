require 'csv'

namespace :questionnaires do
  task :clean => :environment do
    Questionnaire.destroy_all
  end

  task :import_all => :environment do
    # import all CSV files in the questionnaires directory
    puts "This may take a few minutes"
    Dir.glob("#{Rails.root}/lib/tasks/questionnaires/*.csv") do |file|
      puts "\nImporting #{file}..."
      Rake.application['questionnaires:import'].invoke(file)
      Rake.application['questionnaires:import'].reenable       # must reenable to invoke again
    end
  end

  task :import, [:path] => :environment do |t, args|
    # create new questionnaire
    questionnaire = Questionnaire.new

    # read and encode the file
    csv_text = File.read(args.path)
    encoding_options = {
      :invalid           => :replace,  # Replace invalid byte sequences
      :undef             => :replace,  # Replace anything not defined in ASCII
      :replace           => '',        # Use a blank for those replacements
      :universal_newline => true       # Always break lines with \n
    }
    converted_text = csv_text.encode(Encoding.find('ASCII'), encoding_options)
    csv = CSV.parse(converted_text)

    #iterate over the rows
    csv.each_with_index do |group, index|
      if index == 0

        # type
        deal_type = DealType.find_by(:name => group[0])
        questionnaire.deal_type_id = deal_type.id
      elsif index > 1
        # question
        question = questionnaire.questions.new(:field => group[1], :type => group[2], :unit_type => group[3], :value_key => group[7], :is_active => group[8])
        puts question.field

        #question options
        if group[4].nil?
          question.save!
        else
          group[4].split(' , ').each do |option|
            question.question_options.new(:label => option).save!
            puts " - #{option}"
          end
        end

        unless group[5].nil?
          question.question_dependencies.new(:question_id => question.id, :dependent_question_id => group[5], :question_option_id => group[6]).save!
        end
      end

      if questionnaire.save!
      else
        puts "****** ERROR: INVALID Questionnaire ******"
      end
    end
  end
end
