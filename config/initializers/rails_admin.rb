require 'bcrypt'

RailsAdmin.config do |config|

  ## == Basic HTTP Login ==
  config.authorize_with do
    authenticate_or_request_with_http_basic('Login required') do |email, password|
      admin = Admin.find_by(email: email).try(:authenticate, password)
      if admin
        admin.last_sign_in_ip = request.ip()
        admin.last_sign_in_at = DateTime.now()
        admin.save
      end
      admin
    end
  end

  # models
  config.included_models = [Entity, License]
  config.model Entity do
    list do
      field :id
      field :name
      field :is_counsel
      field :licenses
      field :logo
    end
    show do
      field :id
      field :name
      field :is_counsel
      field :licenses
      field :logo
    end
    edit do
      field :name
      field :is_counsel
      field :licenses
      field :logo
    end
  end

  config.actions do
    dashboard                     # mandatory
    index                         # mandatory
    new
    export
    bulk_delete
    show
    edit
    delete
    show_in_app
  end
end
