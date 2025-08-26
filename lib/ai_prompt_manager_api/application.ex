defmodule AiPromptManagerApi.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      AiPromptManagerApi.Repo,
      {DNSCluster, query: Application.get_env(:ai_prompt_manager_api, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: AiPromptManagerApi.PubSub},
      {Finch, name: AiPromptManagerApi.Finch},
      AiPromptManagerApiWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: AiPromptManagerApi.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    AiPromptManagerApiWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end