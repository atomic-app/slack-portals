require 'uri'
require 'net/http'
require 'net/https'

class Portal < ActiveRecord::Base

  before_create :generate_token
  belongs_to :user

  def tunnel(params)
    connection.send_payload(params) if connection
  end

  # Gross hax to send through payload as a json string
  def send_payload(params)
    payload = { 
      'payload' => JSON({
        'channel' => self.channel_name.gsub('#', ''), 
        'username'    => params[:user_name], 
        'text'        => params[:text], 
        'icon_emoji'  => ':ghost:'
      }).to_s
    }

    RestClient.post self.incoming_webhook_url, payload, :content_type => 'x-www-form-urlencoded'
  end

  def connection
    Portal.where(:connection_uuid => self.uuid).first
  end

  def connected_company
    connection ? connection.company_name : 'No End Portal'
  end

  def sync_access_token!(params)
    payload = {
      client_id: ENV['SLACK_CLIENT_ID'],
      client_secret: ENV['SLACK_CLIENT_SECRET'],
      code: params[:code],
      redirect_uri: "https://slack-portal.herokuapp.com/portals/callback"
    }

    response, data = RestClient.post 'https://slack.com/api/oauth.access', payload

    if data['ok']
      self.update_attributes({access_token: data['access_token']})
    end
  end

  protected

  def generate_token
    self.uuid = loop do
      random_token = SecureRandom.urlsafe_base64(nil, false)
      break random_token unless Portal.exists?(uuid: random_token)
    end
  end

end
