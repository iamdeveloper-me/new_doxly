module Devise
  module Strategies
    class CustomTwoFactorBackupable < Devise::Strategies::DatabaseAuthenticatable
      def authenticate!
        resource = mapping.to.find_for_database_authentication(authentication_hash)
        if resource
          resource.bypass_password_validation = true
        end

        if validate(resource) { resource.invalidate_otp_backup_code!(params[scope]['otp_attempt']) }
          # Devise fails to authenticate invalidated resources, but if we've
          # gotten here, the object changed (Since we deleted a recovery code)
          resource.save!
          super
        end

        fail(:not_found_in_database) unless resource

        # We want to cascade to the next strategy if this one fails,
        # but database authenticatable automatically halts on a bad password
        @halted = false if @result == :failure
      end
    end
  end
end

Warden::Strategies.add(:custom_two_factor_backupable, Devise::Strategies::CustomTwoFactorBackupable)
