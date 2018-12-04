class App::Client::ClosingBooksController < App::ApplicationController
  layout "deals"
  include Controllers::ClosingBooks
end
