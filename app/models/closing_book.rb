class ClosingBook < ActiveRecord::Base
  include Models::ScheduledJobs

  STATUSES                     = ['not_started', 'in_process', 'complete']
  FORMATS                      = ['html_index', 'pdf_index', 'pdf_compilation']
  SUPPORTED_COVER_PAGE_FORMATS = ['.pdf', '.doc', '.docx']

  belongs_to :deal
  belongs_to :creator, class_name: "DealEntityUser"

  has_many :closing_book_sections, inverse_of: :closing_book, autosave: true, dependent: :destroy
  has_many :closing_book_documents, through: :closing_book_sections

  accepts_nested_attributes_for :closing_book_sections

  validates_presence_of :creator, :name, :font, :font_size
  validates_numericality_of :font_size, only_integer: true

  mount_uploader :attachment, ClosingBookUploader
  mount_uploader :cover_page, ClosingBookUploader

  default_scope { order('created_at DESC') }

  def self.folder_name(deal)
    closing_book_base = ApplicationHelper.closing_books_root
    # Ensure the directory exists
    Dir.mkdir(closing_book_base) unless Dir.exist?(closing_book_base)

    # create the folder path
    closing_book_folder = closing_book_base + "/#{deal.owner_entity.id}_#{deal.id}"
    # Ensure the directory exists
    Dir.mkdir(closing_book_folder) unless Dir.exist?(closing_book_folder)

    closing_book_folder
  end

  def in_progress?
    self.status == 'in_progress'
  end

  def complete?
    self.status == 'complete'
  end

  def filename
    closing_book_file = self.attachment.file
    return unless closing_book_file.exists?
    File.basename closing_book_file.path
  end

  def generate!(cover_page_temp_upload)
    count = self.closing_book_documents.count
    self.destroy and return if count.zero?

    self.update_attributes(status: "in_progress")

    deal_folder = ClosingBook.folder_name(deal)

    # Create a temporary folder to download each file to
    files_base =  deal_folder + '/' + ApplicationHelper.sanitize_filename("/#{self.deal.id}-#{self.deal.title}-#{self.id}")
    FileUtils.rm_r(files_base) if Dir.exist?(files_base)
    Dir.mkdir(files_base)

    error = false
    # Download each file to this folder
    self.closing_book_documents.each do |closing_book_document|
      begin
        document  = closing_book_document.document
        file_path     = "#{files_base}/#{closing_book_document.tab_number}_#{get_filename(closing_book_document)}"
        download_path = document.latest_version&.converted_path
        next unless download_path.present?

        open(file_path, 'wb') do |file|
          file << open(download_path).read
        end
        CombinePDF.load(file_path, allow_optional_content: true) # this will throw an exception if the file is corrupt, which will be caught below
      rescue StandardError => e
        # Add error to this tree element's ClosingBookDocument
        closing_book_document.create_critical_error(:closing_book_document_error, { exception: e, user_message: e.message })
        error = true
      end
    end

    # make sure the cover page is valid
    if cover_page_temp_upload&.view_path
      begin
        CombinePDF.load(cover_page_temp_upload.view_path, allow_optional_content: true) # this will throw an exception if the file is corrupt, which will be caught below
      rescue StandardError => e
        error = true
      end
    end

    # Continue on if there is no error, if there is an error at this point don't go on and update the status to failed
    if !error
      self.move_cover_page!(cover_page_temp_upload, files_base) if cover_page_temp_upload
      final_file = self.generate_closing_book! files_base, deal_folder, error

      if final_file && File.exist?(final_file)
        self.attachment.store!(open(final_file))
        self.update_attributes(status: "complete")
      else
        # Change status to failed if closing book did not generate
        self.update_attributes(status: "failed")
      end

      FileUtils.rm_rf(deal_folder)
      FileUtils.rm_rf(final_file)
    else
      self.update_attributes(status: "failed")
    end
  end

  def move_cover_page!(cover_page_temp_upload, files_base)
    FileUtils.copy_file(cover_page_temp_upload.view_path, "#{files_base}/0_cover_page.pdf") if cover_page_temp_upload.view_path
  end

  def generate_closing_book!(files_base, deal_folder, error)
    filename        = "#{self.deal.title.downcase}_closing_book_#{Time.now.strftime('%Y-%m-%d')}"
    output_filename = "#{deal_folder}/#{ApplicationHelper.sanitize_filename(filename)}"
    case self.format
    when 'html_index', 'pdf_index'
      if !error
        self.generate_index! files_base

        output_file = "#{output_filename}.zip"
        zip_file = ZipFileGenerator.new(files_base, output_file)
        output_file if zip_file.write
      end
    when 'pdf_compilation'

      # add the cover page, if it was uploaded
      cover_page_path = files_base + '/0_cover_page.pdf'
      closing_book_items = File.exist?(cover_page_path) ? "\"cover_page\" \"\" \"\" \"#{cover_page_path}\"" : ""

      # index will be generated by PDFLib

      # add each section
      self.closing_book_sections.each do |closing_book_section|
        closing_book_items += " \"section\" \"#{closing_book_section.position.to_roman}\" \"#{closing_book_section.name.gsub('"', '\"')}\" \"\""
        closing_book_section.closing_book_documents.each do |closing_book_document|
          begin
            file_path = "#{files_base}/#{closing_book_document.tab_number}_#{get_filename(closing_book_document)}"
            closing_book_items += " \"document\" \"#{closing_book_document.tab_number}\" \"#{closing_book_document.name.gsub('"', '\"')}\" \"#{file_path}\" "
          rescue StandardError => e
            closing_book_document.create_critical_error(:closing_book_document_error, { exception: e })
            error = true
          end
        end
      end

      if !error
        output_file_path = "#{output_filename}.pdf"
        str = "bin/pdflib/generate_pdf_compilation_closing_book \"#{output_file_path}\" \"#{font}\" \"#{font_size}\" #{closing_book_items}"

        # call PDFLib
        success = system str

        # return
        if success
          return output_file_path
        else
          return nil
        end
      end
    end
  end

  def generate_index!(files_base)
    case self.format
      when 'html_index'
        index = ApplicationController.new.render_to_string template: 'app/counsel/deals/closing_books/templates/index_page', locals: { closing_book_sections: self.closing_book_sections, enable_links: true, font: self.font, font_size: self.font_size }, layout: false
        file_path = files_base + "/index.html"

        open(file_path, 'wb') do |file|
          file << index
        end
      when 'pdf_index'
        pdf = WickedPdf.new.pdf_from_string(ApplicationController.new.render_to_string(template: 'app/counsel/deals/closing_books/templates/index_page', locals: { closing_book_sections: self.closing_book_sections, font: self.font, font_size: self.font_size }, layout: false), {disable_internal_links: false, disable_external_links: false})
        file_path = files_base + "/index.pdf"

        open(file_path, 'wb') do |file|
          file << pdf
        end
    end
  end

  private

  def get_filename(closing_book_document)
    sanitized_filename = ApplicationHelper.sanitize_filename(closing_book_document.name)
    "#{sanitized_filename}.pdf"
  end

  def deal_tree_element_ids
    @deal_tree_element_ids ||= self.deal.closing_category.descendants.pluck(:id)
  end
end
