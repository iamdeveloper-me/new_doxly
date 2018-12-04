class Api::V1::TreeElementsController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  api!
  def show
    check_read(get_type)
    render_success(run_object_serializer(tree_element, TreeElementSerializer))
  end

  api!
  def create
    check_create(get_type)
    tree_element.assign_attributes(tree_element_params)
    # documents default to signature required
    tree_element.signature_type = TreeElement.signature_types[:signature_required] if category.type == 'ClosingCategory' && tree_element.type == 'Document'
    # only sanitize if creating from an unplaced_attachment
    tree_element.sanitize_file_name_as_name if params[:attachment_id]
    if tree_element.save
      # if creating a tree_element from an unplaced_attachment
      if params[:attachment_id]
        attachment = deal.unplaced_attachments.find(params[:attachment_id])
        tree_element.attachment = attachment
        attachment.save
      else
        # if creating a tree_element without an already persisted attachment.
        if params[:tree_element][:file].present?
          attachment.upload(params[:tree_element][:file], current_entity_user)
          if attachment.errors.any?
            render_success(run_object_serializer(tree_element, TreeElementSerializer), [t('validation_errors.upload_file')])
          end
        end
      end
      if tree_element.type == "Document"
        current_entity.events.create(module: 'Deal', action: "DOCUMENT_CREATED", eventable: tree_element, entity_user_id: current_entity_user.id, associatable_type: 'Deal', associatable_id: deal.id)
      end
      render_success(run_object_serializer(tree_element, TreeElementSerializer))
    else
      render_validation_failed(tree_element.errors.full_messages)
    end
  end

  api!
  def create_from_upload
    check_create(:document)
    # create new tree element
    parent_tree_element = category.descendants.find(params[:parent_tree_element_id])
    if !(parent_tree_element && params[:file])
      render_failure(400, ['Unable to complete upload of one or more files'])
      return
    end
    new_tree_element = parent_tree_element.children.new(
      type: "Document",
      name: params[:file].original_filename
    )
    new_tree_element.sanitize_file_name_as_name
    new_tree_element.save

    # upload file
    if new_tree_element.persisted?
      new_tree_element.build_attachment.upload!(params[:file], current_entity_user)
      if new_tree_element.attachment.errors.empty?
        render_success(run_object_serializer(new_tree_element, TreeElementSerializer)) and return
      end
    end

    render_validation_failed(new_tree_element.errors.full_messages)
    new_tree_element.destroy
  end

  api!
  def update
    check_update(get_type)
    tree_element.assign_attributes(tree_element_params)
    # ensure that the type is correct so any lookups don't break with RecordNotFound
    updated_tree_element = tree_element.becomes(tree_element.type.constantize)
    # save the record
    if updated_tree_element.save
      render_success(run_object_serializer(updated_tree_element.reload, TreeElementSerializer))
    else
      render_validation_failed(updated_tree_element.errors.full_messages)
    end
  end

  api!
  def destroy
    check_delete(get_type)
    restrictions  = tree_element.tree_element_restrictions + tree_element.all_tree_element_restrictions
    is_restricted = restrictions.find{|restriction| restriction.restrictable == current_deal_entity_user}.present?
    render_validation_failed([t('validation_errors.cannot_delete_reserved_items')]) and return if is_restricted
    if tree_element.destroy
      render_success
    else
      render_validation_failed(tree_element.errors.full_messages)
    end
  end

  api!
  def propagate_restrictions_to_descendants
    check_update(get_type)
    tree_element.propagate_restrictions_to_descendants
    deal_entity_user = deal.deal_entity_users.find_by(entity_user_id: current_entity_user.id)
    render_success(run_tree_serializer(tree_element, deal_entity_user, tree_element.all_tree_element_restrictions))
  end

  private

  def tree_element_params
    params.require(:tree_element).permit(:name, :description, :type, :position, :signature_type, :ancestry, :details)
  end
end
