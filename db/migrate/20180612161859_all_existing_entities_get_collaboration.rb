class AllExistingEntitiesGetCollaboration < ActiveRecord::Migration
  def change
    # note: this will give all existing entities, including entities that haven't paid for Doxly full access to Collaboration
    # this is how it currently works and product requested it stay as similar as possible
    # we will most likely want to add a third product in the future for organizations that were added but haven't purchased Doxly
    Entity.all.each do |entity|
      entity.update_attribute('product', 'collaboration')
    end
  end
end
