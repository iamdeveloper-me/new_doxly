class ApplicationSerializer < ActiveModel::Serializer

  def self.counsel_attributes(*args)
    args.each do |arg|
      attribute(arg, if: :counsel?)
    end
  end

  def counsel?
    scope[:current_entity].is_counsel?
  end
end
