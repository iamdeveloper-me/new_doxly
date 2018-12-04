class Api::V1::TreeElementRestrictionsController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  api!
  def index
    check_read(:tree_element_restriction)
    render_success(run_array_serializer(tree_element.tree_element_restrictions, TreeElementRestrictionSerializer))
  end

  api!
  def create
    check_create(:tree_element_restriction)
    if tree_element_restriction.id != nil
      render_validation_failed(["Access already restricted"])
    else
      create_or_update_tree_element_restriction
    end
  end

  api!
  def update
    check_update(:tree_element_restriction)
    create_or_update_tree_element_restriction
  end

  api!
  def destroy
    check_delete(:tree_element_restriction)
    tree_element_restriction.destroy
    render_success(run_object_serializer(tree_element_restriction, TreeElementRestrictionSerializer))
  end

  private

  def create_or_update_tree_element_restriction
    tree_element_restriction.assign_attributes(tree_element_restriction_params)
    if tree_element_restriction.save
      tree_element_restriction.propagate_restriction_to_children
      restrictions = [tree_element_restriction] + Array(tree_element_restriction.restrictable.descendant_restrictions(tree_element_restriction.tree_element))
      render_success(run_array_serializer(restrictions, TreeElementRestrictionSerializer))
    else
      render_validation_failed(tree_element_restriction.errors.full_messages)
    end
  end

  def tree_element_restriction
    if params[:id].blank?
      @tree_element_restriction ||= begin
        existing_restriction = tree_element.tree_element_restrictions.find_by(restrictable_id: tree_element_restriction_params[:restrictable_id], restrictable_type: tree_element_restriction_params[:restrictable_type])
        existing_restriction ? existing_restriction : tree_element.tree_element_restrictions.new
      end
    else
      @tree_element_restriction ||= tree_element.tree_element_restrictions.find(params[:id])
    end
  end

  def tree_element_restriction_params
    params.require(:tree_element_restriction).permit(:tree_element_id, :restrictable_id, :restrictable_type, :inherit)
  end
end
