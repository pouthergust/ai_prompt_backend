defmodule AiPromptManagerApiWeb.PromptJSON do
  alias AiPromptManagerApi.Prompts.Prompt

  @doc """
  Renders a list of prompts.
  """
  def index(%{prompts: prompts}) do
    %{data: for(prompt <- prompts, do: data(prompt))}
  end

  @doc """
  Renders a single prompt.
  """
  def show(%{prompt: prompt}) do
    %{data: data(prompt)}
  end

  @doc """
  Renders errors.
  """
  def error(%{changeset: changeset}) do
    %{errors: translate_errors(changeset)}
  end

  defp data(%Prompt{} = prompt) do
    %{
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags,
      is_favorite: prompt.is_favorite,
      inserted_at: prompt.inserted_at,
      updated_at: prompt.updated_at
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