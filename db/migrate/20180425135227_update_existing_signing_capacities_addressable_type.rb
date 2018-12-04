class UpdateExistingSigningCapacitiesAddressableType < ActiveRecord::Migration
  def change
    # getting the tables required
    addresses_table               = Arel::Table.new(:addresses)

    # SignatureGroupUser to SigningCapacity
    addresses_to_update_sql       = addresses_table.where(addresses_table[:addressable_type].eq('SignatureGroupUser')).project(Arel.sql("*")).to_sql
    addresses_to_update           = ActiveRecord::Base.connection.execute(addresses_to_update_sql)

    # SignatureGroup to SignatureEntity
    signature_group_addresses_sql       = addresses_table.where(addresses_table[:addressable_type].eq('SignatureGroup')).project(Arel.sql("*")).to_sql
    signature_group_addresses           = ActiveRecord::Base.connection.execute(signature_group_addresses_sql)

    # pull all the entries that have Addressable type as SignatureGroupUser
    # iterate over the new variable to update each's addressable type to SigningCapacity

    addresses_to_update.each do |address|
      addresses_update_manager = Arel::UpdateManager.new addresses_table.engine
      addresses_update_manager.table addresses_table
      addresses_update_manager.set([
        [addresses_table["addressable_type"], "SigningCapacity"]
        ]).where(addresses_table["id"].eq(address["id"]))
      ActiveRecord::Base.connection.execute addresses_update_manager.to_sql
    end

    signature_group_addresses.each do |address|
      addresses_update_manager = Arel::UpdateManager.new addresses_table.engine
      addresses_update_manager.table addresses_table
      addresses_update_manager.set([
        [addresses_table["addressable_type"], "SignatureEntity"]
        ]).where(addresses_table["id"].eq(address["id"]))
      ActiveRecord::Base.connection.execute addresses_update_manager.to_sql
    end
  end
end
