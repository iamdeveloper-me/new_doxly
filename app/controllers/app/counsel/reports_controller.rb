class App::Counsel::ReportsController < App::ApplicationController

  def index
    check_read(:reports)
    @deals_by_type = summary('type')
    @deals_by_size = summary('size')
    @deals_by_member = summary('member')
  end

  # TODO: Refactor this!
  def summary(data_by, time_period="6_months")
    now = Time.now.utc
    start_of_month = now.beginning_of_month
    scope = Deal.from("(#{current_entity.owned_deals.to_sql} UNION #{current_entity.collaborating_deals.to_sql}) as deals")
    if time_period == "1_month"
      start_time = start_of_month - 1.month
      end_time = (start_time + 1.month).end_of_month
    elsif time_period == "3_months"
      start_time = start_of_month - 2.months
      end_time = (start_time + 2.months).end_of_month
    else
      start_time = start_of_month - 5.months
      end_time = (start_time + 5.months).end_of_month
    end

    scope = scope.where("deals.created_at BETWEEN ? AND ?", start_time, end_time)
    if data_by == "size"
      if time_period == "1_month"
        scope = scope.group("1, 2")
                     .select("deal_size, TO_CHAR(deals.created_at, 'YYYY-MM-DD') AS date, COUNT(*) AS count")
      else
        scope = scope.group("1, 2")
                     .select("deal_size, TO_CHAR(deals.created_at, 'YYYY-MM') AS date, COUNT(*) AS count")
      end
    elsif data_by == "type"
      if time_period == "1_month"
        scope = scope.group("1, 2")
                     .select("(SELECT name from deal_types where id = deals.deal_type_id) as deal_type_name, TO_CHAR(deals.created_at, 'YYYY-MM-DD') AS date, COUNT(*) as count")
      else
        scope = scope.group("1, 2")
                     .select("(SELECT name from deal_types where id = deals.deal_type_id) as deal_type_name, TO_CHAR(deals.created_at, 'YYYY-MM') AS date, COUNT(*) as count")
      end
    else
      scope = scope.joins(:deal_entity_users => [:entity_user])
                   .group('entity_users.user_id')
                   .select("DISTINCT entity_users.user_id, COUNT(*) as count")
    end

    json = {}
    json[:results] = scope.as_json(:except => [:id])

    if data_by == "size"
      json[:sizes] = json[:results].collect{|h| h["deal_size"]}
    elsif data_by == "type"
      json[:types] = json[:results].map { |a| a['deal_type_name'] }
    else
      json[:members] = []
      json[:results].each do |h|
        user = current_entity.users.find_by(:id => h["user_id"])
        json[:members].push(user.to_hash) if user
      end.compact
    end

    unless data_by == "member"
      group_values = []
      if time_period == "1_month"
        group_values = (start_time.to_date..end_time.to_date).to_a.collect{|d| d.strftime("%Y-%m-%d")}
      else
        i = 0
        begin
          d = start_time + i.month
          group_values.push(d.strftime("%Y-%m"))
          i += 1
        end while d < (end_time - 1.month)
      end
      json[:group_values] = group_values
    end
    json.to_json
  end

end
