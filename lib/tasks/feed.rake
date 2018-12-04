require "csv"

namespace :feed do
  task :export_deals, [:weekly_report] => :environment do |t, args|

    get_file_path = ->(file_name) { "#{Doxly.config.temp_dir}/#{file_name}" }

    weekly_report         = args[:weekly_report]
    feeds_email_recipient = Doxly.config.feeds_email
    feeds_email_cc        = Doxly.config.admin_email
    user_feed_filepath    = get_file_path.call("counsel_user_feed.csv")
    deal_feed_filepath    = get_file_path.call("deal_feed.csv")
    start_date            = nil
    end_date              = nil

    if weekly_report == "yes"
      user_feed_filepath = get_file_path.call("counsel_user_feed_past7days.csv")
      deal_feed_filepath = get_file_path.call("deal_feed_past7days.csv")
      current_date       = DateTime.now.utc
      # report for the past week
      start_date         = current_date.beginning_of_day - 7
      end_date           = current_date.end_of_day - 1
    end

    CSV.open(user_feed_filepath, "wb") do |csv|
      csv << ["Name", "Email", "Organization Name", "Role", "Date Created", "Latest Login", "Last Login", "Login Count"]
      conditions = if weekly_report == "yes"
        "entities.is_counsel = 't' AND users.current_sign_in_at >= '#{start_date}' AND users.current_sign_in_at <= '#{end_date}'"
      else
        "entities.is_counsel = 't'"
      end
      EntityUser.joins(:entity, :user).where(conditions).order("entity_users.entity_id, users.last_name, users.first_name").all.each do |entity_user|
        user = entity_user.user
        csv << [user.name, user.email, entity_user.entity.name, entity_user.role, user.created_at&.strftime('%m/%d/%Y %I:%M %p'), user.current_sign_in_at&.strftime('%m/%d/%Y %I:%M %p'), user.last_sign_in_at&.strftime('%m/%d/%Y %I:%M %p'), user.sign_in_count]
      end
    end

    CSV.open(deal_feed_filepath, "wb") do |csv|
      csv << [
        "Deal Name",
        "Transaction Type",
        "Client Matter Number",
        "Law Firm",
        "Created By",
        "Date Created",
        "Status",
        "Deal Size",
        "Number of Unplaced and Closing Docs",
        "Number of Docs Requiring Signature",
        "Number of Signers",
        "Number of Pages Not Sent",
        "Number of Pages Awaiting Signature",
        "Number of Pages Signed",
        "Number of ToDo's",
        "Time Spent Creating Blocks",
        "Total Time It Took To Generate Signature Pages",
        "Average time between creating signature pages and sending",
        "Average time for signature page to be signed",
        "Average time to generate closing book",
        "Duration of signature process"
      ]
      deals = Deal.joins(deal_entities: :entity)
      if weekly_report == "yes"
        deals = deals.where("deals.created_at >= '#{start_date}' AND deals.created_at <= '#{end_date}'")
      end
      deals.order("deals.created_at").all.to_a.uniq.each do |deal|
        deal_entity                        = deal.deal_entities.select{ |de| de.is_owner == true }.first
        deal_entity_user                   = deal_entity.deal_entity_users.where(is_owner: true).first
        deal_type                          = DealType.where(:id => deal.deal_type_id)
        closing_descendants                = deal.closing_category.descendants
        documents_count                    = deal.unplaced_attachments.size + deal.closing_category.descendants.with_attachment.size
        req_documents_count                = closing_descendants.signature_required.size
        signers_count                      = deal.signature_groups.map(&:signing_capacities).flatten.uniq.size
        pages_not_sent_for_signature_count = closing_descendants.map(&:signature_pages).flatten.uniq.select{ |sp| SignaturePage::NOT_SENT_SIGNATURE_STATUSES.include?(sp.signature_status) }.size
        pages_sent_for_signature_count     = closing_descendants.map(&:signature_pages).flatten.uniq.select{ |sp| SignaturePage::READY_SIGNATURE_STATUSES.include?(sp.signature_status) }.size
        pages_signed_count                 = closing_descendants.map(&:signature_pages).flatten.uniq.select{ |sp| SignaturePage::SIGNED_SIGNATURE_STATUSES.include?(sp.signature_status) }.size
        to_dos_count                       = closing_descendants.map(&:to_dos).flatten.uniq.size

        csv << [
          deal.title,
          deal_type.first.name,
          deal.client_matter_number,
          deal_entity.entity.name,
          deal_entity_user.name,
          deal.created_at&.strftime('%m/%d/%Y %I:%M %p'),
          deal.status,
          sprintf('%.2f', deal.deal_size),
          documents_count,
          req_documents_count,
          signers_count,
          pages_not_sent_for_signature_count,
          pages_sent_for_signature_count,
          pages_signed_count,
          to_dos_count,
          time_spent_creating_blocks(deal),
          total_time_spent_to_generate_pages(deal),
          average_time_between_creating_signature_pages_and_sending(deal),
          average_time_for_signature_page_to_be_signed(deal),
          average_time_to_generate_closing_books(deal),
          total_signature_process_time(deal)
         ]
      end
    end

    # send the email
    if File.exist?(user_feed_filepath) && File.exist?(deal_feed_filepath)
      mail_options = {
        :start_date => start_date,
        :end_date => end_date,
        :recipient => feeds_email_recipient,
        :cc => feeds_email_cc
      }
      SupportMailer.send_weekly_feeds([user_feed_filepath, deal_feed_filepath], mail_options).deliver_now
      # delete the feed files
      File.delete(user_feed_filepath)
      File.delete(deal_feed_filepath)
    end
  end

  def time_spent_creating_blocks(deal)
    signing_capacities = deal.signature_groups.map{ |sg| sg.all_signing_capacities }.flatten
    first_signing_capacity = signing_capacities.sort_by{ |sgu| sgu.created_at }.first
    first_signature_page = signing_capacities.map { |sgu| sgu.signature_pages }.flatten.sort_by{ |sp| sp.created_at }.first
    return "N/A" if first_signature_page.nil? || first_signing_capacity.nil?
    format_time_for_reading(first_signature_page.created_at - first_signing_capacity.created_at)
  end

  def total_time_spent_to_generate_pages(deal)
    tree_element_signature_groups = deal.signature_groups.map{ |sg| sg.tree_element_signature_groups }.flatten
    return "N/A" if tree_element_signature_groups.empty?
    total_seconds = 0
    tree_element_signature_groups.each do |tree_element_signature_group|
      # get all the signature_pages for signing_capacities who were NOT added after the tree_element_signature_group_was_created
      created_now_signature_pages = tree_element_signature_group.signature_pages.select { |signature_page| signature_page.signing_capacity.created_at < tree_element_signature_group.created_at }
      next if created_now_signature_pages.empty?
      last_signature_page = created_now_signature_pages.sort_by{ |sp| sp.created_at }.last
      total_seconds += (last_signature_page.created_at - tree_element_signature_group.created_at)
    end
    signing_capacities = deal.signature_groups.map{ |sg| sg.all_signing_capacities }.flatten
    signing_capacities.each do |signing_capacity|
      # get all the signature_pages for signing_capacities who were added after the tree_element_signature_group_was_created
      created_later_signature_pages = signing_capacity.signature_pages.select{ |sp| sp.tree_element_signature_group.created_at < signing_capacity.created_at }
      next if created_later_signature_pages.empty?
      total_seconds += (created_later_signature_pages.sort_by{ |sp| sp.created_at }.last.created_at - signing_capacity.created_at)
    end
    format_time_for_reading(total_seconds)
  end

  def average_time_between_creating_signature_pages_and_sending(deal)
    time_between = []
    deal.signature_pages.map{ |sp| time_between << sp.signature_packet.created_at.to_i - sp.created_at.to_i }
    return "N/A" if time_between.empty?
    format_time_for_reading(average(time_between))
  end

  def average_time_for_signature_page_to_be_signed(deal)
    time_between = []
    deal.signature_pages.select{ |sp| sp.signature_status == 'signed' }.map{ |sp| time_between << sp.signature_status_timestamp.to_i - sp.signature_packet.created_at.to_i }
    return "N/A" if time_between.empty?
    format_time_for_reading(average(time_between))
  end

  def average_time_to_generate_closing_books(deal)
    times_for_generation = []
    deal.closing_books.where(status: 'complete').map{ |closing_book| times_for_generation << (closing_book.updated_at - closing_book.created_at)}
    return "N/A" if times_for_generation.empty?
    format_time_for_reading(average(times_for_generation))
  end

  def total_signature_process_time(deal)
    signing_capacities = deal.signature_groups.map{ |sg| sg.all_signing_capacities }.flatten
    first_signing_capacity = signing_capacities.sort_by{ |sgu| sgu.created_at }.first
    signature_page_executions = signing_capacities.map{ |sgu| sgu.signature_pages }.flatten.map{ |signature_page| signature_page.signature_page_executions }.flatten
    last_signature_page_execution = signature_page_executions.sort_by{ |spe| spe.created_at }.last
    return "N/A" if first_signing_capacity.nil? || last_signature_page_execution.nil?
    format_time_for_reading(last_signature_page_execution.created_at - first_signing_capacity.created_at)
  end

  def format_time_for_reading(seconds)
    seconds = seconds.to_i
    seconds_left = seconds
    days = seconds/86400
    seconds_left -= days * 86400
    hours = seconds_left/3600
    seconds_left -= hours * 3600
    minutes = seconds_left/60
    seconds_left -= minutes * 60
    days_string = days > 0 ? "#{days} days, " : ""
    hours_string =  hours > 0 ? "#{hours} hours, " : ""
    minutes_string = minutes > 0 ?  "#{minutes} minutes, " : ""
    seconds_string = "#{seconds_left} seconds"
    days_string + hours_string + minutes_string + seconds_string
  end

  def average(arr)
    (arr.inject(:+).to_f/arr.length).round
  end


end
