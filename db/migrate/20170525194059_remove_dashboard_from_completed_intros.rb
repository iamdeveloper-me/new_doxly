class RemoveDashboardFromCompletedIntros < ActiveRecord::Migration
  def change
    User.all.each do |user|
      completed_dashboard = user.intros_completed.delete('dashboard')
      if completed_dashboard.present?
          user.bypass_password_validation = true
          user.save
      end
    end
  end
end
