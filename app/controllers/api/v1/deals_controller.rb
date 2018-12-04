class Api::V1::DealsController < Api::V1::ApplicationController
  include Controllers::Api::ChecklistHelpers

  api!
  def closing_checklist
    check_read(:deal)
    render_success(run_tree_serializer(deal.closing_category, deal_entity_user, deal.closing_category.all_tree_element_restrictions))
  end

  api!
  def documents_ready_to_be_executed
    check_update(:signature_management)
    tree_elements = deal.closing_category.descendants.signature_required.select{ |tree_element| tree_element.ready_for_execution? }
    document_array = []
    generic_path = ActionController::Base.helpers.asset_path("ic-page-placement-empty.png")
    tree_elements.each do |tree_element|
      pages = []
      version = tree_element.executable_version
      version.page_count.times do |number|
        pages << {
          name: number + 1,
          position: pages.length + 1,
          original_position: pages.length + 1,
          preview_path: ApplicationHelper.viewer_url(view_deal_category_tree_element_attachment_version_path(deal.id, deal.closing_category, tree_element, version.attachment, version), :page_num => number+1)
        }
      end

      signature_pages = tree_element.signature_pages
      executable_signature_pages = signature_pages.executable.to_a.uniq{|page| page.signing_capacity_id}
      executable_signature_pages.each do |signature_page|
        signature_page_thumbnail_path = generic_path
        if signature_page.thumbnail_sprite
          signature_page_thumbnail_path = download_thumbnail_sprite_deal_signature_page_path(deal.id, signature_page.id, signature_group_id: signature_page.signing_capacity.get_signature_group.id, signing_capacity_id: signature_page.signing_capacity.id, tree_element_id: tree_element.id)
        end
        pages << {
          signature_page_id: signature_page.id,
          name: signature_page.signing_capacity.name,
          signing_capacity_id: signature_page.signing_capacity_id,
          currently_executed: signature_page.currently_executed?,
          status: signature_page.signature_status,
          thumbnail_sprite_path: signature_page_thumbnail_path,
          position: pages.length + 1,
          original_position: pages.length + 1,
          preview_path: ApplicationHelper.viewer_url(view_deal_signature_page_path(deal.id, signature_page, signed: true))
        }
      end

      currently_executed_version =  tree_element.currently_executed_version
      last_executed_pages = currently_executed_version.executed_signature_pages if currently_executed_version
      document_thumbnail_sprite_path = generic_path
      if version.thumbnail_sprite
        # time is needed so that the browser doesn't cache if we refresh this sprite.
        document_thumbnail_sprite_path = download_thumbnail_sprite_deal_category_tree_element_attachment_version_path(deal, deal.closing_category, tree_element, version.attachment, version, time: Time.now.utc)
      end
      ready = {
        category_id: deal.closing_category.id,
        document_name: tree_element.name,
        document_id: tree_element.id,
        document_status: tree_element.latest_version.status,
        pages_signed_or_executed: executable_signature_pages.count,
        total_signers: signature_pages.pluck(:signing_capacity_id).uniq.count,
        new_signers: currently_executed_version ? (executable_signature_pages - last_executed_pages).map(&:signing_capacity_id).uniq : executable_signature_pages.map(&:signing_capacity_id).uniq,
        version_id: version.id,
        attachment_id: version.attachment_id,
        thumbnail_sprite_path: document_thumbnail_sprite_path,
        pages: pages,
        is_on_dms: version.is_on_dms?,
        voting_threshold_required: tree_element.voting_threshold_required?,
        threshold_met: tree_element&.are_voting_interest_thresholds_complete?
      }

      document_array << ready
    end
    render_success(document_array)
  end

  api!
  def closing_checklist
    check_read(:deal)
    render_success(run_tree_serializer(deal.closing_category, deal_entity_user, deal.closing_category.all_tree_element_restrictions))
  end

  api!
  def documents_not_ready_to_be_executed
    check_update(:signature_management)
    document_array = []
    incomplete_documents = deal.closing_category.descendants.signature_required.select{ |tree_element| !tree_element.ready_for_execution? }

    incomplete_documents.each do |incomplete|
      issues               = []
      signature_statuses   = incomplete.signature_pages.map(&:signature_status)

      latest_version = incomplete.executable_version
      if latest_version && !latest_version.page_count
        if Delayed::Job.where("handler LIKE '%gid://doxly/Version/#{latest_version.id}%'").where(queue:"create_thumbnails").any?
          issues << {"key": "thumbnails_processing"}
        else
          issues << {"key": "could_not_be_processed"}
        end
      elsif !latest_version
        issues << {"key": "no_document_uploaded"}
      end

      if signature_statuses.empty?
        issues << {"key": "no_signers"}
      elsif signature_statuses.include?("not_sent") && signature_statuses.uniq.length == 1
        issues << {"key": "not_sent_for_signatures"}
      elsif incomplete.any_signature_pages_executing?
        issues << {"key": "documents_executing"}
      elsif !signature_statuses.any? {|status| status == 'signed'}
        issues << {"key": "no_signatures_received"}
      end

      document_array << {
        document_name: incomplete.name,
        issue: issues
      }
    end

    render_success(document_array)
  end

  api!
  def documents_requiring_threshold
    check_read(:signature_management)
    render_success(run_array_serializer(deal.closing_category.descendants.voting_threshold_required, DocumentSerializer))
  end

  api!
  def process_documents_ready_to_be_executed
    check_update(:signature_management)

    # goes through the object and changes the status of each signature page to 'executing'
    documents_hash = Array(params[:documents_to_execute])
    signature_page_ids   = []

    documents_hash.each do |document_hash|
      signature_page_ids << document_hash[:pages].select{ |page| page[:signature_page_id].present? }.map{|page| page[:signature_page_id]}
    end
    signature_page_ids.flatten!
    signature_pages = deal.signature_pages.includes(tree_element_signature_group: :signature_pages).where(id: signature_page_ids)

    return if signature_pages.where(is_executing: true).any?

    set_signature_pages_to_executing(signature_pages)
    ExecuteDocumentsJob.perform_later(documents_hash, current_deal_entity_user)

    render_success
  end

  api!
  def get_signer
    check_read(:entity_user)
    render_success(run_object_serializer(signer, UserSerializer, deal))
  end

  api!
  def signers
    check_read(:entity_user)
    render_success(run_array_serializer(deal.signers, UserSerializer, deal))
  end

  private

  def signer
    deal.signers.select{|signer| signer.id == params[:id].to_i}.first
  end

  def deal_params
    params.require(:deal).permit(:documents_to_execute)
  end

  def pdf_path(deal, version)
    pdf_path ||= directory_path(deal) + "/version_#{version.id}.pdf"
  end

  def directory_path(deal)
    directory_path ||= "#{ApplicationHelper.signature_management_root}/deal_#{deal.id}/custom_placement"
    FileUtils.mkdir_p(directory_path) unless Dir.exist?(directory_path)
    directory_path
  end

  def documents
    @documents ||= deal.closing_category.descendants.signature_required.order(:name)
  end

  def set_signature_pages_to_executing(signature_pages)
    signature_pages.each do |signature_page|
      if signature_page.update(is_executing: true)
        (signature_page.tree_element_signature_group.signature_pages.select{|page| page.signing_capacity_id == signature_page.signing_capacity_id} - [signature_page]).each do |page|
          page.update(is_executing: true)
        end
      end
    end
  end
end
