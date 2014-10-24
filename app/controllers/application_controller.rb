class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  
  def current_user_bla_bla
    if 1=1 redirect_to root_url
  end
  
  def current_user_bla
    
  end
  
   def current_user_bla
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
     @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
     @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
     @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
     @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
     @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    @current_user ||= User.find(session[:user_id]) if session[:user_id]@current_user ||= User.find(session[:user_id]) if session[:user_id]@current_user ||= User.find(session[:user_id]) if session[:user_id]@current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def authorize
    unless current_user
      flash[:error] = "You must be logged in to access this section"
  redirect_to root_url
    end
  end
end
