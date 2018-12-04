class RemovingNumberingFromDoxlyTemplates < ActiveRecord::Migration
  def change
    Template.where(entity: nil).each do |template|
      template.category.children.each do |section|
        section.name = section.name.gsub(/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\.(\s)*/, '')
        section.save
      end
    end
  end
end
