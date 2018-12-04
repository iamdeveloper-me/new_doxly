# A collection serializer that allows you to modify the collection before
# iterating through it. Used to specify eager loading on relations within the
# serializer rather than in the controller.
class RelationSerializer < ActiveModel::Serializer::CollectionSerializer
  def initialize(relation, options = {})
    if options[:serializer].respond_to?(:eager_load_relation)
      relation = options[:serializer].eager_load_relation(relation)
    end

    super(relation, options)
  end
end