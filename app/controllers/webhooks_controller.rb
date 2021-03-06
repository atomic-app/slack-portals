class WebhooksController < ApplicationController

  protect_from_forgery except: :incoming 

  def incoming
    portal = Portal.where(outgoing_webhook_token: params[:token]).first

    portal.tunnel(params) if portal && params[:user_id] != 'USLACKBOT'
    render nothing: true, status: 200
  rescue Exception => e
    render nothing: true, status: 200
  end
end
