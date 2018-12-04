class App::Counsel::TreeElementSignatureGroupsController < App::ApplicationController
  include Controllers::OwningEntity
  include Controllers::SignatureChecks

  def new
    check_create(:signature_management)
    tree_element
    @signature_groups = deal.signature_groups
  end

  def create
    check_create(:signature_management)
    unless tree_element.signature_groups.include?(signature_group)
      tree_element_signature_group = tree_element.tree_element_signature_groups.find_or_create_by(signature_group_id: signature_group.id)
      tree_element_signature_group.create_signature_pages
      flash.now[:success] = "Signature group successfully assigned"
      render 'update'
    else
      flash.now[:error] = "Signature group has already been added"
    end
  end

  def edit
    check_update(:signature_management)
    if tree_element_signature_group.signature_pages_sent?
      flash.now[:error] = "Since these pages have been previously sent to this Signature Group the alias cannot be changed"
      render 'shared/blank' and return
    end
    tree_element_signature_group
  end

  def update
    check_read(:signature_management)
    tree_element_signature_group
    if tree_element_signature_group.signature_pages_sent?
      flash.now[:error] = "Since these pages have been previously sent to this Signature Group the alias cannot be changed"
      render 'shared/blank' and return
    else
      tree_element_signature_group.assign_attributes(tree_element_signature_group_params)
      tree_element_signature_group.alias = nil if tree_element_signature_group.alias.blank?
      @signature_group = deal.signature_groups.find(tree_element_signature_group.signature_group_id)
      if tree_element_signature_group.save
        flash.now[:success] = "Signature group alias successfully updated"
      end
    end
  end

  def destroy
    check_delete(:signature_management)
    if tree_element_signature_group.signature_pages_sent?
      flash.now[:error] = "Cannot remove groups with signature pages already sent for signing"
      render 'shared/blank' and return
    else
      tree_element_signature_group.destroy
      flash.now[:success] = "Signature group successfully removed"
      render 'update'
    end
  end

  def set_show_group_name
    check_update(:signature_management)
    if tree_element_signature_group.signature_pages_sent?
      flash.now[:error] = "Since these pages have been previously sent to this Signature Group the alias cannot be changed"
      render 'shared/blank' and return
    else
      tree_element_signature_group.show_group_name = params[:checked] == "true"
      tree_element_signature_group.save
      @signature_group = deal.signature_groups.find(tree_element_signature_group.signature_group_id)
      render 'update'
    end
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find(params[:deal_id])
  end

  def category
    @category ||= deal.categories.find(params[:category_id])
  end

  def tree_element
    @tree_element ||= category.descendants.find(params[:tree_element_id])
  end

  def signature_group
    @signature_group ||= deal.signature_groups.find(params[:signature_group_id])
  end

  def tree_element_signature_group
    @tree_element_signature_group ||= tree_element.tree_element_signature_groups.find(params[:id])
  end

  def tree_element_signature_group_params
    params.require(:tree_element_signature_group).permit(:alias)
  end
end
