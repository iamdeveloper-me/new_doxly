class ConvertOldChecklistToNewChecklist < ActiveRecord::Migration
  def change

    ActiveRecord::Base.record_timestamps = false
    begin

    # get tables
    categories_table = Arel::Table.new(:categories)
    sections_table = Arel::Table.new(:sections)
    tasks_table = Arel::Table.new(:tasks)
    folders_table = Arel::Table.new(:folders)
    deal_documents_table = Arel::Table.new(:deal_documents)
    documents_table = Arel::Table.new(:documents)
    versions_table = Arel::Table.new(:deal_document_versions)
    tree_elements_table = Arel::Table.new(:tree_elements)
    esignature_notifications_table = Arel::Table.new(:esignature_notifications)
    deal_document_signers_table = Arel::Table.new(:deal_document_signers)
    comments_table = Arel::Table.new(:comments)

    category_ids = {}
    section_ids = {}
    task_ids = {}
    folder_ids = {}
    document_ids = {}
    version_ids = {}

    # categories
    i = 1
    categories_sql = categories_table.project(Arel.sql("*")).order(categories_table[:id].asc).to_sql
    categories = ActiveRecord::Base.connection.execute(categories_sql)
    categories.each do |category|
      # provide user with status
      if i % 10 == 0 || i == categories.count
        print " #{i} / #{categories.count} categories migrated\r"; $stdout.flush
      end
      i += 1

      # create a tree_element for each section
      if category["type"] == "DiligenceCategory"
        tree_element = DiligenceCategory.new(
          owner_id: category["parent_id"],
          owner_type: category["parent_type"],
          created_at: category["created_at"],
          updated_at: category["updated_at"]
        )
        tree_element.save
      elsif category["type"] == "ClosingCategory"
        tree_element = ClosingCategory.new(
          owner_id: category["parent_id"],
          owner_type: category["parent_type"],
          created_at: category["created_at"],
          updated_at: category["updated_at"]
        )
        tree_element.save
      end

      category_ids[category["id"].to_i] = tree_element.id
    end
    puts ""

    # sections
    i = 1
    sections_sql = sections_table.project(Arel.sql("*")).order(sections_table[:id].asc).to_sql
    sections = ActiveRecord::Base.connection.execute(sections_sql)
    sections.each do |section|
      # provide user with status
      if i % 10 == 0 || i == sections.count
        print " #{i} / #{sections.count} sections migrated\t\r"; $stdout.flush
      end
      i += 1

      # create a tree_element for each section
      tree_element = Section.new(
        name: section["name"],
        type: "Section",
        parent_id: category_ids[section["category_id"].to_i],
        created_at: section["created_at"],
        updated_at: section["updated_at"],
        is_post_closing: section["is_post_closing"]
      )
      tree_element.save

      section_ids[section["id"].to_i] = tree_element.id
    end
    puts ""

    # tasks
    i = 1
    tasks_sql = tasks_table.project(Arel.sql("*")).order(tasks_table[:id].asc).to_sql
    tasks = ActiveRecord::Base.connection.execute(tasks_sql)
    tasks.each do |task|
      # provide user with status
      if i % 10 == 0 || i == tasks.count
        print " #{i} / #{tasks.count} tasks migrated\t\r"; $stdout.flush
      end
      i += 1

      # create a tree_element for each task
      tree_element = Task.new(
        name: task["title"],
        description: task["description"],
        type: "Task",
        parent_id: section_ids[task["section_id"].to_i],
        created_at: task["created_at"],
        updated_at: task["updated_at"],
        is_post_closing: false
      )
      tree_element.save

      task_ids[task["id"].to_i] = tree_element.id

      if !task["deal_document_id"].blank?
        # add the attachment

        # get the deal documents, document, and deal_document_versions
        deal_documents_sql = deal_documents_table.where(deal_documents_table["id"].eq(task["deal_document_id"])).project(Arel.sql('*')).order(deal_documents_table[:id].asc).to_sql
        deal_documents = ActiveRecord::Base.connection.execute(deal_documents_sql)
        deal_document = nil
        deal_documents.each do |dd|
          deal_document = dd
        end

        tree_element.signature_type = deal_document["signature_type"]
        tree_element.save

        if deal_document["signature_envelope_id"]
          signature_envelope = SignatureEnvelope.new(
            tree_element_id: tree_element.id,
            signature_sent_at: deal_document["signature_sent_at"],
            signature_executed_at: deal_document["signature_executed_at"],
            signature_status: deal_document["signature_status"],
            docusign_envelope_id: deal_document["signature_envelope_id"],
            created_at: deal_document["created_at"],
            updated_at: deal_document["updated_at"]
          )
          signature_envelope.save
        end

        documents_sql = documents_table.where(documents_table["id"].eq(deal_document["document_id"])).project(Arel.sql('*')).order(documents_table[:id].asc).to_sql
        documents = ActiveRecord::Base.connection.execute(documents_sql)
        document = nil
        documents.each do |d|
          document = d
        end

        # build the new document
        attachment = Attachment.new(
          tree_element_id: tree_element.id,
          created_at: deal_document["created_at"],
          updated_at: deal_document["updated_at"]
        )
        attachment.save

        document_ids[task["deal_document_id"].to_i] = tree_element.id

        # build the new versions
        versions_sql = versions_table.where(versions_table["deal_document_id"].eq(deal_document["id"])).project(Arel.sql('*')).order(versions_table[:created_at].asc).to_sql
        versions = ActiveRecord::Base.connection.execute(versions_sql)
        versions.each do |version|
          document_version = Version.new(
            attachment_id: attachment.id,
            file_id: version["box_file_id"],
            url: version["url"],
            download_url: version["download_url"],
            is_executed: version["is_final"],
            is_executed_at: version["is_final_at"],
            file_size: document["file_size"],
            file_type: document["file_type"],
            organization_user_id: document["organization_user_id"],
            created_at: version["created_at"],
            updated_at: version["updated_at"]
          )
          document_version.save
          version_ids[version["id"].to_i] = document_version.id
        end
      end
    end
    puts ""

    # folders
    i = 1
    folders_sql = folders_table.project(Arel.sql("*")).order(folders_table[:id].asc).to_sql
    folders = ActiveRecord::Base.connection.execute(folders_sql)
    folders.each do |folder|
      # provide user with status
      if i % 10 == 0 || i == folders.count
        print " #{i} / #{folders.count} folders migrated\r"; $stdout.flush
      end
      i += 1

      # create a tree_element for each folder
      tree_element = Folder.new(
        name: folder["name"],
        type: "Folder",
        parent_id: task_ids[folder["task_id"].to_i],
        created_at: folder["created_at"],
        updated_at: folder["updated_at"],
        is_post_closing: false
      )
      tree_element.save

      folder_ids[folder["id"].to_i] = tree_element.id
    end
    puts ""

    # documents
    i = 1
    deal_documents_sql = deal_documents_table.project(Arel.sql("*")).order(deal_documents_table[:id].asc).to_sql
    deal_documents = ActiveRecord::Base.connection.execute(deal_documents_sql)
    deal_documents.each do |deal_document|
      # provide user with status
      if i % 10 == 0 || i == deal_documents.count
        print " #{i} / #{deal_documents.count} deal documents migrated\r"; $stdout.flush
      end
      i += 1

      # create a tree_element for each deal document, if one has not already been created
      if document_ids[deal_document["id"].to_i] == nil
        case deal_document["documentable_type"]
        when "Task"
          parent_id = task_ids[deal_document["documentable_id"].to_i]
        when "Folder"
          parent_id = folder_ids[deal_document["documentable_id"].to_i]
        else
          raise "Invalid parent type"
        end

        deal_documents_sql = deal_documents_table.where(deal_documents_table["id"].eq(deal_document["id"])).project(Arel.sql('*')).order(deal_documents_table[:id].asc).to_sql
        deal_documents = ActiveRecord::Base.connection.execute(deal_documents_sql)
        deal_document_object = nil
        deal_documents.each do |dd|
          deal_document_object = dd
        end
        documents_sql = documents_table.where(documents_table["id"].eq(deal_document["document_id"])).project(Arel.sql('*')).order(documents_table[:id].asc).to_sql
        documents = ActiveRecord::Base.connection.execute(documents_sql)
        document = nil
        documents.each do |d|
          document = d
        end

        tree_element = Document.new(
          name: document["title"],
          type: "Document",
          parent_id: parent_id,
          signature_type: deal_document["signature_type"],
          created_at: deal_document["created_at"],
          updated_at: deal_document["updated_at"],
          is_post_closing: false
        )
        tree_element.save

        if deal_document["signature_envelope_id"]
          signature_envelope = SignatureEnvelope.new(
            tree_element_id: tree_element.id,
            signature_sent_at: deal_document["signature_sent_at"],
            signature_executed_at: deal_document["signature_executed_at"],
            signature_status: deal_document["signature_status"],
            docusign_envelope_id: deal_document["signature_envelope_id"],
            created_at: deal_document["created_at"],
            updated_at: deal_document["updated_at"]
          )
          signature_envelope.save
        end

        # build the new document
        attachment = Attachment.new(
          tree_element_id: tree_element.id,
          created_at: deal_document["created_at"],
          updated_at: deal_document["updated_at"]
        )
        attachment.save

        document_ids[deal_document["id"].to_i] = tree_element.id

        # build the new versions
        versions_sql = versions_table.where(versions_table["deal_document_id"].eq(deal_document["id"])).project(Arel.sql('*')).order(versions_table[:created_at].asc).to_sql
        versions = ActiveRecord::Base.connection.execute(versions_sql)
        versions.each do |version|
          document_version = Version.new(
            attachment_id: attachment.id,
            file_id: version["box_file_id"],
            url: version["url"],
            download_url: version["download_url"],
            is_executed: version["is_final"],
            is_executed_at: version["is_final_at"],
            file_size: document["file_size"],
            file_type: document["file_type"],
            organization_user_id: document["organization_user_id"],
            created_at: version["created_at"],
            updated_at: version["updated_at"]
          )
          document_version.save
          version_ids[version["id"].to_i] = document_version.id
        end

      end

    end
    puts ""

    # assignment status
    i = 1
    assignment_statuses = AssignmentStatus.all
    assignment_statuses.each do |status|
      # provide user with status
      if i % 10 == 0 || i == assignment_statuses.count
        print " #{i} / #{assignment_statuses.count} assignment statuses migrated\r"; $stdout.flush
      end
      i += 1

      case status.assignable_type
      when "Task"
        status.assignable_id = task_ids[status.assignable_id]
      when "Folder"
        status.assignable_id = folder_ids[status.assignable_id]
      when "DealDocument"
        status.assignable_id = document_ids[status.assignable_id]
      else
        next
      end
      status.assignable_type = "TreeElement"
      status.save
    end
    puts ""

    # due dates
    i = 1
    due_dates = DueDate.all
    due_dates.each do |due_date|
      # provide user with status
      if i % 10 == 0 || i == due_dates.count
        print " #{i} / #{due_dates.count} due dates migrated\r"; $stdout.flush
      end
      i += 1

      case due_date.due_dateable_type
      when "Task"
        due_date.due_dateable_id = task_ids[due_date.due_dateable_id]
      when "Folder"
        due_date.due_dateable_id = folder_ids[due_date.due_dateable_id]
      when "DealDocument"
        due_date.due_dateable_id = document_ids[due_date.due_dateable_id]
      else
        next
      end
      due_date.due_dateable_type = "TreeElement"
      due_date.save
    end
    puts ""

    # comments
    i = 1
    comments_sql = comments_table.project(Arel.sql("*")).to_sql
    comments = ActiveRecord::Base.connection.execute(comments_sql)
    comments.each do |comment|
      # provide user with status
      if i % 10 == 0 || i == comments.count
        print " #{i} / #{comments.count} comments migrated\r"; $stdout.flush
      end
      i += 1

      new_id = nil
      case comment["commentable_type"]
      when "Task"
        new_id = task_ids[comment["commentable_id"].to_i]
      when "Folder"
        new_id = folder_ids[comment["commentable_id"].to_i]
      when "DealDocument"
        new_id = document_ids[comment["commentable_id"].to_i]
      else
        next
      end

      # save
      update_manager = Arel::UpdateManager.new comments_table.engine
      update_manager.table comments_table
      update_manager.set([
        [comments_table[:commentable_type], "TreeElement"],
        [comments_table[:commentable_id], new_id.to_i]
      ]).where(comments_table[:id].eq(comment[:id]))

      # save the change
      ActiveRecord::Base.connection.execute update_manager.to_sql
    end
    puts ""

    # events
    i = 1
    events = Event.all
    events.each do |event|
      # provide user with status
      if i % 10 == 0 || i == events.count
        print " #{i} / #{events.count} events migrated\r"; $stdout.flush
      end
      i += 1

      case event.eventable_type
      when "Task"
        event.eventable_id = task_ids[event.eventable_id]
      when "Folder"
        event.eventable_id = folder_ids[event.eventable_id]
      when "DealDocument"
        event.eventable_id = document_ids[event.eventable_id]
      when "DealDocumentVersion"
        event.eventable_id = version_ids[event.eventable_id]
        event.eventable_type = "Version"
        event.save
        next
      else
        next
      end
      event.eventable_type = "TreeElement"
      event.save
    end
    puts ""

    # esignature notifications
    i = 1
    esignature_notifications_sql = esignature_notifications_table.project(Arel.sql("*")).to_sql
    esignature_notifications = ActiveRecord::Base.connection.execute(esignature_notifications_sql)
    esignature_notifications.each do |esignature_notification|
      # provide user with status
      if i % 10 == 0 || i == esignature_notifications.count
        print " #{i} / #{esignature_notifications.count} esignature notifications migrated\r"; $stdout.flush
      end
      i += 1

      # set the tree_element_id on the esignature_notification
      update_manager = Arel::UpdateManager.new esignature_notifications_table.engine
      update_manager.table esignature_notifications_table
      update_manager.set([
        [esignature_notifications_table[:tree_element_id], document_ids[esignature_notification['tree_element_id'].to_i]]
      ]).where(esignature_notifications_table[:id].eq(esignature_notification[:id]))

      # save the change
      ActiveRecord::Base.connection.execute update_manager.to_sql

    end
    puts ""

    # deal document signers
    i = 1
    deal_document_signers_sql = deal_document_signers_table.project(Arel.sql("*")).to_sql
    deal_document_signers = ActiveRecord::Base.connection.execute(deal_document_signers_sql)
    deal_document_signers.each do |deal_document_signer|
      # provide user with status
      if i % 10 == 0 || i == deal_document_signers.count
        print " #{i} / #{deal_document_signers.count} deal document signers migrated\r"; $stdout.flush
      end
      i += 1

      signer = Signer.new(
        tree_element_id: document_ids[deal_document_signer['deal_document_id'].to_i],
        deal_organization_user_id: deal_document_signer["deal_organization_user_id"],
        signature_completed_at: deal_document_signer["signature_completed_at"],
        signature_recipient_id: deal_document_signer["signature_recipient_id"],
        signature_status: deal_document_signer["signature_status"],
        signature_status_timestamp: deal_document_signer["signature_status_timestamp"],
        reminder_email_timestamp: deal_document_signer["reminder_email_timestamp"],
        created_at: deal_document_signer["created_at"],
        updated_at: deal_document_signer["updated_at"]
      )
      signer.save

    end
    puts ""

    drop_table :categories, force: :cascade
    drop_table :deal_document_signers, force: :cascade
    drop_table :deal_document_versions, force: :cascade
    drop_table :deal_documents, force: :cascade
    drop_table :documents, force: :cascade
    drop_table :folders, force: :cascade
    drop_table :sections, force: :cascade
    drop_table :tasks, force: :cascade
    add_foreign_key "esignature_notifications", "tree_elements", column: "tree_element_id"

    ensure
      ActiveRecord::Base.record_timestamps = true
    end
  end
end
