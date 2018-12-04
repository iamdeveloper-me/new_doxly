# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :cookie_store, secure: Rails.env.production?, key: '_doxly_session'
