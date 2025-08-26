defmodule AiPromptManagerApiWeb.Router do
  use AiPromptManagerApiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :auth do
    plug Guardian.Plug.Pipeline, module: AiPromptManagerApi.Guardian,
                                  error_handler: AiPromptManagerApiWeb.AuthErrorHandler
    plug Guardian.Plug.VerifyHeader, realm: "Bearer"
    plug Guardian.Plug.EnsureAuthenticated
    plug Guardian.Plug.LoadResource
  end

  scope "/api", AiPromptManagerApiWeb do
    pipe_through :api

    # Authentication routes
    post "/auth/register", AuthController, :register
    post "/auth/login", AuthController, :login
    get "/auth/me", AuthController, :me
  end

  scope "/api", AiPromptManagerApiWeb do
    pipe_through [:api, :auth]

    # Protected routes
    resources "/prompts", PromptController, except: [:new, :edit]
    get "/prompts/search/:term", PromptController, :search
    get "/prompts/category/:category", PromptController, :by_category
    get "/prompts/favorites", PromptController, :favorites
    patch "/prompts/:id/favorite", PromptController, :toggle_favorite
  end

  # Enable LiveDashboard in development
  if Application.compile_env(:ai_prompt_manager_api, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: AiPromptManagerApiWeb.Telemetry
    end
  end
end