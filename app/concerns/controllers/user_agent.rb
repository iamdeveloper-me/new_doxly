module Controllers::UserAgent

  def self.included(base)
    base.helper_method :current_user_agent, :is_ie11?, :is_safari?, :is_edge?, :is_safari10?
  end

  def current_user_agent
    @current_user_agent ||= UserAgent.parse(request.user_agent)
  end

  def is_ie11?
    @is_ie11 ||= begin
      current_user_agent.present? && current_user_agent.browser == Doxly.config.ie_user_agent_name && current_user_agent.version.to_s.to_i == 11
    end
  end

  def is_safari?
    @is_safari ||= begin
      current_user_agent.present? && current_user_agent.browser == Doxly.config.safari_user_agent_name
    end
  end

  def is_safari10?
    @is_safari10 ||= begin
      current_user_agent.present? && current_user_agent.browser == Doxly.config.safari_user_agent_name && current_user_agent.version.to_s.to_f < 11.0
    end
  end

  def is_edge?
    @is_edge ||= begin
      current_user_agent.present? && current_user_agent.browser == Doxly.config.edge_user_agent_name
    end
  end

end
