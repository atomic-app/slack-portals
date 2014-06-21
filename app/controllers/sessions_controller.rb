class SessionsController < ApplicationController
  def create
    user = User.from_omniauth(env["omniauth.auth"])
    session[:user_id] = user.id
    redirect_to portals_path
  end

  def destroy
    session[:user_id] = nil
    flash[:error] = 'Could not log in via Google'
    redirect_to root_path
  end
end
