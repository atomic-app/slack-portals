Slack Portals
===

Slack portals is a Rails server that can connect two different company's Slack channels together. It's available on [https://slack-portals.herokuapp.com](https://slack-portals.herokuapp.com), but you're more than welcome to fork this project and spin up your own Portal Server.

The following instructions will help you setup Slack Portals on a Heroku instance.

1. Setup a Heroku account and add the new 'heroku' remote:
  - Checkout [Deploying with Git](https://devcenter.heroku.com/articles/git) for help

2. Setup a Google OAUTH2 API:
  - Go to `https://console.developers.google.com`
  - Select your project.
  - Click 'APIs & auth'
  - Make sure "Contacts API" and "Google+ API" are on.
  - Go to Consent Screen, and provide a 'PRODUCT NAME'
  - Wait 10 minutes for changes to take effect.

3. Setup a Slack API account
  - Go to `https://api.slack.com/applications`
  - Create a new application
  - Set the URL to be the heroku instance URL
  - Set the Redirect URI(s) to be https://{your_heroku_app_name}.herokuapp.com/portals/callback

4. Set the following Environment Variables in Heroku:
  - SLACK_CLIENT_ID='your slack API client id'
  - SLACK_CLIENT_SECRET='your slack API client secret'
  - SLACK_PORTAL_CALLBACK='https://{your_heroku_app_name}.herokuapp.com/portals/callback'
  - SLACK_PORTAL_OUTGOING_URL='https://{your_heroku_app_name}.herokuapp.com/webhooks/incoming'
  - GOOGLE_CLIENT_ID='your Google API client id'
  - GOOGLE_CLIENT_SECRET='your Google API client secret'

5. Deploy to Heroku `git push heroku master`

6. Run the migrations `heroku run rake db:migrate`



The MIT License (MIT)

Copyright (c) 2014 Atomic