class User < ActiveRecord::Base

  acts_as_token_authenticatable

  FIRST_NAME_PLACEHOLDER = 'First Name'
  LAST_NAME_PLACEHOLDER  = 'Last Name'

  attr_accessor :bypass_password_validation, :bypass_email_validation, :bypass_change_email_validation, :use_placeholder_name

  devise :recoverable,
         :rememberable,
         :trackable,
         :confirmable,
         :lockable,
         :timeoutable,
         :omniauthable

  devise :two_factor_authenticatable, otp_secret_encryption_key: Doxly.config.otp_secret_encryption_key
  devise :two_factor_backupable, otp_number_of_backup_codes: 10

  mount_uploader :avatar, AvatarUploader

  handle_asynchronously :send_devise_notification, :queue => 'mailers'

  validates_presence_of         :first_name, unless: :use_placeholder_name
  validates_presence_of         :last_name,  unless: :use_placeholder_name
  validates_length_of           :full_name,  :maximum => 98, if: -> { self.full_name_present? }
  validates                     :email,      :presence => true, unless: :bypass_email_validation?
  validates                     :email,      :uniqueness => { :case_sensitive => false, allow_nil: true }
  validates                     :email,      :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i }, :if => -> { self.email.present? }
  validates                     :phone,      :allow_blank => true, :length => { :maximum => 15 }
  validates                     :password,   :format => { :with => /\A(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*\z/x }, :if => :encrypted_password_changed?
  validates_confirmation_of     :password,   on: :update, unless: :bypass_password_validation?
  validates_presence_of         :password,   on: :update, unless: :bypass_password_validation?
  validates_presence_of         :unique_key
  validate                      :cannot_change_email, unless: :bypass_change_email_validation?

  has_many  :entity_users,          autosave: true, dependent: :destroy
  has_one   :default_entity_user,   -> { where(is_default: true) }, class_name: "EntityUser"
  has_many  :entities,              through: :entity_users, autosave: true
  has_many  :deal_entity_users,     through: :entity_users
  has_many  :all_deals,             through: :entity_users
  has_one   :primary_address,       as: :addressable, :dependent => :destroy, autosave: true

  has_many :signature_packets,           dependent: :destroy
  has_many :sent_signature_pages,        through: :signature_packets
  has_many :signature_pages,             through: :signing_capacities
  has_many :signing_capacities,          dependent: :destroy
  has_many :signature_groups,            through: :signing_capacities
  has_many :login_tokens,                dependent: :destroy
  has_many :temp_uploads,                dependent: :destroy
  has_many :login_activities,            dependent: :destroy
  has_many :critical_errors,             as: :critical_errorable, autosave: true, inverse_of: :critical_errorable
  has_many :unmatched_signature_uploads, :foreign_key => :uploader_id, :dependent => :destroy
  after_save :refresh_confirmation_token_if_email_changed

  before_validation :set_unique_key
  before_validation :set_placeholder_name
  before_save :set_blank_email_to_nil

  SEARCH_FIELDS = [:first_name, :last_name]

  # Set this to be true if you want to update user object without setting password.
  def bypass_password_validation?
    bypass_password_validation
  end

  def bypass_email_validation?
    bypass_email_validation
  end

  def bypass_change_email_validation?
    bypass_change_email_validation
  end

  def set_placeholder_name
    return true unless use_placeholder_name
    self.first_name = FIRST_NAME_PLACEHOLDER
    self.last_name  = LAST_NAME_PLACEHOLDER
  end

  def name
    self.full_name_present? ? self.full_name : self.email
  end

  def full_name
    [self.first_name, self.last_name].join(' ')
  end

  def full_address
    output = ''
    output = "#{self.primary_address}<br>" if self.primary_address.present?
    output << "#{[self.city, self.state].join(', ')} " if self.city.present? || self.state.present?
    output << "#{self.zip}" if self.zip
    output << "<br>" unless output.blank?
    output
  end

  def cancel_change_email!
    self.confirmation_token = nil
    self.unconfirmed_email = nil
    self.bypass_password_validation = true
    self.save
  end

  def email_domain
    /@(.+)/.match(self.email).try(:[], 1)
  end

  def initials
    return 'X' unless self.full_name_present?
    first_name[0].to_s + last_name[0].to_s
  end

  def avatar_color
    colors = ["orange", "blue", "grey"]
    colors[self.id % 3]
  end

  # used by reports
  def to_hash(add_entity = true)
    data = {
      id: self.id ? self.id : self.email,
      email: self.email,
      user_id: self.id ? self.id : self.email,
      name: self.name,
      first_name: self.first_name,
      last_name: self.last_name,
      initials: self.initials,
      phone: self.phone,
      primary_address: self.primary_address,
      is_active: self.is_active,
      role: self.role,
      avatar: self.avatar.url
    }

    if add_entity and self.entities
      data[:entities] = self.entities.map{|entity| {id: entity.id, name: entity.name} }
      data[:entity_user_ids] = self.entity_users.pluck(:id)
    end

    return data
  end

  def refresh_confirmation_token!
    self.generate_confirmation_token!
  end

  #devise class method for SSO
  def self.from_omniauth(auth)
    # creates user if not found
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
      user.first_name = auth.info.first_name
      user.last_name = auth.info.last_name
    end
  end

  def full_name_present?
    !(self.first_name == FIRST_NAME_PLACEHOLDER && self.last_name == LAST_NAME_PLACEHOLDER || (self.first_name.blank? && self.last_name.blank?))
  end

  def unique_key_for_name
    self.unique_key.reverse
  end

  def unique_key_for_title
    self.unique_key[4..8] + self.unique_key[0..3]
  end

  def refresh_user_confirmation_token
    self.refresh_confirmation_token!
    User.confirm_by_token(self.confirmation_token)
    self.reload
  end

  def activate_user
    self.is_active                  = true
    self.bypass_password_validation = true
    self.save
  end

  def unique_key_for_date_signed
    self.unique_key_for_title.reverse
  end

  def unique_key_for_address
    self.unique_key[6..8] + self.unique_key[0..5]
  end

  # devise overrides

  def confirm
    # when creating signer users, we need to bypass the validation to save their user account
    self.bypass_password_validation = true if self.entity_users.empty? || self.is_active?
    super
  end

  # Override to allow for a custom template for reconfirmation
  def send_confirmation_instructions
    unless @raw_confirmation_token
      generate_confirmation_token!
    end

    opts = pending_reconfirmation? ? { :to => unconfirmed_email } : { }
    mailer_action = pending_reconfirmation? ? :reconfirmation_instructions: :confirmation_instructions
    send_devise_notification(mailer_action, @raw_confirmation_token, opts)
  end

  def can_see_event?(event, entity_user)
    if event.eventable.is_a?(Note)
      !event.eventable.noteable.is_restricted_from_this_entity_user?(entity_user) && (event.eventable.is_public || self.entities.include?(event.eventable.entity_user.entity))
    elsif event.eventable.is_a?(TreeElement)
      !event.eventable.is_restricted_from_this_entity_user?(entity_user)
    else
      true
    end
  end

  def timedout?(last_access)
    is_timed_out = super(last_access)
    if is_timed_out
      self.authentication_token = nil
      self.bypass_password_validation = true
      self.save
    end
    is_timed_out
  end

  def deals_that_require_attention
    non_download_signature_packets.select{|signature_packet| signature_packet.deal.status == "open" && signature_packet.signature_pages.any? {|sp| (SignaturePage::SENDING_SIGNATURE_STATUSES + SignaturePage::READY_SIGNATURE_STATUSES).include?(sp.signature_status) }}.map{|sp| sp.deal}.uniq
  end

  def create_authentication_cookie(cookies, entity_user_id)
    cookies[:authentication] = {token: self.authentication_token, email: self.email, entity_user_id: entity_user_id}.to_json
  end

  def update_authentication_cookie(cookies, entity_user_id)
    cookies.delete(:authentication)
    create_authentication_cookie(cookies, entity_user_id)
  end

  # gets incomplete signature packets for a user on a specific deal and filters out the pending ones.
  def incomplete_signature_packets_on_deal(deal_id)
    incomplete_packets = non_download_signature_packets.where(deal_id: deal_id).where.not(sent_at: nil).order(created_at: 'asc').select{ |signature_packet| signature_packet.signature_pages.incomplete.any? }
    # filter out the processing ones
    needs_signature_packets = []
    incomplete_packets.each do |signature_packet|
      processing_jobs = Delayed::Job.where(queue: 'process_manual_signatures').where("handler LIKE '%gid://doxly/SignaturePacket/#{signature_packet.id}%'") unless signature_packet.docusign_envelope_id
      processing_jobs ||= []
      needs_signature_packets << signature_packet if processing_jobs.empty? || processing_jobs.map(&:failed_at).any?
    end
    needs_signature_packets
  end

  # returns the first (and only) manual packet that's incomplete on a deal for the user matching the packet type
  def incomplete_manual_packet_on_deal(deal_id, packet_type)
    signature_packets.where(deal_id: deal_id, completed_at: nil, docusign_envelope_id: nil, packet_type: packet_type).last
  end

  # returns the first (and only) docusign packet that's incomplete on a deal for the user matching the packet type
  def incomplete_docusign_packet_on_deal(deal_id, packet_type)
    signature_packets.where.not(docusign_envelope_id: nil).where(deal_id: deal_id, completed_at: nil, packet_type: packet_type).select{|packet| !packet.all_pages_signed? }.first
  end

  def get_entity_user
    default_entity_user || entity_users.first
  end

  def has_placeholder_name?
    self.first_name == User::FIRST_NAME_PLACEHOLDER && self.last_name == User::LAST_NAME_PLACEHOLDER
  end

  def use_placeholder_name?
    use_placeholder_name
  end

  def sso_enabled_entity
    # we only need to login with the first sso enabled entity, even if there are multiple entities with sso provider configurations
    entities.includes(:sso_provider_configurations).select{ |entity| entity.sso_provider_configurations.active.any? }.first
  end

  def disable_two_factor_authentication!
    self.bypass_password_validation = true
    self.otp_required_for_login = false
    self.otp_secret = nil
    self.otp_backup_codes = nil
    self.save
  end

  def enable_two_factor_authentication!
    self.otp_required_for_login = true
    self.bypass_password_validation = true
    self.save
  end

  def build_two_factor_authentication_secret!
    self.otp_secret = User.generate_otp_secret
    self.bypass_password_validation = true
    self.save
  end

  def build_two_factor_authentication_qr_code
    # build provisioning uri
    issuer = 'Doxly'
    label = "#{issuer}:#{self.email}"
    provisioning_uri = self.otp_provisioning_uri(label, issuer: issuer)

    # build qr code
    qr_code = Barby::QrCode.new(provisioning_uri)
    qr_code_image = Tempfile.new(['two_factor_authentication_qr_code', '.png'], ApplicationHelper.temp_dir_root)
    File.open(qr_code_image.path, 'wb'){ |f| f.write Barby::PngOutputter.new(qr_code).to_png(xdim: 200, ydim: 200, margin: 0) }
    qr_code_image
  end

  def two_factor_enabled?
    return self.otp_required_for_login == true
  end

  def valid_otp_attempt?(otp_attempt)
    return otp_attempt == self.current_otp
  end

  # This is copied from Devise::Models::Lockable#valid_for_authentication?, as our auth
  # flow means we don't call that automatically (and can't conveniently do so).
  #
  # See:
  #   <https://github.com/plataformatec/devise/blob/v4.0.0/lib/devise/models/lockable.rb#L92>
  #
  def increment_failed_attempts!
    self.failed_attempts ||= 0
    self.failed_attempts += 1

    if attempts_exceeded?
      lock_access! unless access_locked?
    else
      save(validate: false)
    end
  end

  def non_download_signature_packets
    signature_packets.without_download_type
  end

  private

  def cannot_change_email
    if confirmed? && email_changed? && email_was.present? && !unconfirmed_email_was.present?
      errors.add(:email, :cannot_be_changed)
    end
  end

  def set_unique_key
    return if self.unique_key.present?
    is_unique_key = false
    current_key   = nil
    until is_unique_key
      current_key = SecureRandom.hex(4)
      is_unique_key = User.find_by(:unique_key => current_key).nil?
    end
    self.unique_key = current_key
  end

  def set_blank_email_to_nil
    self.email = nil if self.email&.strip == ""
  end

  def refresh_confirmation_token_if_email_changed
    if !confirmed? && email_was && email_changed?
      refresh_confirmation_token! if confirmation_token.present?
    end
  end
end
