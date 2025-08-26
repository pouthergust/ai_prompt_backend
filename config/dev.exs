import Config

config :ai_prompt_manager_api, AiPromptManagerApiWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4000],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: "your-secret-key-base-change-in-production",
  watchers: []

config :ai_prompt_manager_api, AiPromptManagerApi.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "ai_prompt_manager_api_dev",
  stacktrace: true,
  show_sensitive_data_on_connection_error: true,
  pool_size: 10

config :logger, :console, format: "[$level] $message\n"

config :phoenix, :stacktrace_depth, 20

config :phoenix, :plug_init_mode, :runtime