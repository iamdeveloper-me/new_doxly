class TreeElementSerializer < ApplicationSerializer

  class << self
    def restrictable_attributes(*args)
      args.each do |arg|
        attribute(arg, unless: :is_restricted)
      end
    end
  end

  # attributes that both counsel and other parties should be able to see, but might be subject to restrictions
  restrictable_attributes :description, :signature_type, :is_post_closing, :created_at, :updated_at, :sign_manually, :signature_type

  attributes :id, :name, :is_restricted, :position, :children, :ancestry, :type, :number_of_signature_page_copies, :details, :owner

  has_many :notes
  has_many :completion_statuses
  has_one  :attachment
  has_many :responsible_parties
  has_many :tree_element_restrictions

  def self.eager_load_relation(relation)
    relation.includes(:notes, :completion_statuses, :attachment, :responsible_parties, :tree_element_restrictions)
  end

  def initialize(object, options)
    @is_restricted = begin
      deal_entity_user_id           = options[:scope][:current_deal_entity_user_id]
      deal_entity_user_class        = options[:scope][:current_deal_entity_user_class]
      all_tree_element_restrictions = options[:scope][:all_tree_element_restrictions] || object.tree_element_restrictions
      # ruby is better than doing another SQL here
      all_tree_element_restrictions.select do |tree_element_restriction|
        tree_element_restriction.tree_element_id == object.id &&
        tree_element_restriction.restrictable_id == deal_entity_user_id &&
        tree_element_restriction.restrictable_type == deal_entity_user_class
      end.size > 0
    end
    super(object, options)
  end

  def children
    scope.to_h[:children].present? ? scope.to_h[:children] : object.children
  end

  def name
    is_restricted ? 'Reserved' : object.name
  end

  def details
    is_restricted ? '' : object.details
  end

  def notes
    return [] if is_restricted
    object.notes
  end

  def attachment
    if is_restricted
      if object.attachment
        return { id: object.attachment.id }
      else
        return nil
      end
    end
    return object.attachment
  end

  def completion_statuses
    return [] if is_restricted && scope[:category].is_a?(ClosingCategory)
    if scope[:category].is_a?(DiligenceCategory)
      object.completion_statuses.joins(deal_entity: :entity).where("entities.id = ?", scope[:current_entity].id)
    else
      object.completion_statuses
    end
  end

  def responsible_parties
    if is_restricted || scope[:category].is_a?(DiligenceCategory)
      []
    else
      object.responsible_parties
    end
  end

  def tree_element_restrictions
    return [] if is_restricted
    if object.deal.owner_entity.id == scope[:current_entity].id
      object.tree_element_restrictions
    else
      []
    end
  end

  def is_restricted
    @is_restricted
  end

end
