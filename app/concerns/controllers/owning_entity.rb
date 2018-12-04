module Controllers::OwningEntity
  extend ActiveSupport::Concern
  included do
    before_action :check_owning_entity, :except => :index
  end

  def check_owning_entity
    render_unauthorized and return unless deal.is_owning_entity?(current_entity)
  end
end
