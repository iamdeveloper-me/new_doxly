module ActiveRecord
  class Base
    include Models::Permissable

    class << self
      include Models::Permissable
    end

    # Runs a quick filter on the specified filter_term with sort/pagination. If the filter_term is not available, only returns a sorted/paginated result
    def self.filter_sort_and_page(filter_term, columns_to_filter, sorts, page=1, per_page=20)
      if filter_term.present?
        terms      = [filter_term.split.map { |s| "%#{s}%" }]
        conditions = Array(columns_to_filter).map do |column|
          "(#{column.to_s} ~~* all(array[?]))"
        end.join(" OR ")
        where([conditions] + (terms * columns_to_filter.size)).sort_and_page(sorts, page, per_page)
      else
        sort_and_page(sorts, page, per_page)
      end
    end

    # Runs sort and pagination on the relation
    def self.sort_and_page(sorts, page=1, per_page=20)
      order_by = ''
      order_by = sorts.map do |sort|
        '%s %s' % [sort[:column], (sort[:direction] || 'asc')]
      end.join(',')
      # TODO: Implement pagination in the app
      #per_page ||= WillPaginate.per_page
      #order(order_by).limit(per_page).page(page)
      order(order_by)
    end
  end
end
