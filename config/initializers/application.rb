# Include the core module extensions
Dir[File.join(Rails.root, "lib", "core_ext", "**", "*.rb")].each {|l| require l }

# Environment variables
ENV["JAVA_HOME"] = Doxly.config.java_home_path