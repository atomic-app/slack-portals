class CreatePortals < ActiveRecord::Migration
  def change
    create_table :portals do |t|
      t.integer :user_id
      t.string :access_token
      t.string :incoming_webhook_token
      t.string :channel_name
      t.integer :channel_id
      t.string :outgoing_webhook_token

      t.timestamps
    end
  end
end
