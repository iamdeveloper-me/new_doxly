class App::Counsel::ClosingBooksController < App::ApplicationController
  include Controllers::ClosingBooks
  layout "deals"

  GENERATE_WAIT_TIME = 2.seconds

  def self.controller_path
    "app/counsel/deals/closing_books"
  end

  def new
    check_create(:closing_book)
    @closing_book = deal.closing_books.new
    File.delete(image_path) if File.exist?(image_path)
  end

  def create
    check_create(:closing_book)
    closing_book.attributes = closing_book_params
    closing_book.status     = 'not_started'
    cover_page              = document_path
    if closing_book.save
      # add a delay to the execution to account for saving the job id on the closing book
      job             = closing_book.delay(run_at: (Time.now + GENERATE_WAIT_TIME), queue: 'closing_books').generate! cover_page
      scheduled_job   = closing_book.build_scheduled_job(:job_id => job.id)
      scheduled_job.save
      flash[:success] = "The closing book has been created successfully"
      redirect_to deal_closing_books_path(deal)
    end
  end

  def destroy
    check_delete(:closing_book)
    closing_book.destroy
    flash[:success] = "The closing book has been deleted successfully"
    redirect_to deal_closing_books_path(deal)
  end

  def directory_path
    @directory_path ||= ClosingBook.folder_name(deal)
  end

  def image_path
    @image_path ||= directory_path + "/cover_page.jpg"
  end

  def document_path(file_extension='.pdf')
    directory_path + "/cover_page#{file_extension}"
  end

  def upload_cover_page
    check_create(:closing_book)
    closing_book
  end

  def uploaded_cover_page
    check_create(:closing_book)
    uploaded_file = params[:closing_book][:file]
    file_extension = File.extname(uploaded_file.original_filename.downcase) if uploaded_file.present?
    if uploaded_file.present? && ClosingBook::SUPPORTED_COVER_PAGE_FORMATS.include?(file_extension)
      save_cover_page_locally(file_extension, uploaded_file)
      if !File.exist?(document_path)
        closing_book.errors.add(:base, :cover_page_could_not_be_converted)
        render :upload_cover_page and return
      end
    else
      closing_book.errors.add(:base, :cover_page_upload_must_be_correct_extension)
      render :upload_cover_page and return
    end
    @uploaded_cover_page = File.exist?(image_path)
    render 'update_cover_page_view'
  end

  def save_cover_page_locally(file_extension, uploaded_file)
    # write the uploaded file to a local path
    File.open(document_path(file_extension), "wb") { |f| f.write(uploaded_file.read) } # download the file
    if file_extension != '.pdf'
      begin
        FileConvert.process_file_conversion(document_path(file_extension), document_path)
      ensure
        # delete the old .doc or .docx file
        File.delete(document_path(file_extension)) if File.exist?(document_path(file_extension))
      end
    end

    # save as image
    if File.exist?(document_path)
      ApplicationHelper.im_image_from_path(document_path) do |image|
        image.write(image_path)
      end
    end
  end

  def show_cover_page
    check_create(:closing_book)
    send_data(open(image_path){|f| f.read }, disposition: 'inline', type: 'image/jpeg')
  end

  def remove_cover_page
    check_create(:closing_book)
    closing_book
    File.delete(image_path) if File.exist?(image_path)
    render 'update_cover_page_view'
  end

  def view_cover_page
    check_create(:closing_book)
    closing_book
  end

  private

  def closing_book_params
    params.require(:closing_book).permit(:format, :logo, :logo_cache, :cover_text, :closing_book_sections_attributes => [:tree_element_id, :name, :position, :closing_book_documents_attributes => [:tree_element_id, :name, :tab_number]])
  end

end
