ActiveModelSerializers.config.tap do |config|
  #config.adapter = :json_api
  
  config.collection_serializer = RelationSerializer
end