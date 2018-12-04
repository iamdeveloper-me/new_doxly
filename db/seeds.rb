# Create admin
puts "Creating admin from config"
admin = Admin.new(email: Doxly.config.default_admin_username, password: Doxly.config.default_admin_password)
admin.save
# Create a user
puts "Creating the first user -- email: organization.admin@doxly.com; password: Test1234"
user = User.new(:first_name => 'Doxly', :last_name => 'Admin', :email => 'organization.admin@doxly.com', :password => 'Test1234')
user.skip_confirmation!
user.is_active = true
user.save

# Create an organization created by that user
puts "Creating the first organization"
organization = Entity.new(:name => 'Doxly', :is_counsel => true, type: "Organization")
organization.id = 1000
organization.save
organization_user = organization.entity_users.new(:user_id => user.id, role: "entity_admin", title: "Partner")
organization_user.id = 5000
organization_user.save

# Create a deal types
puts "Creating deal types"
deal_types = ["M&A", "Venture Capital", "Private Equity", "Commercial Real Estate"]
deal_type_records = []
deal_types.each do |deal_type|
  deal_type_records << DealType.find_or_create_by(:name => deal_type)
end

# Create default templates
puts "Creating default templates"
Rake.application['templates:import_all'].invoke()
