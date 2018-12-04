module Controllers::EntitySettings
  extend ActiveSupport::Concern
  include Controllers::Addressable

  included do
    def self.controller_path
      "app/shared/entity_settings"
    end
  end

  def entity_profile
    check_update(:entity)
    entity_address
    render 'app/shared/entity_settings/entity_profile'
  end

  def entity_profile_save
    check_update(:entity)
    current_entity.name = params[:organization][:name]
    entity_address.assign_attributes(primary_address_params)
    if current_entity.save
      flash[:success] = "The entity profile has been saved successfully"
      redirect_to entity_profile_path and return
    end
    respond_to_turboboost('app/shared/entity_settings/entity_profile_form', '#entity_profile_form', {:entity_address => entity_address})
  end

  private

  def entity_address
    @entity_address ||= (current_entity.primary_address || current_entity.build_primary_address)
  end

end
