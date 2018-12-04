class SignaturePageSplitter

  class << self
    WATIR_SWITCHES            = %w[--ignore-certificate-errors --disable-popup-blocking --disable-translate --disable-notifications --start-maximized --disable-gpu --disable-dev-shm-usage --no-sandbox --headless]
    BROWSER_LOAD_TIMEOUT      = 10
    MAX_BROWSER_LOAD_ATTEMPTS = 5
    SAFETY_PADDING            = 100

    def split_signature_page(signature_page_collection, deal_signature_pages_base=nil)
      block_collection = signature_page_collection.block_collection
      allBlocks = block_collection.blocks.flatten
      blocks = []

      # build structure for consolidation
      allBlocks.each do |block|
        if !block.signature_entity.present?
          blocks << {
            signature_entities: nil,
            signing_capacity: block.signing_capacity,
            position: block.position,
            ids: [block.id],
            primary_address: block.signing_capacity.primary_address,
            copy_to_address: block.signing_capacity.copy_to_address
          }
        end
      end

      if block_collection.is_consolidated
        block_collection.consolidated_blocks.each do |key, signing_capacities|
          blocks << {
            signature_entities: signing_capacities.map{|signing_capacity| signing_capacity.signature_entity.root}.uniq,
            signing_capacities: signing_capacities.uniq{|signing_capacity| signing_capacity.user.id},
            position: signing_capacities.first.signature_entity.root.block.position,
            ids: signing_capacities.map{ |signing_capacity| signing_capacity.get_block.id }.uniq,
            primary_address: signing_capacities.map{ |signing_capacity| signing_capacity.signature_entity.root.primary_address }.compact[0],
            copy_to_address: signing_capacities.map{ |signing_capacity| signing_capacity.signature_entity.root.copy_to_address }.compact[0]
          }
        end
      else
        block_collection.signature_entities.each do |signature_entity|
          blocks << {
            signature_entities: [signature_entity.root],
            signing_capacities: signature_entity.all_signing_capacities,
            position: signature_entity.block.position,
            ids: [signature_entity.block.id],
            primary_address: signature_entity.root.primary_address,
            copy_to_address: signature_entity.root.copy_to_address
          }
        end
      end

      signature_page_collection_html = ApplicationController.new.render_to_string(template: "app/counsel/signing_capacities/templates/signature_page_content", locals: { signature_page_collection: signature_page_collection, blocks: blocks, base_path: deal_signature_pages_base }, layout: false)
      signature_page_file_path = "#{Rails.root}/#{Doxly.config.temp_dir}/page_collection_#{signature_page_collection.id}.html"
      File.open(signature_page_file_path, 'wb') { |file| file.write(signature_page_collection_html) }

      if File.exist?(signature_page_file_path)
        signature_page_collection_object = {
          page_1: []
        }

        # Check to see if we need to run this collection through Watir to determine the block locations. If not, we can just send the blocks back directly
        # like we would do if the page length is < 960 for linked blocks
        if signature_page_collection.has_linked_blocks?
          browser = Watir::Browser.new :chrome, switches: WATIR_SWITCHES

          browser_loaded        = 0
          browser_load_attempts = 0
          begin
            while (browser_loaded == 0)
              begin
                browser_loaded         = 1
                browser_load_attempts += 1
                Timeout::timeout(BROWSER_LOAD_TIMEOUT) { browser.goto "file://#{signature_page_file_path}" }
              rescue Timeout::Error => e
                puts "Page load timed out: #{e}"
                if browser_load_attempts < MAX_BROWSER_LOAD_ATTEMPTS
                    browser_loaded = 0
                  retry
                end
              end
            end

            header = browser.div(class: 'header').exists? ? browser.div(class: 'header').height : 0
            footer = browser.div(class: 'footer').exists? ? browser.div(class: 'footer').height : 0
            footer_height = (footer > 60 || footer == 0) ? footer : 60
            body_height = header + footer_height + SAFETY_PADDING

            blocks.each do |block|
              if browser.div(id: "block-#{block[:position]}").exists?
                body_height = body_height + browser.div(id: "block-#{block[:position]}").height
              end
            end

            if body_height < 960
              signature_page_collection_object[:page_1] = blocks
              return signature_page_collection_object
            end

            page_count = 1
            space_taken = header + footer_height + SAFETY_PADDING

            blocks.each do |block|
              block_id = "block-#{block[:position]}"
              block_height = browser.div(id: block_id).height if browser.div(id: block_id).exists?
              space_taken = space_taken + block_height

              if space_taken > 960
                page_count += 1
                space_taken = header + footer_height + SAFETY_PADDING + block_height

                page_number = "page_#{page_count}"
                signature_page_collection_object[page_number.to_sym] = [block]
              else
                page_number = "page_#{page_count}"
              signature_page_collection_object[page_number.to_sym] << block
              end
            end
          ensure
            browser&.close
            browser&.quit
            browser = nil
            # give time for the "chrome" processes to be cleaned up
            sleep(1)
          end
        else
          signature_page_collection_object[:page_1] = blocks
        end

        return signature_page_collection_object
      end
    end

  end

end
