class AddUsersToPortal < ActiveRecord::Migration
  def change
    add_column :portals, :user_accounts, :hstore  
  end
end
