class ScheduledJob < ActiveRecord::Base
  belongs_to  :schedulable, :polymorphic => true
  belongs_to  :job,         :class_name => "Delayed::Backend::ActiveRecord::Job", :dependent => :destroy
end
