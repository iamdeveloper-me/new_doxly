class MigrateEventData < ActiveRecord::Migration
  def change
    Event.all.each do |event|
      event.eventable_type = "EntityUser" if event.eventable_type == "OrganizationUser"
      event.eventable_type = "DealEntityUser" if event.eventable_type == "DealOrganizationUser"
      event.associatable_type = "Entity" if event.associatable_type = "Organization"
      event.save
    end
  end
end
