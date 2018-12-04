require 'csv'

namespace :templates do
  task :clean => :environment do
    Template.where(:entity_id => nil).destroy_all
  end

  task :import_all => :environment do
    # import all CSV files in the templates directory
    puts "This may take a few minutes"
    Dir.glob("#{Rails.root}/lib/tasks/templates/*.csv") do |file|
      puts "\nImporting #{file}..."
      Rake.application['templates:import'].invoke(file)
      Rake.application['templates:import'].reenable       # must reenable to invoke again
    end

    # create blank templates
    blank_diligence_template = Template.new(:name => "Blank")
    blank_diligence_template.category = DiligenceCategory.new()
    blank_closing_template = Template.new(:name => "Blank")
    blank_closing_template.category = ClosingCategory.new()

    default_deal_types = DealType.where('entity_id IS NULL')
    default_deal_types.each do |deal_type|
      blank_diligence_template.deal_type_templates.new(:deal_type_id => deal_type.id)
      blank_closing_template.deal_type_templates.new(:deal_type_id => deal_type.id)
    end

    blank_diligence_template.save
    blank_closing_template.save
  end

  task :import, [:path] => :environment do |t, args|
    # create new template
    template = Template.new

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

    # iterate over the rows
    csv.each_with_index do |group, index|
      if index == 0
        # title and type
        puts "Title: #{group[0]}"
        puts "Type: #{group[1]}"

        # title
        template.name = group[0]

        # checklist type
        template.category = group[1] == "Diligence" ? DiligenceCategory.new : ClosingCategory.new
        template.category.save

        # deal type
        if group[2].nil?
          # if no type, assume it applies to all types
          default_deal_types = DealType.where('entity_id IS NULL')
          default_deal_types.each do |deal_type|
            template.deal_type_templates.new(:deal_type_id => deal_type.id)
          end
        else
          deal_type = DealType.find_by(:name => group[2])
          template.deal_type_templates.new(:deal_type_id => deal_type.id)
        end

      elsif index > 2
        # a row with a section, document, or folder
        group.each_with_index do |field, index|
          if not field.nil?
            case index
            when 0
              # title or section/stage
              puts field
              if template.category.is_diligence?
                section = template.category.children.new(:name => field, :type => "Folder")
              else
                section = template.category.children.new(:name => field, :type => "Section")
              end
              if group[4] == "Yes"
                section.is_post_closing = true
              end
              section.save
            when 1
              # document
              puts "    #{field}"
              section = template.category.children.last
              document = nil
              child = nil
              if template.category.is_diligence? && !group[3].nil?
                child = section.children.new(:name => field, :description => group[3], :type => "Folder")
              else
                child = section.children.new(:name => field, :type => "Document")
              end
              child.save
              # template.category.sections.last.tasks << task
              # template.category.sections.last.tasks = template.category.sections.last.tasks.unshift(task)
            when 2
              # folder or file
              puts "        #{field}"
              if template.category.is_diligence?
                child = template.category.children.last.children.last.children.new(:name => field, :type => "Folder")
                child.save
              else
                # document = Document.new(:title => field)
                # deal_document = document.deal_documents.new
                # deal_document.documentable = template.category.sections.last.tasks.last

                # template.category.sections.last.tasks.last.deal_documents = template.category.sections.last.tasks.last.deal_documents.unshift(deal_document)
              end
            else
            end
          end
        end
      end
    end
    if template.save
    else
      puts "****** ERROR: INVALID TEMPLATE ******"
    end
  end
end
