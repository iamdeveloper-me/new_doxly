class App::Counsel::SignatureGroupsController < App::ApplicationController
  include Controllers::OwningEntity
  include Controllers::SignatureChecks
  include Controllers::SignatureGroups

  def import_from_working_group
    check_create(:signature_management)
    forbid_if_deals_closed("Cannot add to a signature group after deal has been closed"){return}
    signature_group
    @role_deal_entity_users = []
    deal.roles.order('name').each do |role|
      role.deal_entity_users.each do |deal_entity_user|
        @role_deal_entity_users.push(
          {
            object: deal_entity_user,
            entity: deal_entity_user.entity.name,
            role: role.name,
            already_added: signature_group.all_signing_capacities.find{ |signing_capacity| signing_capacity.user_id == deal_entity_user.entity_user.user_id }.present?,
            temporary_uuid: SecureRandom.uuid
          }
        )
      end
    end
  end

  def imported_from_working_group
    update_existing_signers = -> (signing_capacity) {
      user_signing_capacities = deal.user_signing_capacities(signing_capacity.user_id)
      user_signing_capacities.each do |user_signing_capacity|
        next if user_signing_capacity.id == signing_capacity.id # don't need to update the signing capacity we just updated in block collection
        keys = ["first_name", "last_name", "use_placeholder_name"]
        keys << "title" if signing_capacity.signature_entity.present? && user_signing_capacity.signature_entity.present?
        user_signing_capacity.update_attributes(signing_capacity.attributes.slice(*keys))
      end
    }

    check_create(:signature_management)
    forbid_if_deals_closed("Cannot add to a signature group after deal has been closed"){return}
    signature_group
    deal_entity_user = deal.deal_entity_users.find_by(id: params[:deal_entity_user_id])
    if deal_entity_user && signature_group
      if (params[:individual] == "true" && 
          signature_group.all_signing_capacities.find{ |signing_capacity| signing_capacity.user_id == deal_entity_user.entity_user.user_id }.present?)
        flash.now[:error] = "Can't create duplicate signer"
        render 'shared/blank' and return
      end
      if params[:individual] == "true"
        attributes = ({
          blocks_attributes: {
            "0" => {
              position: 1,
              signing_capacity_attributes: {
                first_name: deal_entity_user.user.first_name,
                last_name: deal_entity_user.user.last_name,
                user_id: deal_entity_user.user.id
              }
            }
          }
        })
        block_collection = signature_group.block_collections.create!(attributes)
        signing_capacity = block_collection.signing_capacities.first
        update_existing_signers.call(signing_capacity) if signing_capacity.user.email.present?
      else
        address_to_import = deal_entity_user.entity.primary_address
        attributes = ({
          blocks_attributes: {
            "0" => {
              position: 1,
              signature_entity_attributes: {
                name: deal_entity_user.entity.name,
                signing_capacities_attributes: {
                  "0" => {
                    first_name: deal_entity_user.user.first_name,
                    last_name: deal_entity_user.user.last_name,
                    user_id: deal_entity_user.user.id,
                    title: deal_entity_user.entity_user.title
                  }
                },
                primary_address_attributes: {
                  address_line_one: address_to_import&.address_line_one,
                  address_line_two: address_to_import&.address_line_two,
                  city: address_to_import&.city,
                  state_or_province: address_to_import&.state_or_province,
                  postal_code: address_to_import&.postal_code
                }
              }
            }
          }
        })
        block_collection   = signature_group.block_collections.create!(attributes)
        signing_capacities = block_collection.blocks.first.signature_entity.signing_capacities
        signing_capacities.flatten.each do |signing_capacity|
          update_existing_signers.call(signing_capacity) if signing_capacity.user.email.present?
        end
      end

    end
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def signature_group
    @signature_group ||= params[:id] || params[:signature_group_id] ? deal.signature_groups.find(params[:id] || params[:signature_group_id]) : deal.signature_groups.new
  end
end
