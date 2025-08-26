defmodule AiPromptManagerApi.Repo do
  use Ecto.Repo,
    otp_app: :ai_prompt_manager_api,
    adapter: Ecto.Adapters.Postgres
end