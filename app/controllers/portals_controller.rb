require 'uri'
require "net/http"
require "rubygems"
require "json"

class PortalsController < ApplicationController

  before_action :authorize

  def index
    @portals = user_portals.all
  end

  def show
    @portals = user_portals.all
  end

  def new
    @portal = user_portals.build
  end

  def create
    @portal = user_portals.build(portal_params)
    if @portal.save
      uri = URI("https://slack.com/oauth/authorize?client_id=#{ENV['SLACK_CLIENT_ID']}&scope=read,post&redirect_uri=#{ENV['SLACK_PORTAL_CALLBACK']}&state=#{@portal.id}")
      redirect_to uri.to_s
    else
      flash[:success] = "There was an error creating this Portal"
      render 'new'
    end
  end

  def edit
    @portal = user_portals.find(params[:id])
  end

  def update
    @portal = user_portals.find(params[:id])
    if @portal.update_attributes(portal_params)
      redirect_to portals_path
    else
      render 'edit'
    end
  end

  def destroy
    @portal = user_portals.find(params[:id])
    @portal.destroy!
  end

  def callback
    @portal = user_portals.find(params[:state].to_i)

    if @portal && @portal.sync_access_token!(params)
      flash[:success] = "You've successfully created a Portal"
      redirect_to portals_path
    end
  end

  private

  def user_portals
    current_user.portals
  end

  def portal_params
    params.require(:portal).permit(:incoming_webhook_url, :outgoing_webhook_token, :channel_name, :company_name, :connection_uuid)
  end
end
