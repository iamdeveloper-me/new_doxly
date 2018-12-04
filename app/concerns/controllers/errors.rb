module Controllers::Errors
  def render_unauthorized(message=nil)
    respond_with_error :unauthorized, 403, message
  end

  def render_not_found
    respond_with_error :not_found, 404
  end

  # This is directly called from the routes file when there is route error.
  # That request never reaches the app to go thorugh the
  # application_controller callback and execption catching
  def route_not_found
    report_to_rollbar("#{request.method}:#{request.original_url} - Unknown/Unauthenticated route accessed") if Rails.env.production?
    flash[:error] = t('errors.404_main') if current_user.present?
    respond_to do |format|
      format.html { redirect_to '/' }
      format.js   { render :js => "App.Helpers.navigateTo('/', true);" }
    end
  end

  def render_bad_request(message='bad request')
    respond_with_error message, 400
  end

  def render_internal_server_error
    @help_email = Doxly.config.support_email
    respond_with_error :internal_server_error, 500
  end

  def report_to_rollbar(e)
    Rollbar.report_exception(e, request_info, current_user) if Rails.env.production?
  end

  protected

  def respond_with_error(notice, code, message=nil)
    respond_to do |format|
      format.html { render '/errors/' + notice.to_s, :locals => { message: message } , :status => code, :layout => false }
      format.js   { render :js => "App.FlashMessages.addMessage('error', '#{I18n.t("errors.#{code}_main")}');", :status => code }
      format.any  { head notice }
    end
  rescue StandardError => e
    report_to_rollbar(e) if Rails.env.production?
    Rails.logger.error "Error rendering error page, %s" % e.message
    Rails.logger.error e.backtrace.join("\n")
    head notice
  end

  private

  def request_info
    # only select string values to prevent rollbar from erroring
    request.env.select{ |k, v| v.is_a? String }
  end
end
