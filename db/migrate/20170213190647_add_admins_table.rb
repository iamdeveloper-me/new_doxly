class AddAdminsTable < ActiveRecord::Migration
  def change
    create_table "admins", force: :cascade do |t|
      t.string   "email",                              default: "", null: false
      t.string   "password_digest",                    default: "", null: false
      t.datetime "last_sign_in_at"
      t.string   "last_sign_in_ip"
      t.datetime "created_at",                                      null: false
      t.datetime "updated_at",                                      null: false
    end
  end
end
