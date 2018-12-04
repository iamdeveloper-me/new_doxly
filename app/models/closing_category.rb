class ClosingCategory < Category

  def export_to_word_doc
    # Seems like the gem wants to start from the current folder you are in.
    FileUtils.mkdir_p(Doxly.config.checklist_exports_dir)
    docx_file_name = ApplicationHelper.sanitize_filename("#{self.deal.title}_checklist.docx")
    docx_file_path = "#{Doxly.config.checklist_exports_dir}/#{docx_file_name}"
    Caracal::Document.save docx_file_path do |docx|

      docx.style do
        id              'Heading1'  # sets the internal identifier for the style.
        name            'heading 1' # sets the friendly name of the style.
        type            'paragraph' # sets the style type. accepts `paragraph` or `character`
        font            'Times New Roman' # sets the font family.
        color           '333333'    # sets the text color. accepts hex RGB.
        size            28          # sets the font size. units in half points.
        bold            false       # sets the font weight.
        italic          false       # sets the font style.
        underline       false       # sets whether or not to underline the text.
        caps            false       # sets whether or not text should be rendered in all capital letters.
        align           :center       # sets the alignment. accepts :left, :center, :right, and :both.
        line            360         # sets the line height. units in twips.
        top             100         # sets the spacing above the paragraph. units in twips.
        bottom          0           # sets the spacing below the paragraph. units in twips.
        indent_left     360         # sets the left indent. units in twips.
        indent_right    360         # sets the rights indent. units in twips.
        indent_first    720         # sets the first line indent. units in twips.
      end

      docx.h1 self.deal.owner_entity.name
      docx.h1 self.deal.title
      docx.h1 Time.now.strftime('%m/%d/%Y')
      docx.hr

      self.deal.roles.map(&:role_links).flatten.each do |role_link|
        docx.h1 "#{role_link.role.name}: #{role_link.deal_entity.entity.name}"
      end
      docx.hr

      docx.table build_table_data, border_size: 4 do
        cell_style rows[0], background: 'cccccc', bold: true
        cell_style cols[0], width: 4000
        cell_style cols[2], width: 1400
      end
    end
    docx_file_path
  end

  def build_table_data
    table_data = []
    header_row = [
      build_italic_gray_table_cell("Checklist Item"),
      build_italic_gray_table_cell("Document Status"),
      build_italic_gray_table_cell("Responsible Party"),
      build_italic_gray_table_cell("Signatories"),
      build_italic_gray_table_cell("Details")
    ]
    table_data << header_row
    self.descendants.as_tree.each do |tree|
      build_tree_data(tree, table_data)
    end
    table_data
  end

  def build_tree_data(tree, table_data)
    tree_element = tree.first
    ancestry_length = tree_element.ancestry.split('/').length
    if ancestry_length > 1
      # not a section
      indentation = ancestry_length - 2
      status = nil
      if tree_element.type == 'Task'
        status = tree_element&.attachment&.latest_version == nil ? 'No Doc' : 'Doc Attached'
      else
        status = tree_element&.attachment&.latest_version&.status&.capitalize
        if status
          status += " v#{tree_element&.attachment&.versions&.length}"
        else
          status = 'Not Started'
        end
      end
      responsible_party = tree_element.responsible_parties.where(is_active: 'true').first
      responsible_party_name = responsible_party&.deal_entity&.entity&.name
      details = tree_element.details
      signature_groups_names = tree_element&.signature_groups&.map(&:name).join(', ')
      table_data << [
        build_indented_table_cell("#{tree_element.get_checklist_number}. #{tree_element.name}", {indentation: indentation}),
        status,
        responsible_party_name,
        signature_groups_names,
        details
      ]
    else
      # section
      table_data << [
        build_italic_gray_table_cell("#{tree_element.get_checklist_number}. #{tree_element.name.upcase}"),
        build_italic_gray_table_cell(''),
        build_italic_gray_table_cell(''),
        build_italic_gray_table_cell(''),
        build_italic_gray_table_cell('')
      ]
    end
    children = tree.last
    children.each do |tree|
      self.build_tree_data(tree, table_data)
    end
    table_data
  end

  def build_italic_gray_table_cell(text_string)
    Caracal::Core::Models::TableCellModel.new do
      background 'cccccc'
      p text_string do
        italic true
        bold true
      end
    end
  end

  def build_indented_table_cell(text_string, options={})
    indentation = options.fetch(:indentation, 0)
    indentation_spaces = "      " * indentation
    Caracal::Core::Models::TableCellModel.new do
      p "#{indentation_spaces}#{text_string}" do
        bold true
      end
    end
  end

end
