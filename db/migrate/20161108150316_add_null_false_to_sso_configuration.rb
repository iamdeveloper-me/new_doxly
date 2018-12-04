class AddNullFalseToSsoConfiguration < ActiveRecord::Migration
  def change
    change_column_null :sso_configurations, :idp_cert_fingerprint, false
    change_column_null :sso_configurations, :target_url, false
  end
end
