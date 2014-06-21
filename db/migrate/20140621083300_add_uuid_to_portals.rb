class AddUuidToPortals < ActiveRecord::Migration
  def change
    add_column :portals, :company_name, :string
    add_column :portals, :uuid, :string
    add_column :portals, :connection_uuid, :string
    rename_column :portals, :incoming_webhook_token, :incoming_webhook_url
  end
end
