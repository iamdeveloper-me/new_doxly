class App::Counsel::SignatureTabsController < App::ApplicationController
  include Controllers::CustomSignaturePages

  def new
    check_create(:signature_management)
    signature_tab
  end

  # TODO clean up this method.
  def create
    check_create(:signature_management)
    signature_page
    signature_tabs = JSON.parse(params[:signature_tabs])
    removed_tabs_ids = JSON.parse(params[:removed_tabs_ids])
    if signature_tabs.any? || removed_tabs_ids.any?
      begin
        # move to aws, set is_custom etc. unless you're just editing the signature_page tabs.
        move_to_aws unless params[:editing]

        if signature_page.errors.any?
          flash.now[:error] = "Upload failed. Please try again or contact Doxly Customer Support."
          render 'shared/blank' and return
        else
          # create the signature_tabs
          signature_tabs.each do |signature_tab|
            new_tab = signature_page.signature_tabs.create(
              tab_type: signature_tab["tab_type"],
              label: signature_tab["label"],
              x_coordinate: signature_tab["x_coordinate"],
              y_coordinate: signature_tab["y_coordinate"]
            )
          end

          # set the signature_page to be custom
          signature_page.is_custom = true
          signature_page.use_template = use_template
          signature_page.save

          # apply the changes to the other pages
          tree_element_signature_group = signature_page.tree_element_signature_group
          pages = if use_template
            params[:editing] ? tree_element_signature_group.template_signature_pages : tree_element_signature_group.ready_template_signature_pages
          else
            # will be removed from the array below and so nothing will happen.
            [signature_page]
          end

          if params[:editing]
            removed_tabs_ids = JSON.parse(params[:removed_tabs_ids])
            removed_tabs_ids.each do |id|
              signature_tab = signature_page.signature_tabs.find(id)
              # will also destroy copied tabs in after_destroy callback
              signature_tab.destroy
            end
            # just create tabs for every signature_page if params[:editing] is true
            (pages - [signature_page]).each do |page|
              signature_tabs.each do |signature_tab|
                page.signature_tabs.create(
                  tab_type: signature_tab["tab_type"],
                  label: signature_tab["label"],
                  x_coordinate: signature_tab["x_coordinate"],
                  y_coordinate: signature_tab["y_coordinate"]
                )
              end
            end
          else
            # update all copies
            (pages - [signature_page]).each do |page|
              page.copy_custom_page(signature_page)
            end
          end
        end
      ensure
        File.delete(get_file_path) if File.exist?(get_file_path) # we need to make sure we delete the file when the page is initially created
      end
    # if try to save without signature tabs. If the page has tabs but doesn't send json (no new tabs), we'll just close the modal.
    elsif signature_page.signature_tabs.empty?
      # not working right now.
      flash.now[:error] = "Custom signature page must have signing tabs"
      render 'shared/blank' and return
    end

    @tree_element         = signature_page.tree_element
    # need to select the group and not the signer
    @signing_capacity = nil if use_template
    render "counsel/signature_pages/update_signature_page_view" and return
  end

  def remove
    check_delete(:signature_management)
    signature_tab
  end

  private

  def deal
    @deal ||= current_entity_user.all_deals.find_by(:id => params[:deal_id])
  end

  def signature_group
    @signature_group ||= deal.signature_groups.find(params[:signature_group_id])
  end

  def signing_capacity
    @signing_capacity ||= signature_group.all_signing_capacities.find{|signing_capacity| signing_capacity.id == params[:signing_capacity_id].to_i}
  end

  def signature_page
    @signature_page ||= signing_capacity.signature_pages.find(params[:signature_page_id])
  end

  def signature_tab
    @signature_tab ||= (params[:signature_tab_id] || params[:id]) ? signature_page.signature_tabs.find(params[:signature_tab_id] || params[:id]) : signature_page.signature_tabs.new(tab_type: params[:tab_type], label: params[:label])
  end

  def tree_element
    @tree_element ||= deal.closing_category.descendants.find_by(id: params[:tree_element_id])
  end

  def move_to_aws
    file = File.open(get_file_path)
    begin
      ApplicationHelper.retry_command do
        signature_page.upload!(file)
      end
    ensure
      file.close
    end
    File.delete(get_file_path) if File.exist?(get_file_path)
  end

  def use_template
    params[:use_template] == "true"
  end
end
