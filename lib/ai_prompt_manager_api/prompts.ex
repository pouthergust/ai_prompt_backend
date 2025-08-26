defmodule AiPromptManagerApi.Prompts do
  @moduledoc """
  The Prompts context.
  """

  import Ecto.Query, warn: false
  alias AiPromptManagerApi.Repo
  alias AiPromptManagerApi.Prompts.Prompt

  @doc """
  Returns the list of prompts for a user.
  """
  def list_prompts(user_id) do
    Prompt
    |> where([p], p.user_id == ^user_id)
    |> order_by([p], desc: p.inserted_at)
    |> Repo.all()
  end

  @doc """
  Gets a single prompt.
  """
  def get_prompt!(id), do: Repo.get!(Prompt, id)

  @doc """
  Gets a single prompt for a user.
  """
  def get_user_prompt!(user_id, id) do
    Prompt
    |> where([p], p.user_id == ^user_id and p.id == ^id)
    |> Repo.one!()
  end

  @doc """
  Creates a prompt.
  """
  def create_prompt(user_id, attrs \\ %{}) do
    attrs = Map.put(attrs, "user_id", user_id)

    %Prompt{}
    |> Prompt.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a prompt.
  """
  def update_prompt(%Prompt{} = prompt, attrs) do
    prompt
    |> Prompt.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a prompt.
  """
  def delete_prompt(%Prompt{} = prompt) do
    Repo.delete(prompt)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking prompt changes.
  """
  def change_prompt(%Prompt{} = prompt, attrs \\ %{}) do
    Prompt.changeset(prompt, attrs)
  end

  @doc """
  Searches prompts by title, content, or tags.
  """
  def search_prompts(user_id, search_term) when is_binary(search_term) do
    search_pattern = "%#{search_term}%"

    Prompt
    |> where([p], p.user_id == ^user_id)
    |> where([p], 
      ilike(p.title, ^search_pattern) or 
      ilike(p.content, ^search_pattern) or 
      fragment("? @> ?", p.tags, ^[search_term])
    )
    |> order_by([p], desc: p.inserted_at)
    |> Repo.all()
  end

  @doc """
  Filters prompts by category.
  """
  def filter_by_category(user_id, category) do
    Prompt
    |> where([p], p.user_id == ^user_id and p.category == ^category)
    |> order_by([p], desc: p.inserted_at)
    |> Repo.all()
  end

  @doc """
  Gets favorite prompts for a user.
  """
  def get_favorite_prompts(user_id) do
    Prompt
    |> where([p], p.user_id == ^user_id and p.is_favorite == true)
    |> order_by([p], desc: p.inserted_at)
    |> Repo.all()
  end
end