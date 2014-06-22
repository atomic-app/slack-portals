class Portal < ActiveRecord::Base

  before_create :generate_token
  after_save :link_uuid
  belongs_to :user

  store_accessor :user_accounts

  def tunnel(params)
    user_image_url = self.get_user_image_url(params[:user_id])
    connection.send_payload(params, user_image_url) if connection
  end

  # Gross hax to send through payload as a json string
  def send_payload(params, user_image_url)
    payload = { 
      'payload' => JSON({
        'channel' => "##{self.channel_name.gsub('#', '')}", 
        'username'    => params[:user_name], 
        'text'        => params[:text], 
        'icon_url'    => user_image_url
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

  def link_uuid
    if self.connection_uuid && connection && !connection.connection_uuid
      connection.update_attributes(:connection_uuid => self.connection_uuid)
    end
  end

  def sync_access_token!(params)
    payload = {
      client_id: ENV['SLACK_CLIENT_ID'],
      client_secret: ENV['SLACK_CLIENT_SECRET'],
      code: params[:code],
      redirect_uri: ENV["SLACK_PORTAL_CALLBACK"]
    }

    response, data = RestClient.post 'https://slack.com/api/oauth.access', payload
    response = JSON.parse(response)

    if response['ok']
      self.update_attributes({access_token: response['access_token']})
    else
      false
    end
  end

  def get_user_image_url(user_id)
    image_url = self.user_accounts ? self.user_accounts[user_id] : nil
    unless image_url
      response, data = RestClient.get "https://slack.com/api/users.list?token=#{self.access_token}"
      response = JSON.parse(response)
      if response['ok']
        self.user_accounts = Hash[response['members'].collect { |m| [m['id'], m['profile']['image_48']] }]
        self.save!
        image_url = self.user_accounts[user_id]
      end
    end
    image_url
  end

  protected

  def generate_token
    self.uuid = loop do
      random_token = SecureRandom.urlsafe_base64(nil, false)
      break random_token unless Portal.exists?(uuid: random_token)
    end
  end

end
