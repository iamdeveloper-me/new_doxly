class SsoController < ActionController::Base
  include Controllers::SsoSettings

  def adfs_metadata
    if using_subdomain? && sso_settings
      stripped_meta_data = adfs_metadata_template.split("\n").map(&:strip).join
      send_data stripped_meta_data, :type => "application/xml", :disposition => "attachment; filename=federationmetadata.xml"
    else
      render :text => 'Invalid SSO subdomain'
    end
  end

  private

  def adfs_metadata_template
    url = request.base_url
    "<?xml version=\"1.0\" encoding=\"utf-8\"?>
        <EntityDescriptor ID=\"_271f377f-78d8-4133-8c46-a73c4936bb1f\" entityID=\"#{url}\" xmlns=\"urn:oasis:names:tc:SAML:2.0:metadata\">
          <RoleDescriptor xsi:type=\"fed:ApplicationServiceType\" xmlns:fed=\"http://docs.oasis-open.org/wsfed/federation/200706\" protocolSupportEnumeration=\"http://docs.oasis-open.org/wsfed/federation/200706\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">
            <fed:TargetScopes>
              <wsa:EndpointReference xmlns:wsa=\"http://www.w3.org/2005/08/addressing\">
                <wsa:Address>#{url}/</wsa:Address>
              </wsa:EndpointReference>
            </fed:TargetScopes>
            <fed:PassiveRequestorEndpoint>
              <wsa:EndpointReference xmlns:wsa=\"http://www.w3.org/2005/08/addressing\">
                <wsa:Address>#{url}/</wsa:Address>
              </wsa:EndpointReference>
            </fed:PassiveRequestorEndpoint>
          </RoleDescriptor>
        </EntityDescriptor>"
  end

end