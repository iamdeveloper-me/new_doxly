module Models::Encryptable

  def encrypt(salt_name, attribute_value)
    return if attribute_value == nil
    self.send("#{salt_name}=", SecureRandom.hex)
    key = ActiveSupport::KeyGenerator.new(Doxly.config.encryption_password).generate_key(salt, 32)
    crypt = ActiveSupport::MessageEncryptor.new(key)
    crypt.encrypt_and_sign(attribute_value)
  end

  def decrypt(attribute_value)
    return if attribute_value == nil
    key = ActiveSupport::KeyGenerator.new(Doxly.config.encryption_password).generate_key(salt, 32)
    crypt = ActiveSupport::MessageEncryptor.new(key)
    crypt.decrypt_and_verify(attribute_value)
  end
end
