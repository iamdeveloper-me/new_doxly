namespace :emailing_documents do
  #if Rails.env == 'production'
    Rails.logger = Logger.new(STDOUT)
  #end
  task :process_emails => :environment do
    log "Connecting to Gmail"
    gmail = Gmail.connect(Doxly.config.deal_email_username, Doxly.config.deal_email_password)
    log "Connected to gmail"
    unread_emails = gmail.inbox.emails(:unread)
    unread_emails.map{|email| email.read!}
    log "Gathering Unread Emails"

    if unread_emails.empty?
      log "No Unread Emails Found"
    else
      unread_emails.each do |email|
        log "Found Email"
        # get from_address
        from_address = convert_to_address_string(email.from.first)
        log "from: #{from_address}"

        doxly_deal_address = doxly_deal_address(email)
        # check for a matching deal
        deal = Deal.where('lower(deal_email) = ?', doxly_deal_address.split(/[+,@]/)&.second.downcase).first if doxly_deal_address

        if deal
          log "Found Deal: #{deal.title}"
          # check for a matching email address on the deal

          if deal.deal_entity_users.map{|dou| dou.entity_user.user.email.downcase}.include?(from_address)
            entity_users_on_deal = User.find_by(email: from_address).entity_users.select{|entity_user| entity_user.all_deals.pluck(:id).include?(deal.id)}
            entity_user = entity_users_on_deal.find{|entity_user| entity_user.is_default} || entity_users_on_deal.first
            log "Found Matching User: #{entity_user.name}"
            errors = {}
            # process the document
            email.attachments.each do |email_attachment|
              next unless email_attachment.filename
              # create placed or unplaced attachment.
              process_attachment(email_attachment, deal, entity_user)
            end
            log "Processed Email"
            email.label("Processed")
            DocumentMailer.uploading_errors_email(from_address, deal, errors).deliver_later if errors.any?

          else
            log "Unauthorized User"
            email.label("Unauthorized User")
            DocumentMailer.unauthorized_user_email(from_address).deliver_later
          end

        else
          log "No Matching Deal"
          email.label("No Deal")
          DocumentMailer.no_deal_found_email(from_address, doxly_deal_address).deliver_later
        end

        email.delete!
      end
    end
  end

  def log(message)
    if Rails.env.development?
      puts message
    else
      Rails.logger.info message
    end
  end

  def doxly_deal_address(email)
    # lambdas for finding the doxly deal email
    to_matcher = -> {convert_to_address_string(email.to.select{|to| to.mailbox.downcase.start_with?(Doxly.config.deal_email_beginning)}.first)}
    cc_matcher = -> {convert_to_address_string(email.cc.select{|to| to.mailbox.downcase.start_with?(Doxly.config.deal_email_beginning)}.first) if email.cc}
    bcc_matcher = -> {convert_to_address_string(email.bcc.select{|to| to.mailbox.downcase.start_with?(Doxly.config.deal_email_beginning)}.first) if email.bcc}
    # ugly way to find bcc values that the gmail gem doesn't parse.
    # email.received is an array of received info. The second contains an @unparsed_value that contains a bunch of info from headers that doesn't have a getter method.
    # So I have to inspect and then split and then select to find the correct address. Really ugly, and would gladly do a better way if possible.
    hidden_bcc_matcher = -> {email.received.second&.inspect&.split(/[<>]/)&.select{|x| x.downcase.start_with?(Doxly.config.deal_email_beginning)}&.first}

    doxly_deal_address = to_matcher.call || cc_matcher.call || bcc_matcher.call || hidden_bcc_matcher.call
    log "To: #{doxly_deal_address}" if doxly_deal_address

    doxly_deal_address
  end

  def convert_to_address_string(address_object)
    return unless address_object
    (address_object.mailbox + "@" + address_object.host)&.downcase
  end

  def process_attachment(email_attachment, deal, entity_user)
    #process the attachment
    log "Processing Attachment"
    filename, sanitized_basename = get_file_info(email_attachment)
    File.open(Doxly.config.temp_dir + filename, "w+b", 0644) {|f| f.write email_attachment.body.decoded}
    file = File.open(Doxly.config.temp_dir + filename, "r+", 0644)
    results = FuzzyMatch.new(deal.category_descendants.where(type: ["Document", "Task"]), :read => :sanitized_name, find_all_with_score: true).find(sanitized_basename).take(2)
    # check to see if there's a good match for the document name that doesn't have signatures sent out.
    if results.any? && (results.first.second > 0.9) && (results.first.second - (results.second.second || 0.0) > 0.1) && !results.first.first.has_signature_packets?
      place_in_checklist(email_attachment, file, filename, results.first.first, entity_user)
    else
      create_unplaced_attachment(email_attachment, file, filename, deal, entity_user)
    end
    log "Processed Attachment"
  end

  def get_file_info(email_attachment)
    filename = email_attachment.filename
    extname = File.extname(filename)
    basename = File.basename(filename, extname)
    sanitized_basename = basename.gsub(/[^0-9A-Za-z]/, '')
    [filename, sanitized_basename]
  end

  def place_in_checklist(email_attachment, file, filename, new_parent, entity_user)
    log "Found Matching Tree Element With Name: #{new_parent.name}"
    log "Uploading As New Version"
    attachment = (new_parent.attachment || new_parent.build_attachment)
    attachment.upload!(file, entity_user, { upload_method: "email", filename: filename })
    file.close if file
    File.unlink(file) if file
    if new_parent.attachment.errors.any?
      errors["#{email_attachment.filename}"] = attachment.errors.full_messages
      log "Errors found"
    end
  end

  def create_unplaced_attachment(email_attachment, file, filename, deal, entity_user)
    log "Creating An Unplaced Attachment"
    attachment = deal.unplaced_attachments.new
    log "Created Unplaced Attachment"
    # also creates and saves the version
    attachment.upload!(file, entity_user, { upload_method: "email", filename: filename })
    log "Uploaded version"
    file.close if file
    File.unlink(file) if file
    if attachment.errors.any?
      errors["#{email_attachment.filename}"] = attachment.errors.full_messages
      attachment.destroy
      log "Errors found"
    end
  end

end
