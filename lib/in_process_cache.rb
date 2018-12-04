class InProcessCache
  # Values in the cache can be stomped by competing
  # lifetimes, use with care.
  def self.store(key, lifetime = 1.minutes, &block)
    cache            = Thread.current[:cache] ||= {}
    stored_at, entry = cache[key]
    if stored_at && (Time.now.utc - stored_at) <= lifetime
      entry
    else
      result     = block.call
      cache[key] = [Time.now.utc, result]
      result
    end
  end
end
