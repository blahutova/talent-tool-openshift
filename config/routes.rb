Rails.application.routes.draw do
  # resources :queries
  # resources :categories
  resources :languages
  resources :users, only: [:index]

  resources :translations, only: [:index, :show, :update, :destroy]
  resources :terms, only: [:index, :show, :update, :destroy]
  resources :query_languages, only: [:show, :destroy]

  # resources :categories do
  #   resources :translations , only: [:index]
  # end

  resources :categories do
    resources :languages do
      resources :translations, only: [:create]
    end
  end

  # resources :queries do
  #   resources :terms , only: [:index]
  # end

  resources :queries do
    resources :categories do
      resources :terms, only: [:create]
    end
  end

  resources :queries do
    resources :query_languages , only: [:index]
  end

  resources :queries do
    resources :languages do
      resources :query_languages, only: [:create]
    end
  end

  resources :basic_form_query, only: [:show]
  resources :expanded_query_linkedin, only: [:show]

end
