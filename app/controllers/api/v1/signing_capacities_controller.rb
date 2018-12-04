class Api::V1::SigningCapacitiesController < Api::V1::ApplicationController
  include Controllers::Api::DealHelpers
  include Controllers::OwningEntity
  include Controllers::Blocks

  api!
  def update
    check_update(:signature_management)
    render_validation_failed([t('activerecord.errors.models.signature_group.deal_closed')]) and return if deal.closed?
    render_validation_failed([t('activerecord.errors.models.signature_group.cannot_edit')]) and return if signing_capacity.block_collection.has_sent_packets? || matching_user_has_sent_packets?
    signing_capacity_params.permit!
    # clean up the params
    signing_capacity_params.each{ |key, value| value.try(:strip!) }
    is_successful = false
    ActiveRecord::Base.transaction do
      # get the real user to use
      user_to_use = set_user(user, signing_capacity_params) # defined in the blocks concern
      # Modify signature capacity user
      if user != user_to_use
        signing_capacity.user = user_to_use
        signing_capacity.save
      end
      is_successful = update_signing_capacity
      # update the voting interests
      update_voting_interests if is_successful # defined in the blocks concern
    end
    if is_successful
      render_success(run_object_serializer(signing_capacity.reload, SigningCapacitySerializer))
    else
      render_validation_failed(signing_capacity.errors.full_messages)
    end
  end

  private

  def update_signing_capacity
    # lambda that sets the signing capacity attributes
    save_signing_capacity = -> (signing_capacity_to_use) {
      keys = [:first_name, :last_name, :use_placeholder_name, :placeholder_id]
      if signing_capacity_to_use == signing_capacity && signing_capacity_to_use.placeholder_id_was == nil && signing_capacity_params[:use_placeholder_name]
        keys.pop
      end
      signing_capacity_to_use.update_attributes(signing_capacity_params.slice(*keys))
    }

    build_address(signing_capacity, signing_capacity_params[:primary_address], :primary_address)  # defined in the blocks concern
    build_address(signing_capacity, signing_capacity_params[:copy_to_address], :copy_to_address)
    is_saved    = save_signing_capacity.call(signing_capacity)
    user_to_use = signing_capacity.user
    if is_saved && user_to_use.email.present?
      # select all the other signing capacities of this user within this deal
      user_signing_capacities = deal.user_signing_capacities(user_to_use.id)
      user_signing_capacities.each do |user_signing_capacity|
        next if user_signing_capacity.id == signing_capacity.id # don't need to update the signing capacity we just updated
        save_signing_capacity.call(user_signing_capacity)
      end
    end
    # return the result
    is_saved
  end

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def signature_group
    @signature_group ||= deal.signature_groups.find(params[:signature_group_id])
  end

  def signing_capacity
    @signing_capacity ||= signature_group.signing_capacities.find(params[:id])
  end

  def user
    @user ||= signing_capacity.user
  end

  def block
    @block ||= signing_capacity.block
  end

  def signing_capacity_params
    params.require(:signing_capacity).permit(:first_name, :last_name, :use_placeholder_name, :placeholder_id, :title,
      :primary_address => [:address_line_one, :address_line_two, :city, :state_or_province, :postal_code],
      :copy_to_address => [:use_copy_to, :address_line_one, :address_line_two, :city, :state_or_province, :postal_code],
      :user => [:email]
    )
  end

  def matching_user_has_sent_packets?
    return false unless user.email.present?
    signing_capacity_name = signing_capacity.name
    user_signing_capacities = deal.user_signing_capacities(user.id)
    user_signing_capacities.find do |user_signing_capacity|
      user_signing_capacity.get_block_collection.has_sent_packets? &&
      user_signing_capacity.name != signing_capacity_name
    end.present?
  end

end
