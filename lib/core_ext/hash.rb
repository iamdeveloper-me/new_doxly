class Hash
  class << self
    # iterates recursively and creates a flat list of the keys, keeping the position of each intact
    def deep_flatten_keys(options={})
      tree   = options.fetch(:tree, {})
      result = options.fetch(:result, [])
      tree.each do |key, value|
        result << key
        # continue down the tree, if needed
        deep_flatten_keys({ tree: value, result: result }) if value.is_a?(Hash) && value.present?
      end
      result
    end
  end
end