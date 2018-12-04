class HddEntityStorage < ActiveRecord::Base
  belongs_to :entity
  validates :entity, presence: true

  def get_path
    if !path || !File.exist?(path)
      self.path = "#{ApplicationHelper.hdd_storage_root}/entity-#{entity.id}"
      self.save
      Dir.mkdir(path) unless Dir.exists?(path)
    end
    path
  end
end
