namespace :deals do

  # Task to clone a deal. This currently clones the following:
  # -> Deal details (does not copy the matter number and the deal email)
  # -> WGL: Roles and Entities (creates the passed in entity_user_id as the owner of the deal)
  # -> Diligence and Closing Checklists
  # -> Attachments and Versions
  # -> ToDos
  # -> Responsible parties
  # -> Notes
  # -> Completion statuses
  # -> Signature groups and signature group users
  # -> Tree element signature groups
  # -> Signature pages
  task :clone, [:deal_id, :entity_user_id, :new_title] => :environment do |t, args|
    deal_id                             = args[:deal_id]
    to_entity_user_id                   = args[:entity_user_id]
    new_title                           = (args[:new_title] || "").strip

    deal                                = Deal.find(deal_id)
    to_entity_user                      = EntityUser.find(to_entity_user_id)
    to_entity                           = to_entity_user.entity

    puts "COPYING '#{deal.title}' FROM '#{deal.owner_entity.name}' TO '#{to_entity.name}'"

    # To keep track of the old and new id's
    @role_mappings                      = []
    @tree_element_mappings              = []
    @deal_entity_mappings               = []
    @deal_entity_user_mappings          = []
    @entity_user_mappings               = []

    # DEAL DETAILS
    new_deal                            = deal.dup
    new_deal.title                      = if new_title.present?
                                            new_title
                                          elsif deal.owner_entity.id == to_entity.id
                                            "#{deal.title} - Clone"
                                          else
                                            "#{deal.title} - #{to_entity.name}"
                                          end
    new_deal.client_matter_number       = nil
    new_deal.deal_email                 = nil
    new_deal.bypass_create_categories   = true
    new_deal.save!
    new_deal.reload

    # ROLES
    deal.roles.each do |role|
      new_role = new_deal.roles.new
      new_role.name = role.name
      new_role.save!
      @role_mappings.push({:old_id => role.id, :new_id => new_role.id})
    end

    # NEW OWNER OF THE DEAL
    # Make the new entity user and their entity the owners of the new deal
    new_owning_deal_entity            = new_deal.deal_entities.new
    new_owning_deal_entity.entity_id  = to_entity_user.entity_id
    new_owning_deal_entity.is_owner   = true
    new_owning_deal_entity.save!
    new_owning_deal_entity.reload

    new_owning_deal_entity_user                = new_owning_deal_entity.deal_entity_users.new
    new_owning_deal_entity_user.entity_user_id = to_entity_user.id
    new_owning_deal_entity_user.is_owner       = true
    new_owning_deal_entity_user.role           = 'owning_counsel'
    new_owning_deal_entity_user.save!

    # add the new deal owners to the same role as the current deal owner
    deal.deal_entities.where(:is_owner => true).each do |owning_deal_entity|
      owning_deal_entity.role_links.each do |role_link|
        new_role_link         = new_owning_deal_entity.role_links.new
        mapping               = @role_mappings.find{ |mapping| mapping[:old_id] == role_link.role_id }
        new_role_link.role_id = mapping[:new_id]
        new_role_link.save!
      end
    end

    # DEAL ENTITIES and DEAL ENTITY USERS
    deal.deal_entities.each do |deal_entity|
      entity_id    = deal_entity.entity_id
      # don't create the entity if the deals is being closed to the same entity
      if to_entity.id == entity_id
        # store the mapping to be used with todos, RP, etc.
        @deal_entity_mappings.push({:old_id => deal_entity.id, :new_id => new_owning_deal_entity.id})
        new_deal_entity = new_owning_deal_entity
      else
        # Check to see if the entity to be cloned is already connected or not and make the connection
        is_connected = to_entity.entity_connections.where(:connected_entity_id => entity_id).any?
        unless is_connected
          connection = to_entity.entity_connections.new
          connection.connected_entity_id = entity_id
          connection.save!
          other_connection = deal_entity.entity.entity_connections.new
          other_connection.connected_entity_id = to_entity.id
          other_connection.save!
        end

        # Save the new deal entity
        new_deal_entity            = new_deal.deal_entities.new
        new_deal_entity.entity_id  = entity_id
        new_deal_entity.is_owner   = false
        new_deal_entity.save!
        new_deal_entity.reload

        # store the mapping to be used with todos, RP, etc.
        @deal_entity_mappings.push({:old_id => deal_entity.id, :new_id => new_deal_entity.id})

        deal_entity.role_links.each do |role_link|
          new_role_link         = new_deal_entity.role_links.new
          mapping               = @role_mappings.find{ |mapping| mapping[:old_id] == role_link.role_id }
          new_role_link.role_id = mapping[:new_id]
          new_role_link.save!
        end
      end

      # Save the deal entity users
      deal_entity.deal_entity_users.each do |deal_entity_user|
        # don't create the entity user if the deal is being closed to an existing entity user
        if deal_entity_user.entity_user_id == to_entity_user.id
          # store the mappings to be used with todos, RP, notes, etc.
          @deal_entity_user_mappings.push({:old_id => deal_entity_user.id, :new_id => new_owning_deal_entity_user.id})
          @entity_user_mappings.push({:old_id => deal_entity_user.entity_user_id, :new_id => to_entity_user.id})
        else
          new_deal_entity_user                 = new_deal_entity.deal_entity_users.new
          new_deal_entity_user.entity_user_id  = deal_entity_user.entity_user_id
          new_deal_entity_user.is_owner        = false
          new_deal_entity_user.role            = deal_entity_user.role
          new_deal_entity_user.save!
          new_deal_entity_user.reload

          # store the mappings to be used with todos, RP, notes, etc.
          @deal_entity_user_mappings.push({:old_id => deal_entity_user.id, :new_id => new_deal_entity_user.id})
          @entity_user_mappings.push({:old_id => deal_entity_user.entity_user_id, :new_id => new_deal_entity_user.entity_user_id})
        end
      end
    end

    # DILIGENCE AND CLOSING CHECKLISTS
    new_deal.diligence_category = clone_deal_clone_tree_element(deal.diligence_category.subtree.as_tree.first)
    new_deal.closing_category   = clone_deal_clone_tree_element(deal.closing_category.subtree.as_tree.first)
    new_deal.reload

    # RESPONSIBLE PARTIES, ATTACHMENTS AND VERSIONS
    [deal.diligence_category, deal.closing_category].each do |category|
      category.descendants.each do |tree_element|
        tree_element_mapping = @tree_element_mappings.find{ |mapping| mapping[:old_id] == tree_element.id }

        # RESPONSIBLE PARTIES
        tree_element.responsible_parties.each do |responsible_party|
          new_responsible_party                     = responsible_party.dup
          new_responsible_party.tree_element_id     = tree_element_mapping[:new_id]
          deal_entity_mapping                       = @deal_entity_mappings.find{ |mapping| mapping[:old_id] == responsible_party.deal_entity_id }
          new_responsible_party.deal_entity_id      = deal_entity_mapping[:new_id]
          deal_entity_user_mapping                  = @deal_entity_user_mappings.find{ |mapping| mapping[:old_id] == responsible_party.deal_entity_user_id }
          if deal_entity_user_mapping
            new_responsible_party.deal_entity_user_id = deal_entity_user_mapping[:new_id]
          end
          new_responsible_party.save!
        end

        # COMPLETION STATUSES
        tree_element.completion_statuses.each do |completion_status|
          new_completion_status                     = completion_status.dup
          new_completion_status.tree_element_id     = tree_element_mapping[:new_id]
          if tree_element.root.is_a?(ClosingCategory)
            new_completion_status.deal_entity_id      = new_owning_deal_entity.id
          else
            deal_entity_mapping                       = @deal_entity_mappings.find{ |mapping| mapping[:old_id] == completion_status.deal_entity_id }
            new_completion_status.deal_entity_id      = deal_entity_mapping[:new_id]
          end
          new_completion_status.save!
        end

        if tree_element.attachment.present?
          new_attachment                 = tree_element.attachment.dup
          new_attachment.attachable_id   = tree_element_mapping[:new_id]
          new_attachment.attachable_type = "TreeElement"
          tree_element.attachment.versions.where.not(:status => 'executed').order('id asc').each do |version|
            # Upload the original file. The conversion jobs will take care of the rest
            original_file = File.open(version.version_storageable.original_path)
            uploader      = version.uploader
            mapping       = @entity_user_mappings.find{ |mapping| mapping[:old_id] == uploader.id }
            begin
              new_attachment.upload!(original_file, EntityUser.find(mapping[:new_id]), { filename: version.file_name, status: version.status })
            ensure
              original_file.close
            end
          end
        end
      end
    end

    # SIGNATURE GROUPS, SIGNATURE ENTITIES AND SIGNATURE PAGES
    deal.signature_groups.each do |signature_group|
      clone_deal_clone_signature_group(signature_group, new_deal.id)
    end

    new_deal.signature_groups.each do |new_signature_group|
      new_signature_group.tree_element_signature_groups.each do |new_tree_element_signature_group|
        new_tree_element_signature_group.create_signature_pages
      end
    end
  end

  # CATEGORY CLONING
  def clone_deal_clone_tree_element(tree = nil, ancestry = nil)
    # duplicate this tree_element
    tree_element                = tree.first
    new_tree_element            = tree_element.dup
    new_tree_element.owner_id   = nil
    new_tree_element.owner_type = nil
    new_tree_element.ancestry   = ancestry
    new_tree_element.save!

    # store the mapping to be used with signature groups
    @tree_element_mappings.push({:old_id => tree_element.id, :new_id => new_tree_element.id})

    # TO-DOs
    tree_element.to_dos.each do |to_do|
      new_to_do                      = to_do.dup
      new_to_do.tree_element_id      = new_tree_element.id
      deal_entity_mapping            = @deal_entity_mappings.find{ |mapping| mapping[:old_id] == to_do.deal_entity_id }
      creator_mapping                = @deal_entity_user_mappings.find{ |mapping| mapping[:old_id] == to_do.creator_id }
      new_to_do.deal_entity_id       = deal_entity_mapping[:new_id]
      new_to_do.creator_id           = creator_mapping[:new_id]
      deal_entity_user_mapping       = @deal_entity_user_mappings.find{ |mapping| mapping[:old_id] == to_do.deal_entity_user_id }
      if deal_entity_user_mapping
        new_to_do.deal_entity_user_id = deal_entity_user_mapping[:new_id]
      end
      new_to_do.save!
    end

    # NOTES
    tree_element.notes.each do |note|
      new_note                = note.dup
      noteable_id             = note.noteable.id
      new_note.noteable_id    = new_tree_element.id
      new_note.noteable_type  = "TreeElement"
      entity_user_mapping     = @entity_user_mappings.find{ |mapping| mapping[:old_id] == note.entity_user_id }
      new_note.entity_user_id = entity_user_mapping[:new_id]
      new_note.save!
    end

    # duplicate each child with the correct ancestry
    ancestry = ancestry ? "#{ancestry}/#{new_tree_element.id}" : "#{new_tree_element.id}"
    children = tree.last
    children.each do |tree|
      clone_deal_clone_tree_element(tree, ancestry)
    end
    new_tree_element
  rescue StandardError => e
    Rails.logger.error("Unable to save categories: #{e}")
  end

  # SIGNATURE GROUP/ENTITY CLONING
  def clone_deal_clone_signature_group(signature_group, new_deal_id, ancestry = nil)
    ActiveRecord::Base.transaction do
      # duplicate this signature_group
      new_signature_group            = signature_group.dup
      new_signature_group.created_at = nil
      new_signature_group.updated_at = nil
      new_signature_group.deal_id    = new_deal_id
      new_signature_group.save!

      signature_group.block_collections.each do |block_collection|
        new_block_collection                    = block_collection.dup
        new_block_collection.signature_group_id = new_signature_group.id
        new_block_collection.save!

        block_collection.blocks.each do |block|
          new_block = block.dup
          new_block.block_collection_id = new_block_collection.id
          if block.signature_entity
            last_signature_entity      = clone_deal_clone_signature_entity(block.signature_entity.subtree.as_tree.first)
            new_signature_entity       = last_signature_entity.root
            new_signature_entity.block = new_block
          elsif block.signing_capacity
            new_signing_capacity                     = block.signing_capacity.dup
            new_signing_capacity.block               = new_block
            new_signing_capacity.bypass_create_pages = true
          end
          new_block.save!
          (new_signature_entity || new_signing_capacity).save!
          
          # SAVE THE ADDRESSES FOR THE CREATED BLOCK OBJECTS
          object       = block.signature_entity || block.signing_capacity
          saved_object = new_signature_entity || new_signing_capacity
          if object.primary_address
            new_address             = object.primary_address.dup
            new_address.addressable = saved_object
            new_address.save!
          end

          if object.copy_to_address
            new_address             = object.copy_to_address.dup
            new_address.addressable = saved_object
            new_address.save!
          end
        end
      end

      # TREE ELEMENT SIGNATURE GROUPS
      signature_group.tree_element_signature_groups.each do |tree_element_signature_group|
        new_tree_element_signature_group                    = tree_element_signature_group.dup
        mapping                                             = @tree_element_mappings.find{ |mapping| mapping[:old_id] == tree_element_signature_group.tree_element_id }
        new_tree_element_signature_group.signature_group_id = new_signature_group.id
        new_tree_element_signature_group.tree_element_id    = mapping[:new_id]
        new_tree_element_signature_group.save!
      end
    end
  rescue StandardError => e
    Rails.logger.error("Unable to save signature groups: #{e}")
  end

  def clone_deal_clone_signature_entity(tree, ancestry=nil)
    ActiveRecord::Base.transaction do
      signature_entity                = tree.first
      new_signature_entity            = signature_entity.dup
      new_signature_entity.created_at = nil
      new_signature_entity.updated_at = nil
      new_signature_entity.ancestry   = ancestry
      new_signature_entity.save!

      signature_entity.signing_capacities.each do |signing_capacity|
        new_signing_capacity                     = signing_capacity.dup
        new_signing_capacity.signature_entity_id = new_signature_entity.id
        new_signing_capacity.bypass_create_pages = true
        new_signing_capacity.save!
      end

      # duplicate each child with the correct ancestry
      ancestry = ancestry ? "#{ancestry}/#{new_signature_entity.id}" : "#{new_signature_entity.id}"
      children = tree.last
      children.each do |tree|
        clone_deal_clone_signature_entity(tree, ancestry)
      end
      new_signature_entity
    end
  rescue StandardError => e
    Rails.logger.error("Unable to save signature entities: #{e}")
  end

end
