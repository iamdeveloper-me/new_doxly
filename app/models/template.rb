class Template < ActiveRecord::Base
  validates   :category,              presence: true
  validates   :name,                  presence: true, length: { maximum: 100 }
  validates   :deal_type_templates,   presence: true

  belongs_to  :entity
  has_one     :category,              -> { where(type: ['DiligenceCategory', 'ClosingCategory']) }, class_name: 'TreeElement', as: :owner, dependent: :destroy
  has_many    :deal_type_templates,   autosave: true, inverse_of: :template, dependent: :destroy
  has_many    :deal_types,            through: :deal_type_templates

end
