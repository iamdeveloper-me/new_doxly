class Category < TreeElement

  def is_diligence?
    type == "DiligenceCategory"
  end

  def is_closing?
    type == "ClosingCategory"
  end

  def all_templates(entity_id, deal_type_id)
    Template.where("entity_id = ? OR entity_id IS ?", entity_id, nil)
      .joins(:deal_type_templates).where("deal_type_templates.deal_type_id = ?", deal_type_id)
      .joins(:category).where("tree_elements.type = ? ", self.type)
  end

  def all_versions
    descendants.joins(:attachment).where.not(type: "Section").map{|tree_element| tree_element.attachment.versions}.flatten
  end

end
