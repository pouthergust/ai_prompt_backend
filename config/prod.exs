import Config

config :ai_prompt_manager_api, AiPromptManagerApiWeb.Endpoint,
  url: [host: "example.com", port: 80],
  cache_static_manifest: "priv/static/cache_manifest.json"

config :logger, level: :info

config :ai_prompt_manager_api, AiPromptManagerApi.Repo,
  url: System.get_env("DATABASE_URL"),
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
  ssl: true

config :ai_prompt_manager_api, AiPromptManagerApiWeb.Endpoint,
  http: [
    port: String.to_integer(System.get_env("PORT") || "4000"),
    transport_options: [socket_opts: [:inet6]]
  ],
  secret_key_base: System.get_env("SECRET_KEY_BASE")

config :ai_prompt_manager_api, AiPromptManagerApi.Guardian,
  secret_key: System.get_env("GUARDIAN_SECRET_KEY")