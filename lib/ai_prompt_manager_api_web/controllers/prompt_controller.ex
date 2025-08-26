defmodule AiPromptManagerApiWeb.PromptController do
  use AiPromptManagerApiWeb, :controller

  alias AiPromptManagerApi.Prompts
  alias AiPromptManagerApi.Prompts.Prompt
  alias AiPromptManagerApi.Guardian

  action_fallback AiPromptManagerApiWeb.FallbackController

  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    prompts = Prompts.list_prompts(user.id)
    render(conn, :index, prompts: prompts)
  end

  def create(conn, %{"prompt" => prompt_params}) do
    user = Guardian.Plug.current_resource(conn)
    
    case Prompts.create_prompt(user.id, prompt_params) do
      {:ok, prompt} ->
        conn
        |> put_status(:created)
        |> render(:show, prompt: prompt)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)
    prompt = Prompts.get_user_prompt!(user.id, id)
    render(conn, :show, prompt: prompt)
  end

  def update(conn, %{"id" => id, "prompt" => prompt_params}) do
    user = Guardian.Plug.current_resource(conn)
    prompt = Prompts.get_user_prompt!(user.id, id)

    case Prompts.update_prompt(prompt, prompt_params) do
      {:ok, prompt} ->
        render(conn, :show, prompt: prompt)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)
    prompt = Prompts.get_user_prompt!(user.id, id)

    case Prompts.delete_prompt(prompt) do
      {:ok, _prompt} ->
        send_resp(conn, :no_content, "")

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  def search(conn, %{"term" => term}) do
    user = Guardian.Plug.current_resource(conn)
    prompts = Prompts.search_prompts(user.id, term)
    render(conn, :index, prompts: prompts)
  end

  def by_category(conn, %{"category" => category}) do
    user = Guardian.Plug.current_resource(conn)
    prompts = Prompts.filter_by_category(user.id, category)
    render(conn, :index, prompts: prompts)
  end

  def favorites(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    prompts = Prompts.get_favorite_prompts(user.id)
    render(conn, :index, prompts: prompts)
  end

  def toggle_favorite(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)
    prompt = Prompts.get_user_prompt!(user.id, id)

    case Prompts.update_prompt(prompt, %{is_favorite: !prompt.is_favorite}) do
      {:ok, prompt} ->
        render(conn, :show, prompt: prompt)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end
end