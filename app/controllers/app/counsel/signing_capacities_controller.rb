class App::Counsel::SigningCapacitiesController < App::ApplicationController
  include Controllers::OwningEntity
  include Controllers::SignatureChecks

  def include
    check_update(:signature_management)
    # figure out if they can be included and what to include
    tree_element_signature_group = signature_group.tree_element_signature_groups
                                    .find_by(tree_element_id: params[:tree_element_id])
    signing_capacity_tree_element_signature_pages = signing_capacity.unscoped_tree_element_signature_pages(params[:tree_element_id])

    # include
    # assuming every signature page is the same - they are all copies of the same page
    signing_capacity_tree_element_signature_pages.each do |signature_page|
      signature_page.is_enabled = true
      signature_page.save
    end

    @tree_element = tree_element_signature_group.tree_element
    render 'counsel/signature_pages/update_signing_capacity'
  end

  def exclude
    check_update(:signature_management)
    # figure out if they can be excluded and what to exclude
    tree_element_signature_group = signature_group.tree_element_signature_groups
                                    .find_by(tree_element_id: params[:tree_element_id])
    signing_capacity_tree_element_signature_pages = signing_capacity.unscoped_tree_element_signature_pages(params[:tree_element_id])

    # exclude or send error message
    # assuming every signature page is the same - they are all copies of the same page
    signing_capacity_tree_element_signature_pages.each do |signature_page|
      signature_page.is_enabled = false
      signature_page.save
      if signature_page.errors[:is_enabled].any?
        flash.now[:error] = signature_page.errors[:is_enabled].first
        break
      end
    end

    @tree_element = tree_element_signature_group.tree_element
    render 'counsel/signature_pages/update_signing_capacity'
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def signature_group
    @signature_group ||= deal.signature_groups.find(params[:signature_group_id])
  end

  def signing_capacity
    @signing_capacity ||= signature_group.signing_capacities.find(params[:id])
  end
end
