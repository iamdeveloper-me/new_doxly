class Api::V1::ClosingBooksController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  GENERATE_WAIT_TIME = 2.seconds

  api!
  def index
    check_read(:closing_book)
    render_success(run_array_serializer(deal.closing_books, ClosingBookSerializer))
  end

  api!
  def update
    check_update(:closing_book)
    closing_book.assign_attributes(closing_book_params)

    # save the record
    if closing_book.save
      render_success(run_object_serializer(closing_book, ClosingBookSerializer))
    else
      render_validation_failed(closing_book.errors.full_messages)
    end
  end

  api!
  def create
    check_create(:closing_book)

    # name and form
    closing_book.assign_attributes(closing_book_params)
    closing_book.creator = deal_entity_user
    closing_book.status = "in_progress"

    # sections and documents
    closing_book.closing_book_sections = params[:closing_book_sections].map{ |closing_book_section|
      ClosingBookSection.new(
        name: closing_book_section[:name],
        section_id: closing_book_section[:section_id],
        closing_book: closing_book,
        position: closing_book_section[:position],
        closing_book_documents: (closing_book_section[:closing_book_documents] || []).map{ |closing_book_document|
          ClosingBookDocument.new(
            name: closing_book_document[:name],
            document_id: closing_book_document[:document_id],
            tab_number: closing_book_document[:tab_number],
            closing_book: closing_book
          )
        }
      )
    }

    # cover page
    temp_upload = nil
    if params[:cover_page_file]
      temp_upload = current_user.temp_uploads.find(params[:cover_page_file][:id])
      File.open(temp_upload.view_path) do |f|
        closing_book.cover_page = f
      end
    end

    # save
    if closing_book.save
      # add a delay to the execution to account for saving the job id on the closing book
      job             = closing_book.delay(run_at: (Time.now + GENERATE_WAIT_TIME), queue: 'closing_books').generate!(temp_upload)
      scheduled_job   = closing_book.build_scheduled_job(:job_id => job.id)
      scheduled_job.save
      render_success(run_object_serializer(closing_book, ClosingBookSerializer))
    else
      render_validation_failed(closing_book.errors.full_messages)
    end
  end

  api!
  def destroy
    check_delete(:closing_book)
    render_unauthorized and return unless closing_book.creator.entity == deal.owner_entity
    closing_book.destroy
    render_success
  end

  api!
  def download
    check_read(:closing_book)
    send_attachment(closing_book.attachment, filename: closing_book.filename)
  end

  private

  def closing_book
    @closing_book ||= params[:id].blank? ? deal.closing_books.new : deal.closing_books.find(params[:id])
  end

  def closing_book_params
    params.require(:closing_book).permit(:name, :description, :format, :position, :font, :font_size)
  end

end
