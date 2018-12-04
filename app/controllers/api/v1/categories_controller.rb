class Api::V1::CategoriesController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  api!
  def show
    check_read(:deal)
    deal_entity_user = deal.deal_entity_users.find_by(entity_user_id: current_entity_user.id)
    render_success(run_tree_serializer(category, deal_entity_user, category.all_tree_element_restrictions))
  end

  api!
  def export
    check_read(:deal)
    download_file(deal.closing_category.export_to_word_doc)
  end

end
