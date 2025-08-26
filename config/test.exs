import Config

config :ai_prompt_manager_api, AiPromptManagerApiWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "test-secret-key-base",
  server: false

config :ai_prompt_manager_api, AiPromptManagerApi.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "ai_prompt_manager_api_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

config :logger, level: :warning

config :phoenix, :plug_init_mode, :runtime