class Api::V1::ResponsiblePartiesController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  api!
  def create
    check_create(:responsible_party)
    create_or_update_responsible_party
  end

  api!
  def update
    check_update(:responsible_party)
    create_or_update_responsible_party
  end

  api!
  def destroy
    check_delete(:responsible_party)
    if responsible_party.destroy
      render_success(run_array_serializer(tree_element.responsible_parties, ResponsiblePartySerializer))
      if tree_element.responsible_parties.length > 0
        tree_element.responsible_parties[0].is_active = true
        tree_element.responsible_parties[0].save
      end
    else
      render_validation_failed(responsible_party.errors.full_messages)
    end
  end

  private

  def create_or_update_responsible_party
    responsible_party.assign_attributes(responsible_party_params)
    if responsible_party.save
      render_success(run_object_serializer(responsible_party, ResponsiblePartySerializer))
    else
      render_validation_failed(responsible_party.errors.full_messages)
    end
  end

  def responsible_party_params
    params.require(:responsible_party).permit(:deal_entity_user_id, :deal_entity_id, :is_active)
  end

  def responsible_party
    @responsible_party ||= params[:id].blank? && params[:responsible_party_id].blank? ? tree_element.responsible_parties.new : tree_element.responsible_parties.find(params[:id] || params[:responsible_party_id])
  end

  def other_responsible_party
    @other_responsible_party ||= tree_element.responsible_parties.where.not(id: params[:id]).first
  end
end
