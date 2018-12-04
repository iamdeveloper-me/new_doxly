module Controllers::Api::ChecklistHelpers
  include Controllers::Api::DealHelpers

  protected

  def category
    @category ||= deal.categories.find(params[:category_id] || params[:id])
  end

  def parent
    @parent ||= category.subtree.find_by(id: params[:parent_id])
  end

  def tree_element
    @tree_element ||= (params[:tree_element_id].blank? && params[:id].blank?) ? TreeElement.new : category.descendants.find_by(id: params[:tree_element_id] || params[:id])
  end

  def attachment
    @attachment ||= tree_element.attachment || tree_element.build_attachment
  end

  def get_type
    tree_element&.type&.downcase&.to_sym || params[:type]&.downcase&.to_sym
  end
end
