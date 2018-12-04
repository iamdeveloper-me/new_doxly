class ConvertSignersToSignatureGroups < ActiveRecord::Migration
  def change
    signers_table = Arel::Table.new(:signers)
    signature_envelopes_table = Arel::Table.new(:signature_envelopes)
    signers_sql = signers_table.project(Arel.sql("*")).to_sql
    signers = ActiveRecord::Base.connection.execute(signers_sql)
    signers.each do |signer|
      # find and update tree element
      tree_element = TreeElement.find(signer['tree_element_id'])
      tree_element.signature_required = true
      tree_element.save

      # find user
      deal_organization_user = DealOrganizationUser.find(signer['deal_organization_user_id'])

      # build signature group
      signature_group = deal_organization_user.deal.signature_groups.find_or_initialize_by :name => deal_organization_user.user.name
      unless signature_group.persisted?
        signature_group.deal_id = deal_organization_user.deal.id
        signature_group.save
      end
      tree_element.signature_groups << signature_group

      # build signing group user
      signature_group_user = signature_group.signature_group_users.find_or_initialize_by :user_id => deal_organization_user.user.id
      signature_group_user.save unless signature_group_user.persisted?


      # build signature page
      if tree_element.attachment
        latest_version = tree_element.attachment.versions.last
        signature_page = signature_group_user.signature_pages.create(
          unique_key: SecureRandom.uuid,
          signature_status: signer['signature_status'],
          signature_status_timestamp: signer['signature_status_timestamp'],
          file_id: latest_version.file_id,
          url: latest_version.url,
          download_url: latest_version.download_url,
          file_size: latest_version.file_size,
          file_type: latest_version.file_type
        )
      else
        signature_page = signature_group_user.signature_pages.create(
          unique_key: SecureRandom.uuid,
          signature_status: signer['signature_status'],
          signature_status_timestamp: signer['signature_status_timestamp']
        )
      end

      # build signature packet with just the one page, linked to the user
      signature_envelope_record = ActiveRecord::Base.connection.execute(signature_envelopes_table.where(signature_envelopes_table[:tree_element_id].eq(tree_element.id)).project(Arel.sql("*")).to_sql).first
      if signature_envelope_record
        signature_packet = SignaturePacket.new(
          deal_id: deal_organization_user.deal.id,
          user_id: deal_organization_user.user.id,
          sent_at: signature_envelope_record['signature_sent_at'],
          completed_at: signature_envelope_record['signature_executed_at'],
          docusign_envelope_id: signature_envelope_record['docusign_envelope_id'],
          reminder_email_timestamp: signer['reminder_email_timestamp']
        )
        signature_packet.bypass_approval_validation = true
        signature_page.signature_packet = signature_packet
        signature_packet.save
      end

      signature_page.tree_element_signature_group_id = tree_element.tree_element_signature_groups.first.id
      signature_page.save
    end

    # remove signers table
    drop_table :signers
  end
end
