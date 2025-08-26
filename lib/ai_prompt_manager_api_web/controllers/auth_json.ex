defmodule AiPromptManagerApiWeb.AuthJSON do
  alias AiPromptManagerApi.Accounts.User

  @doc """
  Renders a user with token.
  """
  def user_with_token(%{user: user, token: token}) do
    %{
      data: %{
        user: data(user),
        token: token
      }
    }
  end

  @doc """
  Renders a user.
  """
  def user(%{user: user}) do
    %{data: data(user)}
  end

  @doc """
  Renders an error.
  """
  def error(%{changeset: changeset}) do
    %{errors: translate_errors(changeset)}
  end

  def error(%{message: message}) do
    %{error: message}
  end

  defp data(%User{} = user) do
    %{
      id: user.id,
      name: user.name,
      email: user.email,
      inserted_at: user.inserted_at,
      updated_at: user.updated_at
    }
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, &translate_error/1)
  end

  defp translate_error({msg, opts}) do
    Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
      opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
    end)
  end
end