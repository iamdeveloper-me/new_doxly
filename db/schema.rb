# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20181009154231) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.integer  "addressable_id"
    t.string   "addressable_type"
    t.string   "address_line_one"
    t.string   "address_line_two"
    t.string   "city"
    t.string   "state_or_province"
    t.string   "postal_code"
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
    t.string   "type",              default: "PrimaryAddress", null: false
  end

  add_index "addresses", ["addressable_type", "addressable_id"], name: "index_addresses_on_addressable_type_and_addressable_id", using: :btree
  add_index "addresses", ["type"], name: "index_addresses_on_type", using: :btree

  create_table "adfs_sso_settings", force: :cascade do |t|
    t.string   "issuer_name",                null: false
    t.string   "issuer",                     null: false
    t.string   "realm",                      null: false
    t.string   "reply",                      null: false
    t.string   "saml_version", default: "1", null: false
    t.string   "id_claim",                   null: false
    t.string   "idp_cert",                   null: false
    t.string   "logout_url"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "admins", force: :cascade do |t|
    t.string   "email",           default: "", null: false
    t.string   "password_digest", default: "", null: false
    t.datetime "last_sign_in_at"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

  create_table "assignment_statuses", force: :cascade do |t|
    t.integer  "entity_id"
    t.integer  "assigner_id"
    t.integer  "assignee_id"
    t.integer  "assignable_id"
    t.string   "assignable_type"
    t.string   "status",                                      default: "incomplete"
    t.datetime "assigned_at"
    t.datetime "completed_at"
    t.datetime "incompleted_at"
    t.integer  "completed_by_organization_user_id"
    t.integer  "incompleted_by_entity_user_id"
    t.integer  "timespent",                         limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "assignment_statuses", ["assignable_id", "assignable_type"], name: "index_assignment_statuses_on_assignable_id_and_assignable_type", using: :btree
  add_index "assignment_statuses", ["assigned_at"], name: "index_assignment_statuses_on_assigned_at", using: :btree
  add_index "assignment_statuses", ["assignee_id"], name: "index_assignment_statuses_on_assignee_id", using: :btree
  add_index "assignment_statuses", ["assigner_id"], name: "index_assignment_statuses_on_assigner_id", using: :btree
  add_index "assignment_statuses", ["completed_at"], name: "index_assignment_statuses_on_completed_at", using: :btree
  add_index "assignment_statuses", ["entity_id"], name: "index_assignment_statuses_on_entity_id", using: :btree
  add_index "assignment_statuses", ["status"], name: "index_assignment_statuses_on_status", using: :btree

  create_table "attachments", force: :cascade do |t|
    t.integer  "attachable_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "attachable_type", default: "TreeElement"
  end

  add_index "attachments", ["attachable_id", "attachable_type"], name: "index_attachments_on_attachable_id_and_attachable_type", using: :btree
  add_index "attachments", ["attachable_id"], name: "index_attachments_on_attachable_id", using: :btree

  create_table "aws_entity_storages", force: :cascade do |t|
    t.integer  "entity_id"
    t.boolean  "allowed",    default: true
    t.string   "bucket"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "aws_entity_storages", ["entity_id"], name: "index_aws_entity_storages_on_entity_id", using: :btree

  create_table "aws_files", force: :cascade do |t|
    t.string   "key"
    t.string   "type",                    default: "AwsFile"
    t.integer  "entity_id"
    t.integer  "aws_fileable_id"
    t.string   "aws_fileable_type"
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.datetime "expiration_datetime"
    t.boolean  "has_expiration_datetime", default: false,     null: false
  end

  add_index "aws_files", ["aws_fileable_type", "aws_fileable_id"], name: "index_aws_files_on_aws_fileable_type_and_aws_fileable_id", using: :btree
  add_index "aws_files", ["entity_id"], name: "index_aws_files_on_entity_id", using: :btree
  add_index "aws_files", ["expiration_datetime"], name: "index_aws_files_on_expiration_datetime", using: :btree
  add_index "aws_files", ["has_expiration_datetime"], name: "index_aws_files_on_has_expiration_datetime", using: :btree

  create_table "aws_version_storages", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "block_collections", force: :cascade do |t|
    t.integer  "signature_group_id"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.boolean  "is_consolidated",    default: false
  end

  add_index "block_collections", ["signature_group_id"], name: "index_block_collections_on_signature_group_id", using: :btree

  create_table "blocks", force: :cascade do |t|
    t.integer  "block_collection_id"
    t.integer  "position"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  add_index "blocks", ["block_collection_id"], name: "index_blocks_on_block_collection_id", using: :btree

  create_table "closing_book_documents", force: :cascade do |t|
    t.integer  "document_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "closing_book_section_id"
    t.string   "name"
    t.integer  "tab_number"
  end

  add_index "closing_book_documents", ["closing_book_section_id"], name: "index_closing_book_documents_on_closing_book_section_id", using: :btree

  create_table "closing_book_sections", force: :cascade do |t|
    t.string   "name"
    t.integer  "section_id"
    t.integer  "closing_book_id"
    t.integer  "position"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "closing_book_sections", ["closing_book_id"], name: "index_closing_book_sections_on_closing_book_id", using: :btree

  create_table "closing_books", force: :cascade do |t|
    t.integer  "deal_id"
    t.string   "status"
    t.string   "url"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "format"
    t.string   "logo"
    t.string   "attachment"
    t.text     "cover_text"
    t.string   "name",        null: false
    t.text     "description"
    t.integer  "creator_id"
    t.string   "cover_page"
    t.string   "font"
    t.integer  "font_size"
  end

  add_index "closing_books", ["creator_id"], name: "index_closing_books_on_creator_id", using: :btree

  create_table "completion_statuses", force: :cascade do |t|
    t.integer  "deal_entity_id"
    t.integer  "tree_element_id"
    t.boolean  "is_complete"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "completion_statuses", ["deal_entity_id"], name: "index_completion_statuses_on_deal_entity_id", using: :btree
  add_index "completion_statuses", ["tree_element_id"], name: "index_completion_statuses_on_tree_element_id", using: :btree

  create_table "conversions", force: :cascade do |t|
    t.integer  "convertable_id"
    t.string   "convertable_type"
    t.string   "tool",                             null: false
    t.boolean  "is_successful",    default: false, null: false
    t.text     "response"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
  end

  add_index "conversions", ["convertable_type", "convertable_id"], name: "index_conversions_on_convertable_type_and_convertable_id", using: :btree

  create_table "critical_errors", force: :cascade do |t|
    t.string   "error_type",                              null: false
    t.string   "user_message",                            null: false
    t.boolean  "is_read",                 default: false, null: false
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.integer  "critical_errorable_id"
    t.string   "critical_errorable_type"
    t.text     "error_message"
    t.text     "backtrace"
    t.text     "error_detail"
  end

  add_index "critical_errors", ["critical_errorable_type", "critical_errorable_id"], name: "index_on_critical_errorable_type_and_critical_errorable_id", using: :btree
  add_index "critical_errors", ["error_type"], name: "index_critical_errors_on_error_type", using: :btree

  create_table "deal_entities", force: :cascade do |t|
    t.integer  "deal_id"
    t.integer  "entity_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.boolean  "is_client"
    t.boolean  "is_owner",   default: false
  end

  create_table "deal_entity_users", force: :cascade do |t|
    t.integer  "entity_user_id"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.boolean  "is_owner",       default: false, null: false
    t.string   "role"
    t.integer  "deal_entity_id"
  end

  add_index "deal_entity_users", ["entity_user_id"], name: "index_deal_entity_users_on_entity_user_id", using: :btree

  create_table "deal_type_templates", force: :cascade do |t|
    t.integer  "deal_type_id"
    t.integer  "template_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "deal_types", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "entity_id"
  end

  create_table "deals", force: :cascade do |t|
    t.string   "title",                         limit: 250
    t.date     "projected_close_date"
    t.string   "status"
    t.boolean  "is_active",                                 default: false
    t.datetime "created_at",                                                            null: false
    t.datetime "updated_at",                                                            null: false
    t.float    "deal_size"
    t.integer  "deal_type_id",                                                          null: false
    t.string   "client_matter_number"
    t.string   "deal_email"
    t.boolean  "has_diligence",                             default: true
    t.boolean  "sign_manually_by_default",                  default: false,             null: false
    t.boolean  "use_deal_email",                            default: true,              null: false
    t.string   "font_size",                                 default: "11"
    t.string   "font_type",                                 default: "Times New Roman"
    t.integer  "number_of_placeholder_signers",             default: 0,                 null: false
  end

  add_index "deals", ["is_active"], name: "index_deals_on_is_active", using: :btree
  add_index "deals", ["status"], name: "index_deals_on_status", using: :btree
  add_index "deals", ["title"], name: "index_deals_on_title", using: :btree

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",         default: 0,   null: false
    t.integer  "attempts",         default: 0,   null: false
    t.text     "handler",                        null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "progress_current", default: 0
    t.integer  "progress_max",     default: 100
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree

  create_table "dms_deal_storage_details", force: :cascade do |t|
    t.integer  "deal_id"
    t.integer  "dms_deal_storage_detailable_id"
    t.string   "dms_deal_storage_detailable_type"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
  end

  add_index "dms_deal_storage_details", ["deal_id"], name: "index_dms_deal_storage_details_on_deal_id", using: :btree
  add_index "dms_deal_storage_details", ["dms_deal_storage_detailable_type", "dms_deal_storage_detailable_id"], name: "index_deal_storage_details_on_polymorphic_detailable", using: :btree

  create_table "dms_entity_storages", force: :cascade do |t|
    t.integer "entity_id"
    t.integer "dms_entity_storageable_id"
    t.string  "dms_entity_storageable_type"
  end

  add_index "dms_entity_storages", ["dms_entity_storageable_type", "dms_entity_storageable_id"], name: "index_dms_entity_storages_to_dms_entity_storageable", using: :btree
  add_index "dms_entity_storages", ["entity_id"], name: "index_dms_entity_storages_on_entity_id", using: :btree

  create_table "dms_user_credentials", force: :cascade do |t|
    t.integer  "entity_user_id"
    t.integer  "dms_user_credentialable_id"
    t.string   "dms_user_credentialable_type"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

  add_index "dms_user_credentials", ["dms_user_credentialable_type", "dms_user_credentialable_id"], name: "index_dms_user_credentials_on_dms_user_credentialable", using: :btree
  add_index "dms_user_credentials", ["entity_user_id"], name: "index_dms_user_credentials_on_entity_user_id", using: :btree

  create_table "due_dates", force: :cascade do |t|
    t.datetime "value"
    t.integer  "due_dateable_id"
    t.string   "due_dateable_type"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.integer  "entity_id"
  end

  add_index "due_dates", ["due_dateable_id", "due_dateable_type"], name: "index_due_dates_on_due_dateable_id_and_due_dateable_type", using: :btree
  add_index "due_dates", ["due_dateable_type", "due_dateable_id"], name: "index_due_dates_on_due_dateable_type_and_due_dateable_id", using: :btree
  add_index "due_dates", ["entity_id"], name: "index_due_dates_on_entity_id", using: :btree

  create_table "entities", force: :cascade do |t|
    t.string   "name",                        limit: 250
    t.datetime "created_at",                                                  null: false
    t.datetime "updated_at",                                                  null: false
    t.boolean  "is_counsel",                              default: false,     null: false
    t.string   "type"
    t.string   "default_entity_storage_type",             default: "aws"
    t.string   "logo"
    t.string   "subdomain"
    t.boolean  "otp_required_for_login",                  default: false
    t.string   "product",                                 default: "closing"
  end

  add_index "entities", ["is_counsel"], name: "index_entities_on_is_counsel", using: :btree
  add_index "entities", ["name"], name: "index_entities_on_name", using: :btree
  add_index "entities", ["subdomain"], name: "index_entities_on_subdomain", using: :btree
  add_index "entities", ["type"], name: "index_entities_on_type", using: :btree

  create_table "entity_connections", force: :cascade do |t|
    t.integer  "my_entity_id"
    t.integer  "connected_entity_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_pending"
    t.string   "confirmation_token"
  end

  add_index "entity_connections", ["connected_entity_id"], name: "index_entity_connections_on_connected_entity_id", using: :btree
  add_index "entity_connections", ["my_entity_id"], name: "index_entity_connections_on_my_entity_id", using: :btree

  create_table "entity_users", force: :cascade do |t|
    t.integer  "entity_id"
    t.integer  "user_id"
    t.datetime "created_at",                                        null: false
    t.datetime "updated_at",                                        null: false
    t.string   "intros_completed",        default: [],                           array: true
    t.string   "email_digest_preference", default: "daily_digest",  null: false
    t.string   "role",                    default: "standard_user"
    t.string   "title"
    t.boolean  "is_default",              default: false,           null: false
    t.boolean  "can_see_all_deals",       default: false
  end

  add_index "entity_users", ["can_see_all_deals"], name: "index_entity_users_on_can_see_all_deals", using: :btree
  add_index "entity_users", ["email_digest_preference"], name: "index_entity_users_on_email_digest_preference", using: :btree
  add_index "entity_users", ["entity_id"], name: "index_entity_users_on_entity_id", using: :btree
  add_index "entity_users", ["user_id"], name: "index_entity_users_on_user_id", using: :btree

  create_table "esignature_notifications", force: :cascade do |t|
    t.string   "envelope_id",                          null: false
    t.string   "token",                                null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "signature_packet_id"
    t.string   "status",              default: "sent", null: false
    t.boolean  "docusign_posted",     default: false,  null: false
    t.boolean  "is_processing",       default: false,  null: false
  end

  add_index "esignature_notifications", ["docusign_posted"], name: "index_esignature_notifications_on_docusign_posted", using: :btree
  add_index "esignature_notifications", ["envelope_id"], name: "index_esignature_notifications_on_envelope_id", using: :btree
  add_index "esignature_notifications", ["is_processing"], name: "index_esignature_notifications_on_is_processing", using: :btree
  add_index "esignature_notifications", ["signature_packet_id"], name: "index_esignature_notifications_on_signature_packet_id", using: :btree
  add_index "esignature_notifications", ["status"], name: "index_esignature_notifications_on_status", using: :btree
  add_index "esignature_notifications", ["token"], name: "index_esignature_notifications_on_token", using: :btree

  create_table "esignature_providers", force: :cascade do |t|
    t.integer  "entity_id"
    t.string   "name",                null: false
    t.text     "authentication_info", null: false
    t.boolean  "is_demo",             null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "esignature_providers", ["authentication_info"], name: "index_esignature_providers_on_authentication_info", using: :btree
  add_index "esignature_providers", ["entity_id"], name: "index_esignature_providers_on_entity_id", using: :btree
  add_index "esignature_providers", ["is_demo"], name: "index_esignature_providers_on_is_demo", using: :btree
  add_index "esignature_providers", ["name"], name: "index_esignature_providers_on_name", using: :btree

  create_table "events", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "action"
    t.integer  "eventable_id"
    t.string   "eventable_type"
    t.integer  "entity_id",         null: false
    t.string   "module",            null: false
    t.integer  "entity_user_id",    null: false
    t.string   "associatable_type", null: false
    t.integer  "associatable_id",   null: false
  end

  add_index "events", ["entity_user_id"], name: "index_events_on_entity_user_id", using: :btree

  create_table "hdd_entity_storages", force: :cascade do |t|
    t.integer  "entity_id"
    t.string   "path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "hdd_entity_storages", ["entity_id"], name: "index_hdd_entity_storages_on_entity_id", using: :btree

  create_table "hdd_version_storages", force: :cascade do |t|
    t.string   "original_path"
    t.string   "converted_path"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "imanage10_deal_storage_details", force: :cascade do |t|
    t.string   "search_starting_point"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  create_table "imanage10_entity_storages", force: :cascade do |t|
    t.integer  "document_retention_minutes_duration"
    t.string   "imanage10_instance_url"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  create_table "imanage10_user_credentials", force: :cascade do |t|
    t.string   "access_token"
    t.string   "refresh_token"
    t.string   "customer_id"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.jsonb    "imanage10_user_object"
  end

  add_index "imanage10_user_credentials", ["imanage10_user_object"], name: "index_imanage10_user_credentials_on_imanage10_user_object", using: :btree

  create_table "imanage10_version_storages", force: :cascade do |t|
    t.jsonb    "imanage10_version_object"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "imanage10_version_storages", ["imanage10_version_object"], name: "index_on_imanage10_version_object", using: :gin

  create_table "licenses", force: :cascade do |t|
    t.integer  "entity_id",  null: false
    t.datetime "start_date", null: false
    t.datetime "end_date",   null: false
    t.datetime "ended_on"
    t.integer  "deal_count", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "licenses", ["deal_count"], name: "index_licenses_on_deal_count", using: :btree
  add_index "licenses", ["end_date"], name: "index_licenses_on_end_date", using: :btree
  add_index "licenses", ["ended_on"], name: "index_licenses_on_ended_on", using: :btree
  add_index "licenses", ["start_date"], name: "index_licenses_on_start_date", using: :btree

  create_table "login_activities", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "email",                        null: false
    t.string   "activity",   default: "login", null: false
    t.string   "ip_address",                   null: false
    t.text     "user_agent",                   null: false
    t.text     "referrer"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

  add_index "login_activities", ["activity"], name: "index_login_activities_on_activity", using: :btree
  add_index "login_activities", ["email"], name: "index_login_activities_on_email", using: :btree
  add_index "login_activities", ["user_id"], name: "index_login_activities_on_user_id", using: :btree

  create_table "login_tokens", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "deal_id"
    t.string   "token",                    null: false
    t.string   "is_active",  default: "t", null: false
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "login_tokens", ["deal_id"], name: "index_login_tokens_on_deal_id", using: :btree
  add_index "login_tokens", ["user_id"], name: "index_login_tokens_on_user_id", using: :btree

  create_table "mailsafe_exceptions", force: :cascade do |t|
    t.string   "pattern",                   null: false
    t.boolean  "allow",      default: true, null: false
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "net_documents_deal_storage_details", force: :cascade do |t|
    t.string "search_starting_point"
  end

  create_table "net_documents_entity_storages", force: :cascade do |t|
    t.integer  "document_retention_minutes_duration"
    t.string   "instance_location"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  create_table "net_documents_user_credentials", force: :cascade do |t|
    t.string   "refresh_token"
    t.string   "access_token"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "net_documents_version_storages", force: :cascade do |t|
    t.jsonb    "nd_version_object"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  add_index "net_documents_version_storages", ["nd_version_object"], name: "index_net_documents_version_storages_on_nd_version_object", using: :gin

  create_table "notes", force: :cascade do |t|
    t.integer  "entity_user_id"
    t.text     "text"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.integer  "noteable_id"
    t.string   "noteable_type"
    t.boolean  "is_public",      default: false, null: false
  end

  add_index "notes", ["entity_user_id"], name: "index_notes_on_entity_user_id", using: :btree
  add_index "notes", ["is_public"], name: "index_notes_on_is_public", using: :btree
  add_index "notes", ["noteable_id", "noteable_type"], name: "index_notes_on_noteable_id_and_noteable_type", using: :btree

  create_table "question_answers", force: :cascade do |t|
    t.integer  "question_response_id"
    t.string   "type"
    t.integer  "numeric_value"
    t.integer  "option_id"
    t.string   "other_option_value"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.string   "text_value"
    t.date     "date_value"
  end

  add_index "question_answers", ["question_response_id"], name: "index_question_answers_on_question_response_id", using: :btree

  create_table "question_dependencies", force: :cascade do |t|
    t.integer  "question_id"
    t.integer  "question_option_id"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.integer  "dependent_question_id"
  end

  add_index "question_dependencies", ["dependent_question_id"], name: "index_question_dependencies_on_dependent_question_id", using: :btree
  add_index "question_dependencies", ["question_id"], name: "index_question_dependencies_on_question_id", using: :btree
  add_index "question_dependencies", ["question_option_id"], name: "index_question_dependencies_on_question_option_id", using: :btree

  create_table "question_options", force: :cascade do |t|
    t.integer  "question_id"
    t.string   "label"
    t.integer  "position"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "question_options", ["question_id"], name: "index_question_options_on_question_id", using: :btree

  create_table "question_responses", force: :cascade do |t|
    t.integer  "question_id"
    t.integer  "deal_id"
    t.integer  "deal_entity_user_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  add_index "question_responses", ["deal_entity_user_id"], name: "index_question_responses_on_deal_entity_user_id", using: :btree
  add_index "question_responses", ["deal_id"], name: "index_question_responses_on_deal_id", using: :btree
  add_index "question_responses", ["question_id"], name: "index_question_responses_on_question_id", using: :btree

  create_table "questionnaires", force: :cascade do |t|
    t.integer  "deal_type_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "questionnaires", ["deal_type_id"], name: "index_questionnaires_on_deal_type_id", using: :btree

  create_table "questions", force: :cascade do |t|
    t.integer  "questionnaire_id"
    t.string   "type"
    t.string   "field"
    t.string   "validation_regex"
    t.string   "validation_error_key"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.integer  "position"
    t.string   "unit_type"
    t.string   "value_key"
    t.boolean  "is_active",            default: true
  end

  add_index "questions", ["questionnaire_id"], name: "index_questions_on_questionnaire_id", using: :btree

  create_table "reminders", force: :cascade do |t|
    t.integer  "entity_user_id"
    t.integer  "value"
    t.string   "unit"
    t.string   "message"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.integer  "due_date_id"
  end

  add_index "reminders", ["due_date_id"], name: "index_reminders_on_due_date_id", using: :btree
  add_index "reminders", ["entity_user_id"], name: "index_reminders_on_entity_user_id", using: :btree

  create_table "responsible_parties", force: :cascade do |t|
    t.integer  "deal_entity_id"
    t.integer  "tree_element_id"
    t.integer  "deal_entity_user_id"
    t.boolean  "is_active"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  add_index "responsible_parties", ["deal_entity_id"], name: "index_responsible_parties_on_deal_entity_id", using: :btree
  add_index "responsible_parties", ["deal_entity_user_id"], name: "index_responsible_parties_on_deal_entity_user_id", using: :btree
  add_index "responsible_parties", ["is_active"], name: "index_responsible_parties_on_is_active", using: :btree
  add_index "responsible_parties", ["tree_element_id"], name: "index_responsible_parties_on_tree_element_id", using: :btree

  create_table "role_links", force: :cascade do |t|
    t.integer  "deal_entity_id"
    t.integer  "role_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.string   "label"
  end

  add_index "role_links", ["role_id"], name: "index_role_links_on_role_id", using: :btree

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.integer  "roleable_id"
    t.string   "roleable_type"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "roles", ["name"], name: "index_roles_on_name", using: :btree
  add_index "roles", ["roleable_type", "roleable_id"], name: "index_roles_on_roleable_type_and_roleable_id", using: :btree

  create_table "scheduled_jobs", force: :cascade do |t|
    t.integer "schedulable_id"
    t.string  "schedulable_type"
    t.integer "job_id"
  end

  add_index "scheduled_jobs", ["job_id"], name: "index_scheduled_jobs_on_job_id", using: :btree
  add_index "scheduled_jobs", ["schedulable_type", "schedulable_id"], name: "index_scheduled_jobs_on_schedulable_type_and_schedulable_id", using: :btree

  create_table "see_unity_imanage_deal_storage_details", force: :cascade do |t|
    t.string   "search_starting_point"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  create_table "see_unity_imanage_entity_storages", force: :cascade do |t|
    t.integer  "document_retention_minutes_duration"
    t.string   "see_unity_instance_url"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "connector_id"
    t.string   "database_id"
    t.string   "matter_worklist_repository_id"
    t.string   "my_matters_repository_id"
    t.string   "my_favorites_repository_id"
    t.string   "document_worklist_repository_id"
  end

  create_table "see_unity_imanage_user_credentials", force: :cascade do |t|
    t.string   "access_token",  null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "refresh_token", null: false
  end

  create_table "see_unity_imanage_version_storages", force: :cascade do |t|
    t.jsonb    "see_unity_imanage_version_object"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
  end

  add_index "see_unity_imanage_version_storages", ["see_unity_imanage_version_object"], name: "index_on_see_unity_imanage_version_object", using: :gin

  create_table "signature_entities", force: :cascade do |t|
    t.string   "name"
    t.string   "ancestry"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.string   "signing_authority"
    t.string   "title"
    t.integer  "block_id"
  end

  add_index "signature_entities", ["block_id"], name: "index_signature_entities_on_block_id", using: :btree

  create_table "signature_groups", force: :cascade do |t|
    t.integer  "deal_id"
    t.string   "name",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "signature_groups", ["deal_id"], name: "index_signature_groups_on_deal_id", using: :btree

  create_table "signature_packet_review_documents", force: :cascade do |t|
    t.integer  "tree_element_id"
    t.integer  "signature_packet_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "file_name"
    t.string   "file_type"
  end

  add_index "signature_packet_review_documents", ["signature_packet_id"], name: "index_signature_packet_review_documents_on_signature_packet_id", using: :btree
  add_index "signature_packet_review_documents", ["tree_element_id"], name: "index_signature_packet_review_documents_on_tree_element_id", using: :btree

  create_table "signature_packet_signature_page_collections", force: :cascade do |t|
    t.integer  "signature_page_id"
    t.integer  "signature_packet_id"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.integer  "signature_page_collection_id"
  end

  add_index "signature_packet_signature_page_collections", ["signature_packet_id"], name: "signature_packet_signature_page_collections_on_signature_packet", using: :btree
  add_index "signature_packet_signature_page_collections", ["signature_page_collection_id"], name: "signature_packet_signature_pages_on_signature_page_collection", using: :btree
  add_index "signature_packet_signature_page_collections", ["signature_page_id"], name: "signature_packet_signature_page_collections_on_signature_page", using: :btree

  create_table "signature_packets", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "deal_id"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.datetime "sent_at"
    t.datetime "completed_at"
    t.string   "docusign_envelope_id"
    t.datetime "reminder_email_timestamp"
    t.integer  "sent_by_user_id"
    t.integer  "file_size"
    t.string   "file_type"
    t.string   "signed_file_id"
    t.integer  "signed_file_size"
    t.string   "signed_file_type"
    t.datetime "upload_attempted_at"
    t.string   "copy_to"
    t.text     "message"
    t.string   "packet_type",              null: false
  end

  add_index "signature_packets", ["deal_id"], name: "index_signature_packets_on_deal_id", using: :btree
  add_index "signature_packets", ["packet_type"], name: "index_signature_packets_on_packet_type", using: :btree
  add_index "signature_packets", ["user_id"], name: "index_signature_packets_on_user_id", using: :btree

  create_table "signature_page_collections", force: :cascade do |t|
    t.integer  "tree_element_signature_group_id"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.integer  "block_collection_id"
    t.string   "unique_key"
  end

  add_index "signature_page_collections", ["block_collection_id"], name: "index_signature_page_collections_on_block_collection_id", using: :btree
  add_index "signature_page_collections", ["tree_element_signature_group_id"], name: "signature_page_collections_on_tree_element_signature_group", using: :btree
  add_index "signature_page_collections", ["unique_key"], name: "index_signature_page_collections_on_unique_key", using: :btree

  create_table "signature_page_executions", force: :cascade do |t|
    t.integer  "signature_page_id"
    t.integer  "version_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  add_index "signature_page_executions", ["signature_page_id"], name: "index_signature_page_executions_on_signature_page_id", using: :btree
  add_index "signature_page_executions", ["version_id"], name: "index_signature_page_executions_on_version_id", using: :btree

  create_table "signature_pages", force: :cascade do |t|
    t.integer  "signing_capacity_id"
    t.string   "old_unique_key"
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
    t.string   "signature_status"
    t.datetime "signature_status_timestamp"
    t.integer  "file_size"
    t.string   "file_type"
    t.integer  "tree_element_signature_group_id"
    t.string   "signed_file_id"
    t.integer  "signed_file_size"
    t.string   "signed_file_type"
    t.boolean  "is_custom",                       default: false, null: false
    t.integer  "packet_page_number"
    t.boolean  "is_enabled",                      default: true
    t.boolean  "is_executing",                    default: false
    t.boolean  "use_template",                    default: false, null: false
    t.integer  "signature_page_collection_id"
    t.integer  "file_page_to_sign"
  end

  add_index "signature_pages", ["is_custom"], name: "index_signature_pages_on_is_custom", using: :btree
  add_index "signature_pages", ["is_enabled"], name: "index_signature_pages_on_is_enabled", using: :btree
  add_index "signature_pages", ["is_executing"], name: "index_signature_pages_on_is_executing", using: :btree
  add_index "signature_pages", ["old_unique_key"], name: "index_signature_pages_on_old_unique_key", using: :btree
  add_index "signature_pages", ["packet_page_number"], name: "index_signature_pages_on_packet_page_number", using: :btree
  add_index "signature_pages", ["signature_page_collection_id"], name: "signature_page_collections_on_signature_pages", using: :btree
  add_index "signature_pages", ["signing_capacity_id"], name: "index_signature_pages_on_signing_capacity_id", using: :btree

  create_table "signature_tabs", force: :cascade do |t|
    t.integer "signature_page_id"
    t.string  "tab_type"
    t.string  "label"
    t.integer "x_coordinate"
    t.integer "y_coordinate"
  end

  add_index "signature_tabs", ["signature_page_id"], name: "index_signature_tabs_on_signature_page_id", using: :btree
  add_index "signature_tabs", ["tab_type"], name: "index_signature_tabs_on_tab_type", using: :btree

  create_table "signing_capacities", force: :cascade do |t|
    t.integer  "signature_entity_id"
    t.integer  "user_id"
    t.string   "title"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.integer  "placeholder_id"
    t.integer  "block_id"
    t.string   "first_name"
    t.string   "last_name"
  end

  add_index "signing_capacities", ["block_id"], name: "index_signing_capacities_on_block_id", using: :btree
  add_index "signing_capacities", ["signature_entity_id"], name: "index_signing_capacities_on_signature_entity_id", using: :btree
  add_index "signing_capacities", ["user_id"], name: "index_signing_capacities_on_user_id", using: :btree

  create_table "sso_provider_configurations", force: :cascade do |t|
    t.integer  "sso_provider_configurationable_id"
    t.string   "sso_provider_configurationable_type"
    t.integer  "entity_id"
    t.string   "provider_type"
    t.boolean  "is_active",                           default: true, null: false
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
  end

  add_index "sso_provider_configurations", ["entity_id"], name: "index_sso_provider_configurations_on_entity_id", using: :btree
  add_index "sso_provider_configurations", ["is_active"], name: "index_sso_provider_configurations_on_is_active", using: :btree
  add_index "sso_provider_configurations", ["sso_provider_configurationable_type", "sso_provider_configurationable_id"], name: "index_on_prov_configurable_type_and_prov_configurable_id", using: :btree

  create_table "starred_deals", force: :cascade do |t|
    t.integer  "entity_user_id"
    t.integer  "deal_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "temp_uploads", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "file_name",      null: false
    t.string   "original_path"
    t.string   "converted_path"
    t.string   "preview_path"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  add_index "temp_uploads", ["user_id"], name: "index_temp_uploads_on_user_id", using: :btree

  create_table "templates", force: :cascade do |t|
    t.string   "name"
    t.string   "thumbnail"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "entity_id"
  end

  create_table "thumbnail_storages", force: :cascade do |t|
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.integer  "thumbnail_storageable_id"
    t.string   "thumbnail_storageable_type"
  end

  add_index "thumbnail_storages", ["thumbnail_storageable_type", "thumbnail_storageable_id"], name: "thumbnail_storages_on_thumbnail_storable", using: :btree

  create_table "to_dos", force: :cascade do |t|
    t.integer  "tree_element_id",                     null: false
    t.integer  "deal_entity_id",                      null: false
    t.integer  "deal_entity_user_id"
    t.integer  "creator_id",                          null: false
    t.datetime "due_at"
    t.boolean  "is_complete",         default: false
    t.string   "text"
    t.integer  "position"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "to_dos", ["creator_id"], name: "index_to_dos_on_creator_id", using: :btree
  add_index "to_dos", ["deal_entity_id"], name: "index_to_dos_on_deal_entity_id", using: :btree
  add_index "to_dos", ["deal_entity_user_id"], name: "index_to_dos_on_deal_entity_user_id", using: :btree
  add_index "to_dos", ["is_complete"], name: "index_to_dos_on_is_complete", using: :btree
  add_index "to_dos", ["tree_element_id"], name: "index_to_dos_on_tree_element_id", using: :btree

  create_table "tree_element_restrictions", force: :cascade do |t|
    t.integer "tree_element_id"
    t.integer "restrictable_id"
    t.string  "restrictable_type"
    t.boolean "inherit",           default: false
  end

  add_index "tree_element_restrictions", ["restrictable_type", "restrictable_id"], name: "index_on_restrictable_id_and_restrictable_type", using: :btree
  add_index "tree_element_restrictions", ["tree_element_id"], name: "index_tree_element_restrictions_on_tree_element_id", using: :btree

  create_table "tree_element_signature_groups", force: :cascade do |t|
    t.integer  "signature_entity_id"
    t.integer  "tree_element_id"
    t.string   "alias"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.boolean  "show_group_name",     default: true, null: false
    t.integer  "signature_group_id"
  end

  add_index "tree_element_signature_groups", ["signature_entity_id"], name: "index_tree_element_signature_groups_on_signature_entity_id", using: :btree
  add_index "tree_element_signature_groups", ["tree_element_id"], name: "index_tree_element_signature_groups_on_tree_element_id", using: :btree

  create_table "tree_elements", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.string   "type"
    t.integer  "owner_id"
    t.string   "owner_type"
    t.string   "ancestry"
    t.string   "signature_type"
    t.boolean  "is_post_closing",                   default: false, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "signature_required",                default: false, null: false
    t.boolean  "sign_manually",                     default: false, null: false
    t.string   "signature_page_document_name"
    t.boolean  "show_signature_page_footer",        default: true,  null: false
    t.boolean  "show_signature_page_header",        default: false, null: false
    t.string   "signature_page_header_text"
    t.boolean  "show_address_on_signature_page",    default: false, null: false
    t.integer  "position"
    t.integer  "number_of_signature_page_copies",   default: 1
    t.boolean  "show_signing_capacity_date_signed", default: false, null: false
    t.text     "details"
  end

  add_index "tree_elements", ["ancestry", "owner_id"], name: "index_tree_elements_on_ancestry_and_owner_id", using: :btree

  create_table "unmatched_signature_upload_pages", force: :cascade do |t|
    t.integer  "page_number"
    t.integer  "signature_page_id"
    t.string   "status"
    t.integer  "unmatched_signature_upload_id"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  add_index "unmatched_signature_upload_pages", ["signature_page_id"], name: "index_unmatched_signature_upload_pages_on_signature_page_id", using: :btree
  add_index "unmatched_signature_upload_pages", ["status"], name: "index_unmatched_signature_upload_pages_on_status", using: :btree
  add_index "unmatched_signature_upload_pages", ["unmatched_signature_upload_id"], name: "unmatched_signature_upload_pages_on_unmatched_uploads", using: :btree

  create_table "unmatched_signature_uploads", force: :cascade do |t|
    t.string   "file_name",                       null: false
    t.integer  "uploader_id"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.integer  "deal_id",                         null: false
    t.boolean  "is_client_upload", default: true, null: false
  end

  add_index "unmatched_signature_uploads", ["deal_id"], name: "index_unmatched_signature_uploads_on_deal_id", using: :btree
  add_index "unmatched_signature_uploads", ["uploader_id"], name: "index_unmatched_signature_uploads_on_uploader_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "phone",                     limit: 15
    t.string   "address"
    t.string   "email"
    t.string   "encrypted_password",                   default: "",                           null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                        default: 0,                            null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.boolean  "is_active"
    t.string   "role"
    t.datetime "created_at",                                                                  null: false
    t.datetime "updated_at",                                                                  null: false
    t.string   "avatar"
    t.string   "fax"
    t.string   "city"
    t.string   "state"
    t.string   "zip"
    t.integer  "failed_attempts",                      default: 0,                            null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.string   "provider"
    t.string   "uid"
    t.boolean  "is_enabled",                           default: true
    t.string   "unique_key"
    t.string   "authentication_token",      limit: 30
    t.text     "intros_completed",                     default: [],                                        array: true
    t.string   "encrypted_otp_secret"
    t.string   "encrypted_otp_secret_iv"
    t.string   "encrypted_otp_secret_salt"
    t.integer  "consumed_timestep"
    t.boolean  "otp_required_for_login"
    t.string   "otp_backup_codes",                                                                         array: true
    t.string   "time_zone",                            default: "Eastern Time (US & Canada)"
  end

  add_index "users", ["authentication_token"], name: "index_users_on_authentication_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["is_active"], name: "index_users_on_is_active", using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["role"], name: "index_users_on_role", using: :btree
  add_index "users", ["unique_key"], name: "index_users_on_unique_key", using: :btree
  add_index "users", ["unlock_token"], name: "index_users_on_unlock_token", unique: true, using: :btree

  create_table "versions", force: :cascade do |t|
    t.integer  "attachment_id"
    t.integer  "file_size"
    t.string   "file_type"
    t.integer  "uploader_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "status_set_at"
    t.string   "file_name"
    t.string   "upload_method"
    t.integer  "position"
    t.string   "status"
    t.integer  "version_storageable_id"
    t.string   "version_storageable_type"
    t.integer  "page_count"
    t.integer  "executed_against_version_id"
    t.string   "sending_to_dms_status"
  end

  add_index "versions", ["attachment_id"], name: "index_versions_on_attachment_id", using: :btree
  add_index "versions", ["executed_against_version_id"], name: "index_versions_on_executed_against_version_id", using: :btree
  add_index "versions", ["sending_to_dms_status"], name: "index_versions_on_sending_to_dms_status", using: :btree
  add_index "versions", ["version_storageable_type", "version_storageable_id"], name: "versions_on_version_storageable", using: :btree

  add_foreign_key "aws_entity_storages", "entities", on_delete: :cascade
  add_foreign_key "block_collections", "signature_groups"
  add_foreign_key "blocks", "block_collections"
  add_foreign_key "closing_book_documents", "closing_book_sections", on_delete: :cascade
  add_foreign_key "closing_book_documents", "tree_elements", column: "document_id", on_delete: :cascade
  add_foreign_key "closing_book_sections", "closing_books", on_delete: :cascade
  add_foreign_key "closing_books", "deal_entity_users", column: "creator_id", on_delete: :cascade
  add_foreign_key "closing_books", "deals", on_delete: :cascade
  add_foreign_key "completion_statuses", "deal_entities", on_delete: :cascade
  add_foreign_key "completion_statuses", "tree_elements", on_delete: :cascade
  add_foreign_key "deal_entities", "deals", on_delete: :cascade
  add_foreign_key "deal_entities", "entities", on_delete: :cascade
  add_foreign_key "deal_entity_users", "deal_entities", on_delete: :cascade
  add_foreign_key "deal_entity_users", "entity_users", on_delete: :cascade
  add_foreign_key "dms_deal_storage_details", "deals"
  add_foreign_key "dms_entity_storages", "entities"
  add_foreign_key "due_dates", "entities", on_delete: :cascade
  add_foreign_key "entity_users", "entities", on_delete: :cascade
  add_foreign_key "esignature_providers", "entities"
  add_foreign_key "events", "entities", on_delete: :cascade
  add_foreign_key "hdd_entity_storages", "entities", on_delete: :cascade
  add_foreign_key "licenses", "entities", on_delete: :cascade
  add_foreign_key "login_tokens", "deals", on_delete: :cascade
  add_foreign_key "login_tokens", "users", on_delete: :cascade
  add_foreign_key "question_answers", "question_responses", on_delete: :cascade
  add_foreign_key "question_dependencies", "question_options", on_delete: :cascade
  add_foreign_key "question_dependencies", "questions", column: "dependent_question_id", on_delete: :cascade
  add_foreign_key "question_dependencies", "questions", on_delete: :cascade
  add_foreign_key "question_options", "questions", on_delete: :cascade
  add_foreign_key "question_responses", "deal_entity_users", on_delete: :cascade
  add_foreign_key "question_responses", "deals", on_delete: :cascade
  add_foreign_key "question_responses", "questions", on_delete: :cascade
  add_foreign_key "questionnaires", "deal_types", on_delete: :cascade
  add_foreign_key "questions", "questionnaires", on_delete: :cascade
  add_foreign_key "reminders", "entity_users", on_delete: :cascade
  add_foreign_key "role_links", "roles", on_delete: :cascade
  add_foreign_key "signature_groups", "deals"
  add_foreign_key "signature_packet_review_documents", "signature_packets", on_delete: :cascade
  add_foreign_key "signature_packet_review_documents", "tree_elements", on_delete: :cascade
  add_foreign_key "signature_packet_signature_page_collections", "signature_packets", on_delete: :cascade
  add_foreign_key "signature_packets", "deals", on_delete: :cascade
  add_foreign_key "signature_packets", "users", on_delete: :cascade
  add_foreign_key "signature_page_collections", "tree_element_signature_groups"
  add_foreign_key "signature_page_executions", "signature_pages", on_delete: :cascade
  add_foreign_key "signature_page_executions", "versions", on_delete: :cascade
  add_foreign_key "signature_pages", "signature_page_collections", on_delete: :cascade
  add_foreign_key "signature_pages", "signing_capacities", on_delete: :cascade
  add_foreign_key "signature_tabs", "signature_pages", on_delete: :cascade
  add_foreign_key "signing_capacities", "signature_entities", on_delete: :cascade
  add_foreign_key "signing_capacities", "users", on_delete: :cascade
  add_foreign_key "temp_uploads", "users", on_delete: :cascade
  add_foreign_key "to_dos", "deal_entities", on_delete: :cascade
  add_foreign_key "to_dos", "deal_entity_users"
  add_foreign_key "to_dos", "deal_entity_users", column: "creator_id"
  add_foreign_key "to_dos", "tree_elements", on_delete: :cascade
  add_foreign_key "tree_element_restrictions", "tree_elements", on_delete: :cascade
  add_foreign_key "tree_element_signature_groups", "signature_groups"
  add_foreign_key "tree_element_signature_groups", "tree_elements", on_delete: :cascade
  add_foreign_key "unmatched_signature_upload_pages", "signature_pages", on_delete: :cascade
  add_foreign_key "unmatched_signature_upload_pages", "unmatched_signature_uploads", on_delete: :cascade
  add_foreign_key "unmatched_signature_uploads", "deals", on_delete: :cascade
  add_foreign_key "unmatched_signature_uploads", "users", column: "uploader_id", on_delete: :cascade
end
