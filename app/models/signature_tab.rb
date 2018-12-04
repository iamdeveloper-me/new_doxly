class SignatureTab < ActiveRecord::Base
  belongs_to :signature_page

  validates_presence_of :signature_page, :x_coordinate, :y_coordinate, :tab_type

  after_destroy :destroy_copied_tabs
  after_destroy :set_signature_page_to_not_custom

  SIGNATURE_TAB_DETAILS = {
    "Signature": {
      "Signature": {
        class: 'sign',
        text: 'Sign'
      }
    },
    "Text": {
      "Full Name": {
        class: 'name',
        text: 'Name'
      },
      "Title": {
        class: 'title',
        text: 'Title'
      },
      "Address Line": {
        class: 'address-line',
        text: 'Address Line'
      }
    },
    "DateSigned": {
      "Date Signed": {
        class: 'date-signed',
        text: 'Date Signed'
      }
    }
  }.with_indifferent_access

  def destroy_copied_tabs
    return unless signature_page.tree_element_signature_group
    signature_page.tree_element_signature_group.signature_pages.where(signing_capacity_id: signature_page.signing_capacity_id).map{|page| page.signature_tabs}.flatten.each do |tab|
      if tab.tab_type == self.tab_type && tab.label == self.label && tab.x_coordinate == self.x_coordinate && tab.y_coordinate == self.y_coordinate
        tab.destroy
      end
    end
  end

  def set_signature_page_to_not_custom
    return unless signature_page.tree_element_signature_group
    if self.signature_page.signature_tabs.empty?
      signature_page.tree_element_signature_group.signature_pages.where(signing_capacity_id: signature_page.signing_capacity_id).each do |page|
        page.reset_signature_page_to_non_custom
      end
    end
  end

end
