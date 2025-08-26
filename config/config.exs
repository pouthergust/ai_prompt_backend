import Config

config :ai_prompt_manager_api,
  ecto_repos: [AiPromptManagerApi.Repo],
  generators: [timestamp_type: :utc_datetime, binary_id: true]

config :ai_prompt_manager_api, AiPromptManagerApiWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Phoenix.Endpoint.Cowboy2Adapter,
  render_errors: [
    formats: [json: AiPromptManagerApiWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: AiPromptManagerApi.PubSub,
  live_view: [signing_salt: "your-secret-key"]

config :ai_prompt_manager_api, AiPromptManagerApi.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "ai_prompt_manager_api_dev",
  stacktrace: true,
  show_sensitive_data_on_connection_error: true,
  pool_size: 10

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :phoenix, :json_library, Jason

config :ai_prompt_manager_api, AiPromptManagerApi.Guardian,
  issuer: "ai_prompt_manager_api",
  secret_key: "your-very-secret-guardian-key-change-in-production"

import_config "#{config_env()}.exs"