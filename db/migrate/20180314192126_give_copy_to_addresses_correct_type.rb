class GiveCopyToAddressesCorrectType < ActiveRecord::Migration
  def change
    signature_group_users_table             = Arel::Table.new(:signature_group_users)
    signature_group_users_sql               = signature_group_users_table.project(Arel.sql("*")).to_sql
    signature_group_users                   = ActiveRecord::Base.connection.execute(signature_group_users_sql)
    addresses_table                         = Arel::Table.new(:addresses)

    signature_groups_table                  = Arel::Table.new(:signature_groups)

    signature_group_users.each do |signature_group_user|
      signature_groups_sql = signature_groups_table.where(signature_groups_table["id"].eq(signature_group_user["signature_group_id"])).project(Arel.sql("*")).to_sql
      signature_groups_array    = ActiveRecord::Base.connection.execute(signature_groups_sql)
      signature_group = signature_groups_array.first
      next if signature_group["ancestry"].nil?
      signature_group_user_id = signature_group_user['id']
      addresses_sql           = addresses_table.where(addresses_table["addressable_id"].eq(signature_group_user_id)).where(addresses_table['addressable_type'].eq('SignatureGroupUser')).order(addresses_table["created_at"].asc).project(Arel.sql("*")).to_sql
      addresses               = ActiveRecord::Base.connection.execute(addresses_sql)
      addresses.each_with_index do |address, index|
        type = index == 0 ? 'PrimaryAddress' : 'CopyToAddress'
        addresses_update_manager = Arel::UpdateManager.new addresses_table.engine
        addresses_update_manager.table addresses_table
        addresses_update_manager.set([
          [addresses_table[:type], type],
          [addresses_table[:addressable_id], signature_group_user["signature_group_id"]],
          [addresses_table[:addressable_type], "SignatureGroup"]
        ]).where(addresses_table[:id].eq(address["id"]))
        ActiveRecord::Base.connection.execute addresses_update_manager.to_sql
      end
    end
  end
end
