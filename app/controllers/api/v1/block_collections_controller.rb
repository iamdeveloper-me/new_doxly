class Api::V1::BlockCollectionsController < Api::V1::ApplicationController
  include Controllers::Api::DealHelpers
  include Controllers::OwningEntity

  api!
  def create
    check_create(:signature_management)
    render_validation_failed([t('activerecord.errors.models.signature_group.deal_closed')]) and return if deal.closed?
    signature_group
    if block_collection_params[:block][:signature_entity].present?
      create_entity_block
    else
      create_individual_block
    end
  end

  api!
  def link_blocks
    check_update(:signature_management)
    render_unauthorized and return unless current_entity_user.entity == deal.owner_entity
    render_validation_failed([t('activerecord.errors.models.signature_group.deal_closed')]) and return if deal.closed?

    block_collection_ids = params[:_json]
    if block_collection_ids.any?{|block_collection_id| block_collections.find(block_collection_id).has_sent_packets?}
      render_validation_failed([t('activerecord.errors.models.signature_group.cannot_link')])
      return
    end

    # set first block collection to be the block collection that will contain all of the blocks that belong to the other block collections
    success = false
    master_block_collection = block_collections.find(block_collection_ids[0])
    ActiveRecord::Base.transaction do
      block_collection_ids.shift
      block_collection_ids.each do |block_collection_id|
        being_consolidated_block_collection = block_collections.find(block_collection_id)
        # check for matching users and add or combine signature page collection
        being_consolidated_block_collection.signature_page_collections.each do |being_consolidated_signature_page_collection|
          # Check to see if there is a signature_page_collections on the master block collection (the new big one) that share the same user and tree_element as the spc that we're checking.
          # If there is one, a "mergeable" signature_page_collection, we need to take signature_pages from the spc and put them on the new mergeable signature page collection.
          mergeable_signature_page_collection = master_block_collection.signature_page_collections.find {
            |master_signature_page_collection|
            master_tree_element = master_signature_page_collection.tree_element
            being_consolidated_tree_element = being_consolidated_signature_page_collection.tree_element
            master_user_id = master_signature_page_collection.signing_capacities.first.user_id
            being_consolidated_user_id = being_consolidated_signature_page_collection.signing_capacities.first.user.id
            same_tree_element = master_tree_element == being_consolidated_tree_element
            same_user = master_user_id == being_consolidated_user_id
            same_user && same_tree_element
          }
          if mergeable_signature_page_collection
            mergeable_signature_page_collection.signature_pages << being_consolidated_signature_page_collection.signature_pages
            being_consolidated_signature_page_collection.reload.destroy
          # if there isn't a mergeable one, we put the signature page collection itself onto the linked (big) block_collection
          else
            master_block_collection.signature_page_collections << being_consolidated_signature_page_collection
          end
        end
        master_block_collection.blocks << being_consolidated_block_collection.blocks
        success = master_block_collection.save
        being_consolidated_block_collection.reload
        being_consolidated_block_collection.destroy
      end
    end
    if success
      render_success(run_object_serializer(master_block_collection, BlockCollectionSerializer))
    else
      render_failure(master_block_collection.errors)
    end
  end

  api!
  def unlink_blocks
    check_update(:signature_management)
    render_unauthorized and return unless current_entity_user.entity == deal.owner_entity
    render_validation_failed([t('activerecord.errors.models.signature_group.deal_closed')]) and return if deal.closed?

    block = blocks.find(params[:id])
    old_block_collection = block_collections.find(params[:block_collection_id])
    if old_block_collection.has_sent_packets?
      render_validation_failed([t('activerecord.errors.models.signature_group.cannot_unlink')])
      return
    end
    signature_group = old_block_collection.signature_group
    new_block_collection = signature_group.block_collections.new
    new_block_collection.save

    block.block_collection = new_block_collection
    block.save!
    # update all the signature_page_collections' block_collection_id
    block.update_signature_page_collections_on_unlink

    render_success(run_object_serializer(new_block_collection, BlockCollectionSerializer))
  end

  api!
  def update
    check_update(:signature_management)
    render_unauthorized and return unless current_entity_user.entity == deal.owner_entity
    render_validation_failed([t('activerecord.errors.models.signature_group.deal_closed')]) and return if deal.closed?
    render_validation_failed([t('activerecord.errors.models.signature_group.cannot_consolidate')]) and return if block_collection.has_sent_packets?

    if block_collection.update(is_consolidated: block_collection_params[:is_consolidated])
      render_success(run_object_serializer(block_collection, BlockCollectionSerializer))
    else
      render_validation_failed(block_collection.errors.full_messages)
    end
  end

  def destroy
    check_delete(:signature_management)
    render_validation_failed([t('activerecord.errors.models.signature_group.deal_closed')]) and return if deal.closed?
    render_validation_failed([t('activerecord.errors.models.signature_group.cannot_delete')]) and return if block_collection.has_sent_packets?
    if block_collection.destroy
      render_success(run_array_serializer(signature_group.deal.signature_groups, SignatureGroupSerializer))
    else
      render_validation_failed(block_collection.errors.full_messages)
    end
  end

  private

  def deal
    @deal ||= current_entity_user&.all_deals&.find_by(id: params[:deal_id])
  end

  def block_collection
    @block_collection ||= params[:id].blank? ? deal.block_collections.new : deal.block_collections.find(params[:id])
  end

  def block_collections
    @block_collections ||= @deal.block_collections
  end

  def blocks
    @blocks ||= @deal.blocks
  end

  def signature_group
    @signature_group ||= deal.signature_groups.find(params[:signature_group_id])
  end

  def block_collection_params
    params.require(:block_collection)
  end

  def signature_entity_block_collection_params
    block_collection_params.permit!
    signature_entity_params   = block_collection_params[:block][:signature_entity]
    has_descendants           = signature_entity_params[:descendants].present? && signature_entity_params[:descendants].select{|signature_entity| (signature_entity[:name]&.strip).present?}.any?
    signing_capacities_params = !has_descendants ? siganture_entity_signing_capacities_params : []
    copy_to_address_params    = get_copy_to_address_params(signature_entity_params[:copy_to_address])
    voting_interest_params    = Hash[Array(block_collection_params[:block][:voting_interests]).each_with_index.map { |voting_interest, index| [index, voting_interest] }]

    {
      blocks_attributes: {
        "0"=> {
          signature_entity_attributes: {
            name: signature_entity_params[:name]&.strip,
            signing_capacities_attributes: signing_capacities_params,
            primary_address_attributes: signature_entity_params[:primary_address],
            copy_to_address_attributes: copy_to_address_params
          },
          voting_interests_attributes: voting_interest_params
        }
      }
    }
  end

  def siganture_entity_signing_capacities_params
    signature_entity_params   = block_collection_params[:block][:signature_entity]
    signing_capacities_params = signature_entity_params[:signing_capacities].map do |signing_capacity_param|
      signing_capacity_param.each{ |key, value| value.try(:strip!) }
      user_params     = signing_capacity_param[:user]
      email           = user_params[:email]&.downcase&.strip
      user            = User.find_by(email: email)
      user_attributes = if user
        user.attributes.slice('id', 'first_name', 'last_name', 'email')
      else
        {
          first_name: signing_capacity_param[:first_name],
          last_name: signing_capacity_param[:last_name],
          use_placeholder_name: signing_capacity_param[:use_placeholder_name],
          email: email
        }
      end
      {
        first_name: signing_capacity_param[:first_name],
        last_name: signing_capacity_param[:last_name],
        title: signing_capacity_param[:title],
        use_placeholder_name: signing_capacity_param[:use_placeholder_name],
        placeholder_id: signing_capacity_param[:placeholder_id],
        user_attributes: user_attributes
      }
    end
    signing_capacities_params
  end

  def individual_block_collection_params
    block_collection_params.permit!
    signing_capacity_params = block_collection_params[:block][:signing_capacity]
    signing_capacity_params.each{ |key, value| value.try(:strip!) }
    voting_interest_params  = Hash[Array(block_collection_params[:block][:voting_interests]).each_with_index.map { |voting_interest, index| [index, voting_interest] }]
    user_params             = block_collection_params[:block][:signing_capacity][:user]
    email                   = user_params[:email]&.downcase&.strip
    user                    = User.find_by(email: email)
    user_attributes = if user
      user.attributes.slice('id', 'first_name', 'last_name', 'email')
    else
      {
        first_name: signing_capacity_params[:first_name],
        last_name: signing_capacity_params[:last_name],
        use_placeholder_name: signing_capacity_params[:use_placeholder_name],
        email: email
      }
    end
    copy_to_address_params = get_copy_to_address_params(signing_capacity_params[:copy_to_address])

    {
      blocks_attributes: {
        "0" => {
          signing_capacity_attributes: {
            first_name: signing_capacity_params[:first_name],
            last_name: signing_capacity_params[:last_name],
            title: signing_capacity_params[:title],
            use_placeholder_name: signing_capacity_params[:use_placeholder_name],
            placeholder_id: signing_capacity_params[:placeholder_id],
            primary_address_attributes: signing_capacity_params[:primary_address],
            copy_to_address_attributes: copy_to_address_params,
            user_attributes: user_attributes
          },
          voting_interests_attributes: voting_interest_params
        }
      }
    }
  end

  def create_signature_entities(root_signature_entity, descendants)
    current_signature_entity = root_signature_entity

    descendants.each_with_index do |signature_entity_param, index|
      signature_entity_name  = signature_entity_param[:name]&.strip
      signature_entity_title = signature_entity_param[:title]&.strip
      next if !signature_entity_name.present?
      current_signature_entity = current_signature_entity.children.new
      current_signature_entity.assign_attributes(name: signature_entity_name)
      current_signature_entity.title = signature_entity_title if signature_entity_title.present?
      if index == descendants.length - 1
        current_signature_entity.assign_attributes(signing_capacities_attributes: siganture_entity_signing_capacities_params)
        signing_capacities = current_signature_entity.signing_capacities
        signing_capacities.each do |signing_capacity|
          user = signing_capacity.user
          user.skip_reconfirmation!
          user.skip_confirmation_notification!
        end
      end
      current_signature_entity.save
    end
    current_signature_entity
  end

  def update_existing_signers(signing_capacity)
    user_signing_capacities = deal.user_signing_capacities(signing_capacity.user_id)
    user_signing_capacities.each do |user_signing_capacity|
      next if user_signing_capacity.id == signing_capacity.id # don't need to update the signing capacity we just updated in block collection
      keys = ["first_name", "last_name", "use_placeholder_name", "placeholder_id"]
      keys << "title" if signing_capacity.signature_entity.present? && user_signing_capacity.signature_entity.present? && !user_signing_capacity.get_block_collection.has_sent_packets?
      user_signing_capacity.update_attributes(signing_capacity.attributes.slice(*keys))
    end
  end

  def get_copy_to_address_params(copy_to_address_params)
    unless copy_to_address_params["use_copy_to"]
      # make all the values empty so it'll be cleared
      copy_to_address_params.merge!(copy_to_address_params){ |key, old_value, new_value| "" }
    end
    copy_to_address_params = copy_to_address_params.except("use_copy_to")
  end

  def create_entity_block
    block_collection = signature_group.block_collections.new(signature_entity_block_collection_params)
    descendants      = block_collection_params[:block][:signature_entity][:descendants]
    unless descendants.present?
      signing_capacities = block_collection.blocks.first.signature_entity.signing_capacities
      signing_capacities.each do |signing_capacity|
        user = signing_capacity.user
        user.skip_reconfirmation!
        user.skip_confirmation_notification!
      end
    end
    if block_collection.save
      if descendants.present? && descendants.find{ |signature_entity| (signature_entity[:name]&.strip).present? }.present?
        last_entity = create_signature_entities(block_collection.blocks.first.signature_entity, descendants)
        signing_capacities = last_entity.signing_capacities
      else
        signing_capacities = block_collection.blocks.first.signature_entity.signing_capacities
      end

      signing_capacities.flatten.each do |signing_capacity|
        update_existing_signers(signing_capacity) if signing_capacity.user.email.present?
      end
      render_success(run_object_serializer(block_collection, BlockCollectionSerializer))
    else
      render_validation_failed(block_collection.errors.full_messages)
    end
  end

  def create_individual_block
    block_collection = signature_group.block_collections.new(individual_block_collection_params)
    user             = block_collection.blocks.first.signing_capacity.user
    user.skip_reconfirmation!
    user.skip_confirmation_notification!
    if block_collection.save
      signing_capacity = block_collection.signing_capacities.first # this is an individual create
      update_existing_signers(signing_capacity) if signing_capacity.user.email.present?
      render_success(run_object_serializer(block_collection.reload, BlockCollectionSerializer))
    else
      render_validation_failed(block_collection.errors.full_messages)
    end
  end

end
