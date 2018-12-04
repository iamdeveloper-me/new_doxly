class Api::V1::SignatureEntitiesController < Api::V1::ApplicationController
  include Controllers::Api::DealHelpers
  include Controllers::OwningEntity
  include Controllers::Blocks

  api!
  def update
    check_update(:signature_management)
    render_validation_failed([t('activerecord.errors.models.signature_group.deal_closed')]) and return if deal.closed?
    render_validation_failed([t('activerecord.errors.models.signature_group.cannot_edit')]) and return if signature_entity.block_collection.has_sent_packets? || matching_users_have_sent_packets?
    is_successful = false
    last_signature_entity = nil
    ActiveRecord::Base.transaction do
      signature_entity_params.permit!
      # re-create the signature_entities from scratch
      last_signature_entity = create_signature_entities
      # update all the signing capacities
      is_successful = update_signing_capacities(last_signature_entity)
      # update the voting interests
      update_voting_interests if is_successful # defined in the blocks concern
    end
    if is_successful
      render_success(run_signature_entity_serializer(last_signature_entity.root))
    else
      render_validation_failed(last_signature_entity.errors.full_messages)
    end
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def signature_group
    @signature_group ||= deal.signature_groups.find(params[:signature_group_id])
  end

  def signature_entity
    @signature_entity ||= signature_group.all_signature_entities.find{ |signature_entity| signature_entity.id == params[:id].to_i }
  end

  def block
    @block ||= signature_entity.block
  end

  def signature_entity_params
    # need to coerece nil to empty array for descendants
    params[:signature_entity][:descendants] = [] if params[:signature_entity][:descendants].nil?
    params.require(:signature_entity).permit(:id, :name,
      :descendants => [:name, :title],
      :signing_capacities => [:id, :first_name, :last_name, :use_placeholder_name, :title, :placeholder_id, :destroy, :user => [:email]],
      :primary_address => [:id, :addressable_id, :addressable_type, :address_line_one, :address_line_two, :city, :state_or_province, :postal_code],
      :copy_to_address => [:id, :addressable_id, :addressable_type, :use_copy_to, :address_line_one, :address_line_two, :city, :state_or_province, :postal_code]
    )
  end

  def create_signature_entities
    # lambda to move all the capacities to the new entity
    move_signing_capacities = -> (signature_entity_to_use) {
      # on update, we re-create the signature_entities and now we need to take the last one in the ancestry chain and give it all of the signing_capacities
      signature_entity.all_signing_capacities.each { |signing_capacity| signing_capacity.update(signature_entity_id: signature_entity_to_use.id) }
      # now destroy the old signature_entity. This automagically destroys all of it's children nodes all the way down too.
      # need to reload to avoid destroying the signing_capacities.
      signature_entity.reload.destroy
    }

    # recreate the main entity
    signature_entity_to_use = SignatureEntity.new(:block_id => block.id) # cannot use block.build_signature_entity as this will destroy the old entity on save
    signature_entity_to_use.assign_attributes(name: signature_entity_params[:name]&.strip)
    # update the address information
    build_address(signature_entity_to_use, signature_entity_params[:primary_address], :primary_address)  # defined in the blocks concern
    build_address(signature_entity_to_use, signature_entity_params[:copy_to_address], :copy_to_address)
    # this will also destroy the old signature_entity and all the associations
    signature_entity_to_use.save
    signature_entity_to_use.reload

    # recreate the descendants
    signature_entity_params[:descendants].each do |signature_entity_param|
      signature_entity_name  = signature_entity_param[:name]&.strip
      signature_entity_title = signature_entity_param[:title]&.strip
      next unless signature_entity_name.present?
      signature_entity_to_use = signature_entity_to_use.children.new
      signature_entity_to_use.assign_attributes(name: signature_entity_name)
      signature_entity_to_use.title = signature_entity_title if signature_entity_title.present?
      signature_entity_to_use.save
    end

    move_signing_capacities.call(signature_entity_to_use)

    return signature_entity_to_use
  end

  def update_signing_capacities(last_signature_entity)
    # lamda to update the existing signers using the same email
    update_existing_signers = -> (signing_capacities) {
      signing_capacities.each do |signing_capacity|
        user = signing_capacity.user
        next unless user.email.present?
        user_signing_capacities = deal.user_signing_capacities(user.id)
        user_signing_capacities.each do |user_signing_capacity|
          keys = ["first_name", "last_name", "use_placeholder_name", "placeholder_id"]
          keys << "title" if user_signing_capacity.signature_entity.present? && !user_signing_capacity.get_block_collection.has_sent_packets? # if this capacity already has a send packet, the title cannot be changed
          user_signing_capacity.update_attributes(signing_capacity.attributes.slice(*keys))
        end
      end
    }

    entity_signing_capacities       = last_signature_entity.signing_capacities
    entity_signing_capacities_array = entity_signing_capacities.to_a
    signature_entity_params[:signing_capacities].each do |signing_capacity_params|
      # have to use the array find here to ensure we are editing the same object eliminating the need to 'save' here
      signing_capacity_to_use = entity_signing_capacities_array.find{ |signing_capacity| signing_capacity.id == signing_capacity_params[:id].to_i }
      # clean up the params
      signing_capacity_params.each{ |key, value| value.try(:strip!) }
      # update existing capacity or create a new one
      if signing_capacity_to_use
        if signing_capacity_params[:destroy] == true
          signing_capacity_to_use.mark_for_destruction
        else
          keys = [:first_name, :last_name, :title, :use_placeholder_name, :placeholder_id]
          if signing_capacity_to_use.placeholder_id_was == nil && signing_capacity_params[:use_placeholder_name]
            keys.pop
          end
          signing_capacity_to_use.attributes = signing_capacity_params.slice(*keys)
          user                               = signing_capacity_to_use.user
          # have to call valid in order to trigger set_placeholder_name in signing capacity model so that save for the signing_capacities is called on last_signature_entity.save
          # the change to the attr_accessor use_placeholder_name doesn't trigger save
          signing_capacity_to_use.valid?
        end

      else
        signing_capacity_to_use = entity_signing_capacities.new(signing_capacity_params.slice(:first_name, :last_name, :title, :use_placeholder_name, :placeholder_id))
        user                    = signing_capacity_to_use.build_user(signing_capacity_params.slice(:first_name, :last_name))
      end
      # update the associated user
      unless signing_capacity_to_use.marked_for_destruction?
        user_to_use                  = set_user(user, signing_capacity_params)
        signing_capacity_to_use.user = user_to_use if user != user_to_use
      end
    end
    is_saved = last_signature_entity.save
    update_existing_signers.call(last_signature_entity.reload.signing_capacities) if is_saved
    is_saved
  end

  def run_signature_entity_serializer(object)
    object.subtree.arrange_serializable do |parent, children|
      ActiveModelSerializers::SerializableResource.new(
        parent,
        {
          include: (params[:expand] || ''),
          scope: {
            children: children
          }
        }
      )
    end
  end

  def matching_users_have_sent_packets?
    signature_entity.signing_capacities.find do |signing_capacity|
      user = signing_capacity.user
      next unless user.email.present?
      signing_capacity_name = signing_capacity.name
      user_signing_capacities = deal.user_signing_capacities(user.id)
      user_signing_capacities.find do |user_signing_capacity|
        user_signing_capacity.get_block_collection.has_sent_packets? &&
        user_signing_capacity.name != signing_capacity_name
      end.present?
    end.present?
  end
end
