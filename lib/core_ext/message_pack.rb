module MessagePack
  class << self
    def load(val)
      if val.nil?
        {}
      else
        unpack(val)
      end
    end

    def dump(*args)
      pack(*args)
    end
  end
end