module Controllers::ClosingBooks

  def index
    check_read(:closing_book)
    deal
    render "shared/deals/closing_books/index"
  end

  def download_closing_book
    check_read(:closing_book)
    send_attachment(closing_book.attachment, filename: closing_book.filename)
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def closing_book
    @closing_book ||= params[:id].blank? ? deal.closing_books.new : deal.closing_books.find(params[:id])
  end

end
