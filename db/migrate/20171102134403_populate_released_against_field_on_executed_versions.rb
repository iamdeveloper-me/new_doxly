class PopulateReleasedAgainstFieldOnExecutedVersions < ActiveRecord::Migration
  def change
    Version.where(status: 'executed').each do |executed_version|
      executed_against_version = executed_version.attachment.versions.find_by(status: 'final')
      # early executions executed the final version, I believe.
      if !executed_against_version
        puts "couldn't find final version"
        next
      end
      executed_version.executed_against_version_id = executed_against_version.id
      executed_version.bypass_tree_element_execution_check = true
      executed_version.save!
    end
  end
end
