import flatten from 'flat'

const en = flatten({
  account_settings: {
    two_factor_authentication: {
      status: {
        disabled: 'Disabled',
        enabled: 'Enabled',
        toggle_button: {
          disable: 'Disable',
          disable_two_factor_authentication: 'Disable Two-Factor Authentication',
          disable_warning: "Disabling two-factor authentication makes your account more vulnerable. You can always re-enable at any time.",
          enable_two_factor_authentication: 'Enable Two-Factor Authentication'
        },
        recovery_codes: {
          download: 'Download',
          recovery_codes: 'Recovery Codes',
          regenerate: 'Regenerate',
          regenerate_warning: "Generating new recovery codes will invalidate all of your existing codes."
        },
        are_you_sure: "Are you sure?"
      },
      setup: {
        enable: 'Enable',
        intro_tab: {
          title: 'Two-factor authentication is required to login to your account',
          explanation: 'To ensure your data remains private and protected, {entitiesString} {entitiesCount, plural, one {requires} other {require}} two-factor authentication. Two-factor authentication enhances security by requiring you to login with two forms of identification - your password and your phone.'
        },
        qr_code_tab: {
          loading_message: 'Generating QR code...',
          title: '2. Scan Barcode',
          explanation: 'Scan the image below with the two-factor authentication app on your phone. If you do not have a two-factor authentication app, we suggest you use Google Authenticator or Authy.',
          verify_token: {
            title: 'Enter the six-digit code from the application.',
            explanation: 'After scanning the barcode image, the app will display a six-digit code that you can enter below.',
            error: 'Invalid code. Please re-enter.'
          }
        },
        recovery_codes_tab: {
          alert: 'You must download your recovery codes before continuing two-factor authentication setup.',
          download_codes: 'Download Codes',
          generating_codes: 'Generating codes...',
          title: '1. Recovery Codes',
          explanation: 'Recovery codes are used to access your account in the event you cannot receive two-factor authentication codes.'
        },
        set_up_two_factor_authentication: 'Set Up Two-Factor Authentication'
      },
      two_factor_authentication: 'Two-Factor Authentication'
    }
  },
  category: {
    checklist: {
      header: {
        delete: 'Delete this Checklist Item?',
        delete_warning: 'Deleting will permanently remove this item and any attached documents.',
        details: 'Details',
        doc: 'Document',
        folder_or_document: 'Folder/Document',
        last_change: 'Last Change',
        item: 'Item',
        review_status: 'Review status',
        signature: 'Signature',
        status: 'Status',
        type: 'Type',
        upload_file: 'Upload file'
      },
      toolbar: {
        search_checklist: 'Search Checklist',
        closing_filter: {
          filter_by: 'Filter by',
          active_party: 'Active party',
          item_status: 'Item status',
          show_all_parties: 'Show all parties',
          show_all_items: 'Show all items',
          filtered_by_party_and_status: 'Filtered by party and status',
          filtered_by_party: 'Filtered by party',
          filtered_by_status: 'Filtered by status',
          no_filter: 'No filter'
        },
        data_room_filter: {
          filter_by: 'Filter by',
          document_status: 'Document status',
          reviewed: 'Reviewed',
          needs_review: 'Needs review',
          file_not_uploaded: 'File not uploaded',
          show_all_documents: 'Show all documents',
          no_filter: 'No filter',
          filtered_by_document_status: 'Filtered by status'
        },
        show_uploads: 'Show Uploads',
        hide_uploads: 'Hide Uploads',
        unable_to_load_uploads: 'Unable to load uploads',
        add: 'Add',
        add_item: 'Add Item',
        add_item_subtext: 'Add a new item after the selected item',
        add_item_subtext_no_item_selected: 'Add a new item at the top of the checklist',
        add_multiple_items: 'Add Multiple Items',
        add_multiple_items_subtext: 'Upload items inside the selected item',
        add_folder: 'Add Folder',
        add_folder_subtext_no_item_selected: 'Add a folder at the top of the data room',
        add_folder_subtext_document: 'Add a folder after the selected document',
        add_folder_subtext_folder: 'Add a folder inside the selected folder',
        add_document: 'Add Document',
        add_document_subtext_no_item_selected: 'Add a document at the top of the data room',
        add_document_subtext_document: 'Add a document after the selected document',
        add_document_subtext_folder: 'Add a document inside the selected folder',
        add_multiple_documents: 'Add Multiple Documents',
        add_multiple_documents_subtext: 'Upload documents inside the selected folder',
        checklist_settings: 'Checklist Settings',
        settings: 'Settings',
        print: 'Print',
        download: 'Download'
      },
      click_to_add_details: 'Click to add details',
      details: 'Details',
      no_search_results: 'No checklist items matched your search.',
      no_filter_results: 'No checklist items match the filter.',
      no_filter_and_search_results: 'No checklist items match the filter and search.',
      empty: 'Looks like the checklist is empty. Click \'Add Item\' above to start building the checklist.',
      checklist_item_name: 'Checklist Item Name',
      document_name: 'Document Name',
      folder_name: 'Folder Name',
      reserved: '[Reserved]',
      uploading: 'Uploading...',
      dnd: {
        cannot_drop: "The item you are trying to move cannot be placed at the dropped location."
      }
    },
    sidebar: {
      document: {
        add_new_version_to_this_document: 'Add a new version to this document.',
        attachment: {
          attached_document: 'DOCUMENT',
          errors: {
            unable_to_upload_file: 'Error: Unable to upload file.',
          },
          upload: 'Upload'
        },
        dms_upload_button_dropdown: {
          desktop: 'Desktop',
          dms_type: '{dmsType}',
          import_export: 'Import/Export Version',
          import_new_version: 'Import new version',
          quick_save: 'Quick Save',
          save_this_version_to: 'Save this version to {dmsType}',
          select_location: 'Select Location',
          this_version_has_already_been_uploaded: 'This version has already been uploaded to {dmsType}'
        },
        document: 'Document',
        drop_to_upload: 'Drop to upload',
        errors: {
          unable_to_upload: `Unable to upload file: {fileName}`
        },
        upload_file: 'Upload File',
        upload_new_version: 'Drag and drop or click the button above to upload a version.'
      },
      header: {
        complete: 'Complete',
        delete: 'Delete',
        delete_tree_element_content: 'Deleting will permanently remove this item and any attached documents.',
        delete_tree_element_header: 'Delete this Checklist Item?',
        description: 'Description',
        end_uploads_and_delete: 'End Uploads and Delete Item?',
        item_name: 'Checklist Item Name',
        item_type: 'CHECKLIST ITEM TYPE',
        mark_complete: 'Mark item as complete',
        mark_reviewed: 'Mark as reviewed',
        uploads_pending: 'There are uploads pending underneath this item. Deleting will cancel these uploads and permanently remove this item.',
        required_signature: 'Requires a signature',
        reviewed: 'Reviewed',
        signature_types: {
          no_signature: 'No Signature',
          signature_required: 'Signature Required',
          voting_threshold_required: 'Voting Threshold Required'
        },
        how_to_enable_voting_threshold: 'You can turn on voting thresholds for this deal in the Deal Details'
      },
      privacy: {
        and_x_others: `and {otherCount, number} {otherCount, plural, one {other} other {others}}`,
        edit_privacy: 'Edit Privacy',
        not_found: 'Error: Not Found',
        not_restricted: 'All users in the Working Group List who have been invited to this deal can see item details and any documents uploaded herein.',
        privacy_modal: {
          add_to_list: 'Add to List',
          children_privacy_question: 'Would you like these items to have the same privacy settings?',
          close: 'Close',
          customize_privacy: `Customize Privacy for “{name}”`,
          next: 'Next',
          no: 'No,',
          retain_restrictions: 'all items should retain their customized privacy settings.',
          listed_items: 'The list item contains {number} additional items nested below it.',
          list_items: 'List Items',
          multiple_roles: 'This entity belongs to multiple roles.',
          multiple_organizations: 'This user belongs to multiple organizations.',
          privacy_details: 'Add Roles, Organiziations or Individuals who should not see this document',
          set_child_restrictions: `set the items under "{name}" to have the same privacy settings. This will remove any customized privacy for each item.`,
          remove_from_list: 'Remove from List',
          restrict_document_from: 'Restrict document from',
          yes: 'Yes,',
          empty_state: {
            no_restrictions_set: 'No restrictions set',
            details: 'All users in the Working Group List who have been invited to this deal can see item details and any documents uploaded herein.',
            instructions: 'Use “Add to list” to restrict members viewing this item.'
          }
        },
        restrict_document_from: 'Restrict document from:',
        restricted: 'Restricted',
        restricted_description: 'This item and any uploaded documents have been hidden from these Individuals:',
        restricted_empty_state: 'No individuals are restricted',
        title: 'Privacy'
      },
      responsible_party: {
        add_party: 'Add responsible party',
        add_party_detail: 'Add an organization to assign responsibility and set status details.',
        add_responsible_party: 'Add responsible party',
        already_added: 'Already added',
        assign_key_person: 'Assign a key person',
        choose_responsible_party: 'Choose a responsible party',
        details: 'Add detail (e.g. \'Review real estate provisions\')',
        members: 'MEMBERS',
        parties_wg: 'PARTIES IN WORKING GROUP LIST',
        party_header: 'STATUS',
        remove_person: 'Remove assigned person from this document?',
        remove_party: 'Remove this organization from Responsible Parties for this document?',
        responsible_parties: 'Responsible Parties',
        responsible_parties_warning: 'Only two groups can be added as responsible parties.',
        set_responsibility: 'Set responsibility',
        status_detail: 'Status detail'
      },
      notes: {
        delete: 'Delete this note?',
        error: 'You can only delete notes that you have created',
        new_note: 'New note',
        errors: {
          unable_to_load_notes: 'Unable to load notes.'
        }
      },
      tabs: {
        overview: 'Overview',
        public_notes: 'Public Notes',
        team_notes: 'Team Notes'
      },
      to_dos: {
        add_to_do: 'Add to-do',
        add_new_to_do: 'Add new to-do',
        assignee_header: 'DEAL MEMBERS',
        assignee_text: 'Assign a deal member',
        completed_to_dos:`{completedLength, number} Completed {completedLength, plural, one {To-do} other {To-dos}}`,
        due_date: 'Due date',
        due_time: 'Due time',
        helper_text: 'Type a to-do',
        team_to_do: 'TEAM TO-DO',
        to_do_sub_text: 'Add to-dos to keep track of tasks for this checklist item. Members of your organization in this deal can see and edit this list.',
        delete_to_do_header: 'Delete this to-do item?'
      },
      uploads: {
        header: {
          title: 'UPLOADS',
          need_to_be_placed: `{uploadsCount, plural, one {document} other {documents}} need to be placed`
        },
        sort: {
          created_at: 'Sort by Date',
          file_name: 'Sort by Name'
        },
        delete_upload_header: 'Delete this document?',
        delete_upload_body: 'Deleting will permanently remove this file from the Doxly servers.',
        empty: 'There aren\'t any uploads',
        needs_placement: 'Needs placement',
        ongoing_uploads: {
          uploading_files: `Uploading {pending_uploads_count, number} {pending_uploads_count, plural, one {file} other {files}}`,
          uploads_not_completed: `{incomplete_uploads_count, number} {incomplete_uploads_count, plural, one {upload} other {uploads}} not completed`,
          completed_uploads: 'Completed uploads',
          upload_error: 'Upload error',
          unable_to_complete_upload: 'Unable to complete upload.',
          please_try_again: 'A network issue occurred or the file could no longer be found. Please try again.'
        },
        placed_in: 'placed in',
        errors: {
          cannot_drop_there: `Attachments cannot be added to a section`
        }
      }
    },
    tree_element: {
      attachment: {
        cannot_mark_as_final: 'Cannot mark a document as final until a version has been uploaded.',
        cannot_mark_executed_version_as_incomplete: 'Cannot mark a document that has been executed as incomplete, unless you upload a new version.',
        version: {
          dms_metadata: {
            author: 'Author',
            class: 'Class',
            comment: 'Comment',
            created_by: 'Created By',
            create_date: 'Create Date',
            edit_date: 'Edit Date',
            date: 'Date',
            document: 'Document',
            extension: 'Extension',
            failed: 'Sending to {dms_type} failed',
            last_user: 'Last User',
            modified_by: 'Modified By',
            modified_date: 'Modified Date',
            name: 'Name',
            not_saved_to_dms: 'Not saved to {dms_type}',
            saved_to_dms: 'Saved to {dms_type}',
            sending: 'Sending version to {dms_type}',
            type: 'Type',
            version: 'Version',
          },
          status: {
            task: 'Task',
            no_doc: 'No Doc',
            doc_attached: 'Doc Attached',
            not_started: 'Not Started',
            draft: `Draft v{version, number}`,
            draft_no_version: 'Draft',
            final: 'Final v{version, number}',
            final_no_version: 'Final',
            executed: 'Executed v{version, number}',
            executed_no_version: 'Executed',
            dataRoom: 'View file',
            dataRoomVersion: `Version {version, number}`
          },
          upload: 'uploaded',
          email: 'emailed',
          mark_as_final: 'Mark as Final',
          undo_final: 'Undo Final'
        }
      },
      completion_status: {
        no_documents: '0 Documents',
        folder_count: '{completed_documents_count, number}/{documents_with_attachment_count, number} Reviewed',
        reviewed: 'Reviewed',
        mark_as_reviewed: 'Mark as reviewed',
        complete: 'Complete!'
      },
      dragging: {
        children_count: `+{childrenCount, number} {childrenCount, plural, one {child} other {children}}`
      },
      untitled: 'Untitled'
    },
    document_viewer: {
      compare_again: 'Compare again',
      compare_now: 'Compare now',
      compare_with: 'Compare',
      comparing: 'Comparing',
      creating_comparison: 'Creating Comparison',
      creating_downloadable_document: 'Creating Downloadable Document v{versionOne}-v{versionTwo}',
      delete_version: 'Delete this version?',
      deletion_permission: 'You do not have permission to delete this version.',
      download_comparison: 'Download Comparison',
      errors: {
        unable_to_compare: 'Error: Unable to compare.',
        unable_to_load_document: 'Unable to load document.',
        contact_support: 'Please contact support@doxly.com for assistance or click the button below to try again.',
        reload_document: 'Reload Document',
        unable_to_load_versions: 'Unable to load versions.',
        unable_to_load_versions_error: 'Error: Unable to load versions.'
      },
      executed_version_deletion: 'Versions cannot be removed once executed',
      exit_comparison: 'Exit comparison',
      hide_notes: 'Hide Notes',
      pdf_redlines: 'PDF Redlines',
      permanently_remove: 'Permanently remove this version.',
      return_to_checklist: 'Return to Checklist',
      select_versions: 'Select two versions to compare',
      show_notes: 'Show Notes',
      signer: `{signersCount, plural, one {signer} other {signers}}`,
      versions: 'Versions',
      viewing_comparison: 'Viewing comparison',
      word_redlines: 'Word Doc Redlines',
      word_track_changes: 'Word Doc with Track Changes'
    },
    errors: {
      unable_to_load_checklist: 'Unable to load checklist.',
      contact_support: 'Please contact support@doxly.com for assistance or click the button below to try again.'
    }
  },
  closing_books: {
    create_wizard: {
      build_table_of_contents: {
        add_remove_reorder: 'Rename, reorder, and remove/add documents to build your desired closing book and table of contents.',
        at_least_one_document_required: 'One or more documents must be added in order to generate the closing book.',
        cannot_include_tasks: 'Tasks cannot be included in a closing book.',
        cannot_remove_last_section: 'Unable to delete section. A closing book must have at least one section.',
        document_already_in_closing_book: 'This document has already been added to the Closing Book.',
        build_table_of_contents: 'Build Table of Contents',
        choose_from_checklist: 'Choose from Checklist',
        choose_from_checklist_instructions: 'Drag and drop the sections and documents into the closing book',
        document: 'Document',
        document_name: 'Document Name',
        name_cannot_be_blank: 'Name cannot be blank.',
        no_file_uploaded: 'This document cannot be included in the Closing Book. No files were uploaded in the Checklist.',
        number_of_documents: '+ {numberOfDocuments} {numberOfDocuments, plural, one {document} other {documents}}',
        remove_document: 'Remove this document from closing book?',
        remove_section: 'Remove this section from closing book?',
        section_already_in_closing_book: 'This section has already been added to the Closing Book.',
        section_name: 'Section Name',
        supported_file_types: 'The supported file types for inclusion in Closing Books are PDF, DOC, DOCX, JPG, XLS, XLSX and PNG.',
        tab_number: 'Tab #',
        unable_to_convert_to_pdf: 'This document cannot be included in the Closing Book. It could not be converted to a PDF document.',
        you_can_re_add_this_document: 'Removing this document will remove it from this closing book. You can re-add the document if needed by using the "Choose from Checklist" button above.',
        you_can_re_add_this_section: 'Removing this section will also remove all of the documents within the section from this closing book. You can re-add the section and documents if needed by using the choose from checklist button above.'
      },
      choose_name_and_format: {
        choose_name_and_format: 'Choose Name and Format',
        description: 'Description (optional)',
        description_placeholder: 'A summary of contents or reason for creation.',
        format: 'Format',
        give_this_closing_book_a_name: 'Give this Closing Book a name and set the desired format. The description is optional and for internal use only.',
        name: 'Name',
        name_placeholder: 'E.g., "First Closing", "Compiled Documents", etc.',
        valid_name_required: 'A valid name is required for the Closing Book.'
      },
      confirm_contents: {
        confirm_contents: 'Confirm Contents',
        confirm_the_contents: 'Confirm the contents of the closing book and create it.',
        cover_page: 'Cover Page',
        create_closing_book: 'Create Closing Book',
        documents: 'Documents'
      },
      create_closing_book: 'Create Closing Book',
      upload_cover_page: {
        choose_a_pdf_or_word_document: 'Optionally, choose a PDF or Word document to use as the cover page for this Closing Book.',
        continue_without_cover_page: 'Continue Without Cover Page',
        cover_page: 'Cover Page',
        create_closing_book: 'Create Closing Book',
        not_supported: 'Unable to upload cover page. The supported files types are PDF, DOC, and DOCX.',
        preview: 'Preview',
        remove: 'Remove',
        upload_cover_page: 'Upload Cover Page',
        would_you_like_to_use_cover_page: 'Would You Like to Use a Cover Page?'
      }
    },
    empty_state: {
      create_a_closing_book: 'Create a Closing Book',
      create_closing_book: 'Create Closing Book',
      prepare_and_assemble: 'Prepare and assemble a Closing Book, Deal Bible, or Document Set.'
    },
    extension: {
      html_index: 'html',
      pdf_compilation: 'pdf',
      pdf_index: 'pdf'
    },
    format: {
      html_index: 'HTML index of all documents',
      pdf_compilation: 'Single PDF of all documents',
      pdf_index: 'PDF index of all documents'
    },
    sidebar: {
      closing_book_name: 'Enter a name for this Closing Book',
      closing_book_name_label: 'Name',
      closing_book_description: 'Enter a description for this Closing Book',
      closing_book_description_label: 'Description',
      content: {
        documents_header: 'Documents ({numberOfDocuments})',
        errors_header: 'Errors ({numberOfErrors})'
      },
      delete_closing_book: 'Delete this Closing Book?',
      document_error: 'Could not add file to Closing Book',
      download: 'Download',
      error_title: 'Unable to create this Closing Book',
      error_message: 'We encountered errors while attempting to add the files listed below.',
      error_contact: 'Contact {email} for assistance with correcting the issue.',
      info: {
        created: 'Created by {firstName} {lastName} on {date}',
        title: 'Closing Book'
      },
      permanently_remove: 'Permanently remove this Closing Book.',
      support: 'Doxly Support'
    },
    table: {
      alerts: {
        error: 'Unable to create.',
        error_message: 'Some documents could not be converted.',
        in_progress: 'Compiling...',
        in_progress_message: 'Try refreshing in a minute.'
      },
      headers: {
        closing_book: 'Closing Book',
        documents: 'Documents',
        created: 'Created'
      },
    },
    toolbar: {
      create_closing_book: 'Create Closing Book'
    }
  },
  executed_versions: {
    choose_documents: 'Choose Documents',
    create_executed_versions: 'Create Executed Versions',
    confirm_changes: 'Confirm Changes',
    confirm_changes_description: 'Confirm creation of Executed Versions for the following documents. The executed version will appear in the Checklist.',
    could_not_be_converted: 'It could not be converted to a PDF document.',
    custom_page_placement: 'Customize Page Placement',
    custom_page_placement_description: 'You can rearrange or hide any page from the released version as needed. Signature pages are automatically placed at the end of each document. Hiding Signature Pages will keep the status as “Signed, not released”.',
    discard_changes: 'Quit and discard changes?',
    discard_changes_description: 'If you quit now, any changes made will be discarded.',
    document_header: 'DOCUMENT',
    edits: 'EDITS',
    executed: 'Executed',
    incomplete_documents: 'Released versions cannot be created.',
    incomplete_statuses: {
      could_not_be_processed: 'File could not be processed.',
      documents_executing: 'Document is being executed, try again in a minute.',
      no_document_uploaded: 'No document uploaded.',
      no_signers: 'No signers added to document.',
      no_signatures_received: 'No signature pages received.',
      not_sent_for_signatures: 'Not sent for signatures.',
      thumbnails_processing: 'Document processing, try again in a minute.'
    },
    incomplete_tab: 'Incomplete ({incompleteDocumentsCount, number})',
    issue: 'ISSUE',
    new_signer: 'New Signer',
    new_signers: 'New signers',
    new_signers_header: 'NEW SIGNERS',
    no_changes: 'No Changes',
    no_incomplete_documents: 'There are no incomplete documents to show.',
    pdf_viewer_title: '{name} - Page {page, number}',
    pages_removed: 'Pages removed',
    pages_removed_and_signers: 'Pages removed; new signers',
    pages_reordered: 'Pages reordered',
    pages_reordered_and_signers: 'Pages reordered; new signers',
    pages_reordered_and_removed: 'Pages reordered and removed',
    pages_reordered_and_removed_and_signers: 'Pages reordered and removed; new signers',
    preview: 'Preview',
    ready_tab: 'Ready ({readyDocumentsCount, number})',
    ready_documents: 'Select the documents to release signatures on and create released versions of the documents.',
    removed: 'Removed',
    remove_from_all: 'Remove From All',
    remove_from_all_documents: 'Remove from all documents?',
    remove_signer_from_all: 'This signer is in other documents you have chosen to execute. You can remove them from those documents as well.',
    reset: 'Reset order and show all',
    select_all_documents: 'SELECT ALL DOCUMENTS',
    signatures: 'SIGNATURES',
    status: 'STATUS',
    supported_file_types_are: 'The supported file types for conversion are: ',
    supported_file_types_list: 'PDF, DOC, DOCX, and images (JPG, PNG, and GIF).',
    sync_thumbnails: 'Sync Thumbnails',
    this_document_only: 'This Document Only',
    threshold_met: 'Threshold Met',
    threshold_not_met: 'Threshold Not Met'
  },
  address: {
    city: 'City',
    postal_code: 'Postal Code',
    state_or_province: 'State or Province',
    street: 'Street Address',
    street_description: 'Street and Number, P.O. Box, etc.',
    suite: 'Suite, Floor, etc.',
  },
  buttons: {
    add: 'Add',
    back: 'Back',
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    link: 'Link',
    next: 'Next',
    previous: 'Previous',
    quit: 'Quit',
    remove: 'Remove',
    save: 'Save',
    unlink: 'Unlink',
    send: 'Send',
    submit: 'Submit',
    create: 'Create'
  },
  send_signature_packets: {
    add_signature_packet_review_documents: {
      add_attachment_from: "Add attachment from {dropdown} or {uploadFile}",
      attached_for_review: 'Attached for review, but not signature.',
      closing_checklist: 'Checklist',
      doc: 'DOCUMENT',
      document_name:`{name} {number_of_copies, plural, one {} other {({number_of_copies} copies)}}`,
      packet_title: `Packet {packetsCount, plural, one {1} other {{pagesType, select, Docusign {1} Manual {2}}}} of {packetsCount} ({pagesType})`,
      send_without_signature_pages: 'Checkmark indicates signature pages sent without corresponding documents.',
      signature_only: 'SIGNATURE ONLY',
      uploading_details: 'Uploading...',
      upload_details: `Uploaded by {usersname} on {datetime}`,
      upload_failed: `Upload failed. Please try again. If the problem persists, {support}.`,
      upload_file: 'Upload File',
      version_from_closing_checklist: `Version {version_position} from Checklist`
    },
    build_packets_error: 'Could not build packet',
    confirm_content: 'Confirm the content of the signature packets below. Additional documents, not requiring signature, can be attached for review.',
    confirm_send: {
      add_message: 'Add a message (optional)',
      email_input: 'Use commas to seperate multiple email addresses.',
      invalid_email: 'Invalid email address.',
      message_description: 'Add a personalized note or any additional information the recipient may need.',
      recipients: 'Recipients',
      review_message: 'Review and send packet.',
      send_copy: 'Send Copy To',
      send_copy_description: 'Send a copy of the email that will be sent to the signer. Note that “Copy To” recipients will receive the same email as the signer.'
    },
    packet_summary: 'Packet Summary',
    packets_list: `{packetsCount} {packetsCount, plural, one {Packet} other {Packets}} {packetsCount, plural, one { {docuSignPresent, select, true {(Docusign)} false {(Manual)} }} other {(Docusign, Manual)}}`,
    send_packets_error: 'Could not send signature packet',
    signature_packet: `Send {packetsCount, plural, one {Signature Packet} other {Signature Packets}}`,
    packet_type: 'Packet Type',
    packet_types: {
      email: 'Email: Sends the packet to the signer\'s email directly from Doxly.',
      link: 'Link: Generates a link to share with the signer for them to access and sign their packet.',
      download: 'Download: Download the packet to print and sign or include as an attachment to a signer.'
    }
  },
  signature_management: {
    blocks: {
      by: 'By:',
      consolidate: 'Consolidate entities with shared signers',
      import: 'Import from the Working Group List',
      link_blocks: 'Link blocks',
      link_blocks_explanation: 'Choose 2 or more signture blocks to link.',
      entity_name_title: '{entityName} its {entityTitle}'
    },
    entity: 'Entity',
    form_errors: {
      change_email: 'Change the name for this block to match the previous signer name of {signerName}',
      choose_different_email: 'Or choose a different email to associate with this signer’s name',
      entity_name: 'First signing entity name cannot be blank',
      existing_signer: 'This email is already associated to a signer name on the deal. In order to proceed:',
      invalid_email: 'Please enter a valid email or leave blank',
      match_sent: 'Please match the signer name of {signerName} from the original sent packet(s)',
      matching_signers: 'Only one signer can be associated with an email per entity. Please change an email.',
      name_or_placeholder: 'First name and last name cannot be blank',
      overwrite_names: 'Or click next or save to proceed and overwrite the previous name to {signerName}',
      overwrite_unnamed_names: 'Click next or save to proceed and overwrite the previous name to {signerName}',
      sent_packets_signer_name_error: 'Some packets associated with this email have been sent. You cannot use multiple names for one email on a deal. In order to proceed:',
      use_different_email: 'Or use a different email'
    },
    individual: 'Individual',
    signer_forms: {
      add_new_entity: 'Add New Entity Signer',
      edit_entity: 'Edit Entity Signer',
      add_new_individual: 'Add New Individual Signer',
      edit_individual: 'Edit Individual Signer',
      add_signing_entity: 'Add Signing Entity',
      add_additional_signer: 'Add Additional Signer',
      by: 'By:',
      copy_to_address: 'Use Copy to Address',
      email: 'Email',
      first_name: 'First Name',
      its: 'its',
      last_name: 'Last Name',
      name: 'Name',
      placeholder_description: 'A blank field will be shown for the signer to write in their name or you can update the name later.',
      placeholder_name: 'Placeholder Name',
      signing_entity_name: 'Signing Entity Name',
      signing_authority_description: '(If the subsequent signing authority is an entity)',
      signing_entity: 'Signing Entity',
      title: 'Title',
      unnamed_signer: 'Unnamed Signer {unnamedSignerCount}',
      use_placeholder: 'Use a placeholder name',
    },
    signature_groups: {
      add: `Add to {signature_group}`,
      add_signature_group: 'Add Signature Group',
      delete_group: 'Delete Group',
      edit: 'Edit Signature Group',
      edit_group: 'Edit Group',
      empty_state: 'Organize signers into signature groups, such as Company, Buyer, or Investor. Start by clicking "Add Signature Group"',
      error: 'Name cannot be blank',
      new: 'New Signature Group',
      search: 'Search for Individuals or Organizations',
      signature_group_name: 'Signature Group Name'
    },
    with_copy_to: 'With Copy To:',
    voting_threshold: {
      add_voting_interest_group: 'Add Voting Interest Group',
      delete_voting_interest_group: 'Delete Voting Interest Group?',
      delete_voting_interest_group_description: 'The voting interest group and all thresholds associated with it will be removed.',
      instructions: 'Click "Add Voting Interest Group" and type in the group name. Add shares and document threshold percentages in the cells below.',
      total_number_of_shares: 'Total Number of Shares',
      voting_interest_group: 'Voting Interest Group',
      voting_interest_group_name: 'Voting Interest Group Name',
      voting_interests: {
        number_of_shares: 'Number of Shares',
        voting_interest_description: 'Input the number of shares this signer has within each voting interest group below.',
        empty: {
          no_voting_interest_groups: 'No voting interest groups have been created for this deal.',
          visit_voting_threshold_tab: `Visit the {link} to create Voting Interest Groups.`,
          can_change_later: 'You can still save this block now and come back to add the number of shares later.'
        }
      },
      voting_threshold_tab: 'Voting Threshold Tab'
    }
  },
  unmatched_signature_pages: {
    no_unmatched_signature_pages: 'No unmatched signature pages',
    sidebar: {
      description: 'These pages could not be matched automatically. Choose the signer and document to manually match the page.',
      manually_matched_tab: {
        file_name: '{file_name} (Page {page_number})',
        placed: 'PLACED IN'
      },
      tabs: {
        manually_matched: 'Manually Matched',
        removed_uploads: 'Removed Uploads',
      },
      title: 'Unmatched Signature Pages',
      title_number: `Unmatched Signature Pages ({count})`,
      unmatched_signature_uploads: {
        all_signature_pages_matched_or_removed: 'All signature pages have either been manually matched or removed.',
        client_upload: 'Client Upload',
        counsel_upload: 'Counsel Upload',
        no_unmatched_pages: 'No Unmatched Pages',
        move_this_upload_to_removed_uploads: 'Move this upload to the "Remove Uploads" tab. Any manually matched pages will remain matched to their respective signer and document.',
        remove_this_upload: 'Remove this upload?',
        remove_upload: 'Remove Upload',
        unmatched_signature_upload_page: {
          choose_document: 'Choose document',
          choose_signing_capacity: 'Choose signer\'s group or entity',
          choose_signer: 'Choose signer',
          individual: 'Individual',
          page_number: `Page {page_number}`,
          signer: `{name} ({email})`,
          signing_capacity: `{entity} ({group})`,
          signer_empty_state: 'No signers available'
        },
        uploader: `by {name}`,
        where_should_this_signature_page_be_placed: 'Where should this signature page be placed?'
      }
    }
  },
  item_types: {
    doc: 'Document',
    task: 'Task'
  },
  errors: {
    api_error: 'Error: {error}',
    something_went_wrong: 'Error: Something went wrong.'
  },
  common_words: {
    at: 'at',
    do_not_show_this_message_again: 'Do not show this message again',
    on: 'on',
    or: 'or',
    saving: 'saving'
  },
  file_picker: {
    choose_file_to_add_to_doxly: 'Choose File to Add to Doxly',
    comment: 'Comment',
    document_name_must_be_present: 'Document name must be present',
    document_versions: 'Document Versions',
    imanage10: {
      document_worklist: 'Document Worklist',
      matter_worklist: 'Matter Worklist',
      my_favorites: 'My Favorites',
      my_matters: 'My Matters',
      shortcut_to_document: 'Shortcut to document {document_number} in library {database}'
    },
    name: 'Name',
    net_documents: {
      cabinets: 'Cabinets',
      favorite_workspaces: 'Favorite Workspaces',
      recent_workspaces: 'Recent Workspaces',
      recent_documents: 'Recent Documents'
    },
    new_document: 'New Document',
    new_version: 'New Version',
    please_search_again: 'Please try again using different search terms.',
    save_as: 'Save As',
    save_to: 'Save to',
    search_text: 'Search by ID or Name',
    search_results_empty: 'This search did not yield any results.',
    search_query_must_be_at_least_two_characters_long: 'Search query must be at least two characters long',
    see_unity_imanage: {
      document_worklist: 'Document Worklist',
      matter_worklist: 'Matter Worklist',
      my_matters: 'My Matters',
      my_favorites: 'My Favorites'
    },
    select_a_document_to_view_versions: 'Select a document to view versions',
    this_location_is_empty: 'This location is empty',
    version_number: 'Version {versionNumber}'
  },
  dms_types: {
    net_documents: 'NetDocuments',
    see_unity_imanage: 'iManage',
    imanage10: 'iManage'
  }
})
export default en
