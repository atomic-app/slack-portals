class WebhooksController < ApplicationController

  protect_from_forgery except: :incoming 

  def incoming
    logger.info params
    portal = Portal.where(outgoing_webhook_token: params[:token]).first

    portal.tunnel(params) if portal
    render status: 200
  end
end
