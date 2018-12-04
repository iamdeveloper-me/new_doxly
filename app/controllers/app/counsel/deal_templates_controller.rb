class App::Counsel::DealTemplatesController < App::ApplicationController
  def index
    check_read(:deal_template)
    if category.is_closing? && deal.signature_packets.any?
      flash.now[:error] = "Cannot change template after signatures have been sent."
      render 'shared/blank' and return
    end
    @entity_templates = templates.where.not(entity_id: nil)
    @default_templates = templates.where(entity_id: nil)
  end

  def new
    check_create(:deal_template)
    category
    template
  end

  def create
    check_create(:deal_template)
    category

    # create new template
    template.assign_attributes(template_params)
    deal_type_template = template.deal_type_templates.new(:deal_type_id => deal.deal_type.id)

    # duplicate checklist
    if(category.is_diligence?)
      template.category = deal.diligence_category.dup_tree()
    else
      template.category = deal.closing_category.dup_tree()
    end

    # save
    if template.valid?
      if template.save
        flash.now[:success] = "Template exported successfully"
      else
        flash.now[:error] = "Unable to export template"
      end
    end
    templates
    redirect_to deal_category_path(deal, category)
  end

  def select
    check_create(:deal_template)
    templates
    category
    template
  end

  def apply
    check_update(:deal_template)

    # destroy existing checklist and duplicate template
    is_diligence_category = category.is_diligence?
    if(is_diligence_category)
      deal.diligence_category.destroy
      deal.diligence_category = template.category.dup_tree()
    else
      deal.closing_category.destroy
      deal.closing_category = template.category.dup_tree()
    end

    # save
    if deal.valid?
      if deal.save
        flash.now[:success] = "Template applied"
      else
        flash.now[:error] = "Unable to apply Template. Please try again"
      end
    end

    # update views
    deal.reload
    if(is_diligence_category)
      @category = deal.diligence_category
      @tree = deal.diligence_category.descendants.include_associations.as_tree
    else
      @category = deal.closing_category
      @tree = deal.closing_category.descendants.include_associations.as_tree
    end
    redirect_to deal_roles_path(deal)
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def category
    @category ||= deal.categories.find(params[:category_id])
  end

  def template
    @template ||= params[:id].blank? ? current_entity.templates.new : current_entity.all_templates.find(params[:id])
  end

  def templates
    @templates = category.all_templates(current_entity.id, deal.deal_type_id)
  end

  def template_params
    params.require(:template).permit(:name)
  end
end
