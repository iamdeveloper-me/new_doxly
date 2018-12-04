class MigrateDocumentStatuses < ActiveRecord::Migration
  def change
    Version.all.each do |version|
      tree_element = version.attachment.attachable
      if version.is_executed?
        version.status = "executed"
      elsif tree_element.is_a?(TreeElement) && tree_element.root.is_a?(ClosingCategory)
        if tree_element.completion_statuses.any?
          if tree_element.completion_statuses.first.is_complete?
            version.status = "final"
          else
            version.status = "draft"
          end
          version.status_set_at = tree_element.completion_statuses.first.updated_at
          tree_element.completion_statuses.destroy_all
        else
          version.status = "draft"
          version.status_set_at = version.created_at
        end
      elsif tree_element.is_a?(TreeElement) && tree_element.root.is_a?(DiligenceCategory)
        version.status = "final"
        version.status_set_at = version.created_at
      else
        version.status = "draft"
        version.status_set_at = version.created_at
      end
      version.bypass_file_validations = true
      version.save!
    end
  end
end
