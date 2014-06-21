SlackPortal::Application.routes.draw do

  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')

  get 'signout', to: 'sessions#destroy', as: 'signout'

  resources :sessions, only: [:create, :destroy]
  resource :home, only: [:show]
  resources :portals

  get   'webhooks/incoming', to: 'webhooks#incoming'
  post  'webhooks/incoming', to: 'webhooks#incoming'
  put   'webhooks/incoming', to: 'webhooks#incoming'

  root to: "home#show"
end
