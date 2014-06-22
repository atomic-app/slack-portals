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

ActiveRecord::Schema.define(version: 20140621234826) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "hstore"

  create_table "portals", force: true do |t|
    t.integer  "user_id"
    t.string   "access_token"
    t.string   "incoming_webhook_url"
    t.string   "channel_name"
    t.integer  "channel_id"
    t.string   "outgoing_webhook_token"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "company_name"
    t.string   "uuid"
    t.string   "connection_uuid"
    t.hstore   "user_accounts"
  end

  create_table "users", force: true do |t|
    t.string   "provider"
    t.string   "uid"
    t.string   "name"
    t.string   "oauth_token"
    t.datetime "oauth_expires_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
