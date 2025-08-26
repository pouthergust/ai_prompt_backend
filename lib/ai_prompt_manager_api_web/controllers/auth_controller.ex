defmodule AiPromptManagerApiWeb.AuthController do
  use AiPromptManagerApiWeb, :controller

  alias AiPromptManagerApi.Accounts
  alias AiPromptManagerApi.Guardian

  action_fallback AiPromptManagerApiWeb.FallbackController

  def register(conn, %{"user" => user_params}) do
    case Accounts.create_user(user_params) do
      {:ok, user} ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)
        
        conn
        |> put_status(:created)
        |> render(:user_with_token, %{user: user, token: token})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, %{changeset: changeset})
    end
  end

  def login(conn, %{"email" => email, "password" => password}) do
    case Accounts.authenticate_user(email, password) do
      {:ok, user} ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)
        
        render(conn, :user_with_token, %{user: user, token: token})

      {:error, :invalid_credentials} ->
        conn
        |> put_status(:unauthorized)
        |> render(:error, %{message: "Invalid email or password"})
    end
  end

  def me(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    render(conn, :user, %{user: user})
  end
end