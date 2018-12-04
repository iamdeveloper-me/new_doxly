require 'routes/exceptions_app_constraint'
require 'routes/client_app_constraint'
require 'routes/counsel_app_constraint'
require 'routes/signer_app_constraint'

Doxly::Application.routes.draw do

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  concern :account_settings do
    get :my_profile, to: 'account_settings#my_profile'
    put :my_profile, to: 'account_settings#my_profile_save'
    get :integrations, to: 'account_settings#integrations'
    get :change_email, to: 'account_settings#change_email'
    post :change_email, to: 'account_settings#change_email_save'
    put :reconfirm_change_email, to: 'account_settings#reconfirm_change_email'
    put :cancel_change_email, to: 'account_settings#cancel_change_email'
    get :change_password, to: 'account_settings#change_password'
    put :change_password, to: 'account_settings#change_password_save'
    get :two_factor_authentication_settings, to: 'account_settings#two_factor_authentication_settings'
  end

  concern :entity_settings do
    get :entity_profile, to: 'entity_settings#entity_profile'
    post :entity_profile, to: 'entity_settings#entity_profile_save'
  end

  concern :starring do
    member do
      get :star
      get :unstar
    end
  end

  concern :documentable do
    get :mark_as_final
    get :undo_final
    get :view_document
  end

  concern :collection_refresh_list do
    get :refresh_list, :on => :collection
  end

  concern :working_group_intro do
    get :completed_working_group_intro, :on => :collection
    put :completed_working_group_intro, :on => :collection, to: 'roles#update_completed_working_group_intro'
  end

  concern :view_and_download do
    get :view, on: :member
    get :download, on: :member
  end

  def download_helpers(scope)
    get "/uploads/deals/:id/closing_books/:id/attachment/:filename",  :controller => "closing_books",  :action => "download_attachment", :constraints => {:filename => /.+(\/.+)*/ }, :as => "download_closing_book_attachment_as_#{scope}"
    get "/uploads/deals/:id/closing_books/:id/logo/:filename",  :controller => "closing_books",  :action => "download_closing_book_logo", :constraints => {:filename => /.+(\/.+)*/ }, :as => "download_closing_book_client_logo_as_#{scope}"
  end

  # For exception handling
  constraints ExceptionsAppConstraint do
    get '/404' => 'errors#render_not_found'
    get '/500' => 'errors#render_internal_server_error'
    get '*path' => 'errors#render_not_found'
  end

  get :register, to: 'registration#edit'
  put :register, to: 'registration#update'
  get :login_tokens, to: 'login_tokens#show'

  # For receiving the notifications from esignature providers
  post 'esignature_notifications' => 'esignature_notifications#index'

  match 'sso/adfs/federation_metadata(*path)' => 'sso#adfs_metadata', :via => :get

  constraints :subdomain => /^(?!api)(\w+)/ do
    scope :module => 'app' do
      devise_for :users, :path => '', :module => 'app/devise', :skip => [:passwords]
      devise_scope :user do
        post :forgot_password, :to => 'devise/passwords#create', :as => :user_password
        get :forgot_password, :to => 'devise/passwords#new', :as => :new_user_password
        get 'forgot_password/edit', :to => 'devise/passwords#edit', :as => :edit_user_password
        put :forgot_password, :to => 'devise/passwords#update'
        post 'auth/:saml/callback' => 'devise/omniauth_callbacks#success'
        get 'auth/:saml/setup' => 'devise/omniauth_callbacks#setup'

        unauthenticated do
          root to: 'devise/sessions#new'
        end
      end

      get :time_zone, to: 'time_zone#set'

      get :entity_switch, to: 'entity_switch#index'
      post :entity_switch, to: 'entity_switch#switch'

      get :refresh_api_auth, to: 'refresh_api_authentication#index'

      get "/uploads/user/:id/avatar",  :controller => "users",  :action => "show_avatar", :as => "show_user_avatar"

      resources :zendesk_sessions, only: [:index, :new]

      constraints CounselAppConstraint do
        scope :module => 'counsel' do
          get :docusign_settings, to: 'entity_settings#docusign_settings'
          post :docusign_settings, to: 'entity_settings#docusign_settings_save'
          get :licenses, to: 'entity_settings#licenses'
          concerns :account_settings, :entity_settings
          resources :net_documents_user_credentials, only: [] do
            get :authorize, on: :collection
          end
          resources :see_unity_imanage_user_credentials, only: [:create, :update]
          resources :imanage10_user_credentials, only: [:create, :update]
          resources :deals, :except => [:destroy, :show], :concerns => :collection_refresh_list do
            put :set_critical_errors_as_read
            resources :attachments do
              resources :versions, :concerns => :view_and_download
            end
            get :executed_versions
            get :export_tracker
            resources :closing_books do
              get :download_closing_book, :on => :member
              get :upload_cover_page, :on => :collection
              post :uploaded_cover_page, :on => :collection
              get :view_cover_page, :on => :collection
              get :show_cover_page, :on => :collection
              delete :remove_cover_page, :on => :collection
            end
            resources :questionnaires, :except => :destroy do
              post :save_responses, :on => :collection
            end
            get :voting_threshold
            resources :signature_groups do
              resources :block_collections, only: [] do
                resources :signature_entities, only: [] do
                  member do
                    get :include
                    get :exclude
                  end
                end
                resources :signing_capacities do
                  member do
                    get :include
                    get :exclude
                  end
                end
              end
              get  :import_from_working_group
              post :imported_from_working_group
            end
            resources :signature_pages, :concerns => :view_and_download do
              get :upload_custom_signature_page
              post :uploaded_custom_signature_page
              get :choose_from_document
              get :document_page_thumbnail
              get :view_document_page
              post :process_choose_from_document
              get :remove_custom_signature_page
              get :show_custom_signature_page
              get :edit_custom_signature_page
              get :signature_groups, :on => :collection
              get :show_signature_page, :on => :collection
              get :show_signature_page_entity, :on => :collection
              get :view_signature_page, :on => :collection
              get :download_thumbnail_sprite, on: :member
              get :download_custom_page_thumbnail, on: :member
              resources :signature_tabs, only: [:new, :create] do
                get :remove
              end
            end
            resources :signature_packets, :concerns => :view_and_download do
              get :display_signature_packet
              delete :void_signature_packet
              collection do
                get    :send_packets_confirm
                post   :send_packets
                get    :send_packet_wizard
                post   :send_packet
                get    :upload_manual_signatures
                post   :uploaded_manual_signatures
                get    :manage_signature_packets
                get    :view_signature_pages
                get    :send_reminder
                post   :remind_signer
                get    :set_default_signature_type_confirm
                get    :set_default_signature_type
                get    :cancel_set_default_signature_type
              end
            end
            resources :roles, concerns: :working_group_intro
            concerns :starring
            get :select_client, :on => :collection
            post :select_client_confirm, :on => :collection
            get :add_address, :on => :collection
            get :signature_page_settings

            resources :unmatched_signature_uploads do
              resources :unmatched_signature_upload_pages, concerns: :view_and_download
            end

            member do
              get :archive
              get :unarchive
              get :close
              get :reopen
            end

            resources :deal_entities, only: [:index, :new, :create, :destroy] do
              get :add_address, :on => :collection
              resources :deal_organization_users, except: [:index, :edit, :update, :show] do
                get :prepare_deal_invitation
                post :send_deal_invitation
              end
            end
            resources :deal_individual_users, only: [:index, :new, :create, :destroy] do
              get :prepare_deal_invitation
              post :send_deal_invitation
            end
            resources :categories do
              resources :tree_elements do
                get :edit_signature_page_footer
                get :edit_signature_page_header
                put :set_signature_page_header, :on => :member
                put :set_signature_page_footer, :on => :member
                get :set_signature_type
                get :set_show_footer, :on => :member
                get :set_show_header, :on => :member
                get :set_show_address, :on => :member
                get :set_show_date_signed, :on => :member
                put :update_multiple_pages, :on => :member
                get :render_redline_pdf
                resources :tree_element_signature_groups do
                  get :set_show_group_name, :on => :member
                end
                resources :attachments do
                  resources :versions, :concerns => :view_and_download do
                    get :sync_thumbnails
                    get :download_thumbnail_sprite, on: :member
                  end
                end
              end
              resources :deal_templates do
                get :select, :on => :member
                get :apply,  :on => :member
              end
            end
          end

          resources :reports, :only => :index

          resources :entities, only: [:index, :update], :concerns => :collection_refresh_list do
            collection do
              get :search
              get :refresh_list
            end
            resources :entity_users, except: [:destroy] do
              get :resend_invitation, :on => :member
            end
          end

          resources :entity_connections, except: [:index, :show, :destroy] do
            collection do
              get :resend_connection_invitation
              get :add_address
            end
          end

          resources :temp_uploads, only: [], concerns: :view_and_download do
            get :preview, on: :member
          end

          root to: 'deals#index', :as => :counsel_app_root

          download_helpers('counsel')
        end
      end

      constraints ClientAppConstraint do
        scope :module => 'client' do
          concerns :account_settings

          resources :entities, only: [:index]
          resources :entity_connections, only: [] do
            collection do
              get :confirm_entity_connection
            end
          end

          resources :deals, :only => :index, :concerns => :collection_refresh_list do
            resources :attachments do
              resources :versions, :concerns => :view_and_download
            end
            concerns :starring

            resources :closing_books, only: [:index, :show] do
              get :download_closing_book, :on => :member
              get :show_logo, :on => :member
            end
            resources :roles, only: :index, concerns: :working_group_intro
            resources :categories do
              resources :tree_elements, :only => [] do
                resources :attachments, :only => [] do
                  resources :versions, :concerns => :view_and_download
                end
              end
            end
            get :signature_tracker, to: 'signature_tracker#index'
          end
          download_helpers('client')

          root to: 'deals#index', :as => :client_app_root
        end
      end

      constraints SignerAppConstraint do
        scope :module => 'signer' do
          resources :signature_packets, only: [:index, :show], :concerns => :view_and_download do
            resources :signature_packet_review_documents, only: [], :concerns => :view_and_download do
              get :view_document
            end
            get :sign_packet
            get :signed_packet
            get :view_completed_packet
            get :view_completed_packet_done
            get :manual_signatures
            get :upload_signature_pages
            get :download_unsigned_packet
            post :uploads_queue
            delete :delete_from_uploads_queue
            get :docusign_signatures
            post :upload_manual_signatures
            post :uploaded_manual_signatures
            collection do
              get :deal_signature_packets
              get :find_packet
              get :complete
            end
          end

          resources :deals, :only => [] do
            resources :categories, :only => [] do
              resources :tree_elements, :only => [] do
                resources :attachments, :only => [] do
                  resources :versions, :concerns => :view_and_download
                end
              end
            end
          end

          root to: 'signature_packets#index', :as => :signer_app_root
        end
      end
    end
  end

  constraints :subdomain => /api/ do
    apipie if Rails.env.development?
    scope :module => 'api' do
      resources :health_checks, only: [:index]
      namespace :v1 do
        get "current_user", :controller => "users", :action => "get_current_user"
        get "two_factor_authentication_disable", :controller => "users", :action => "two_factor_authentication_disable"
        get "two_factor_authentication_generate_recovery_codes", :controller => "users", :action => "two_factor_authentication_generate_recovery_codes"
        get "two_factor_authentication_qr_code", :controller => "users", :action => "two_factor_authentication_qr_code"
        post "two_factor_authentication_verify_token", :controller => "users", :action => "two_factor_authentication_verify_token"
        get "two_factor_authentication_enable", :controller => "users", :action => "two_factor_authentication_enable"
        resources :temp_uploads, except: [:new, :edit], concerns: :view_and_download do
          get :preview, on: :member
        end
        
        # TODO
        resources :entities, only: [:index, :update], :concerns => :collection_refresh_list do
          collection do
            get :search
            get :refresh_list
          end
          resources :entity_users, except: [:destroy] do
            get :resend_invitation, :on => :member
          end
        end
        get :docusign_settings, to: 'entity_settings#docusign_settings'
        post :docusign_settings, to: 'entity_settings#docusign_settings_save'
        get :licenses, to: 'entity_settings#licenses'

        resources :deals do
          scope module: 'dms_file_picker' do
            namespace :net_documents do
              namespace :file_picker do
                resources :cabinets, only: [:index] do
                  get :folders, on: :member, id: /[^\/]+/
                end
                resources :folders, only: [:show], id: /[^\/]+/
                resources :documents, only: [:show], id: /[^\/]+/ do
                  get :recently_accessed_documents, on: :collection
                  get :download_version, on: :member
                  get :search, on: :collection
                end
                resources :workspaces, only: [:index, :show]
              end
            end
            namespace :see_unity_imanage do
              namespace :file_picker do
                resources :workspaces, only: [:show] do
                  get :matter_worklist, on: :collection
                  get :my_matters, on: :collection
                  get :my_favorites, on: :collection
                end
                resources :folders, only: [:show], id: /[^\/]+/
                resources :documents, only: [:show], id: /[^\/]+/ do
                  get :document_worklist, on: :collection
                  get :versions_list
                  get :search, on: :collection
                end
              end
            end
            namespace :imanage10 do
              namespace :file_picker do
                resources :workspaces, only: [:show] do
                  get :matter_worklist, on: :collection
                  get :my_favorites, on: :collection
                  get :my_matters, on: :collection
                end
                resources :folders, only: [:show], id: /[^\/]+/
                resources :documents, only: [], id: /[^\/]+/ do
                  get :document_worklist, on: :collection
                  get :versions_list
                  get :search, on: :collection
                end
              end
            end
          end
          resources :temp_uploads, except: [:new, :edit], concerns: :view_and_download do
            get :preview, on: :member
          end
          get "/signers", :controller => "deals", :action => "signers"
          get "/signers/:id",  :controller => "deals",  :action => "get_signer"
          get :closing_checklist
          resources :signature_pages, only: [] do
            get :ready_to_send, on: :collection
          end
          resources :signature_groups do
            resources :block_collections do
              put :link_blocks, on: :collection
              put :unlink_blocks, on: :collection
              resources :signature_entities
              resources :signing_capacities
            end
          end
          resources :unmatched_signature_uploads do
            put :remove
            put :undo_removed
            resources :unmatched_signature_upload_pages do
              put :manually_match
              put :undo_manually_matched
            end
          end
          resources :signature_packets, only: [:create]
          get :documents_ready_to_be_executed
          get :documents_not_ready_to_be_executed
          get :documents_requiring_threshold
          post :process_documents_ready_to_be_executed
          resources :versions, only: [:index], :concerns => :view_and_download do
            put :move_unplaced_version
          end
          resources :closing_books, only: [:create, :index, :update, :destroy] do
            get :download, on: :member
          end
          resources :roles, only: [:index]
          resources :deal_entity_users, only: [:index, :show]
          resources :attachments, only: [] do
            put :move_unplaced_attachment
          end
          resources :versions, only: [:index, :update, :destroy]
          resources :categories, only: [:show] do
            get :export
            resources :versions, only: [:index], :concerns => :view_and_download
            resources :tree_elements, only: [:create, :show, :update, :destroy] do
              post :create_from_upload, on: :collection
              resources :to_dos, except: [:new, :edit]
              resources :responsible_parties, only: [:create, :update, :destroy]
              resources :completion_statuses, only: [:create, :update]
              resources :notes, only: [:index, :create, :destroy]
              resources :attachments, only: [:create, :destroy] do
                resources :versions, only: [:index, :create, :update, :destroy], :concerns => :view_and_download do
                  get :sync_thumbnails
                  get :compare_versions, on: :collection
                  get :send_to_dms, on: :member
                end
              end
              scope module: 'dms_file_picker' do
                namespace :imanage10 do
                  resources :attachments, only: [:create] do
                    resources :versions, only: [:create]
                  end
                end
                namespace :net_documents do
                  resources :attachments, only: [:create] do
                    resources :versions, only: [:create]
                  end
                end
                namespace :see_unity_imanage do
                  resources :attachments, only: [:create] do
                    resources :versions, only: [:create]
                  end
                end
              end
              resources :tree_element_restrictions, only: [:index, :create, :update, :destroy]
              get :propagate_restrictions_to_descendants, :on => :member
            end
          end
          resources :voting_interest_groups, only: [:index, :create, :update, :destroy] do
            resources :voting_interest_thresholds, only: [:create, :update, :destroy]
          end
        end
      end
    end
  end

  match "*path", to: "errors#route_not_found", via: :all

end
