defmodule AiPromptManagerApi.Repo.Migrations.CreatePrompts do
  use Ecto.Migration

  def change do
    create table(:prompts, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :title, :string, null: false
      add :content, :text, null: false
      add :category, :string, null: false
      add :tags, {:array, :string}, default: []
      add :is_favorite, :boolean, default: false
      add :user_id, references(:users, on_delete: :delete_all, type: :binary_id), null: false

      timestamps(type: :utc_datetime)
    end

    create index(:prompts, [:user_id])
    create index(:prompts, [:category])
    create index(:prompts, [:is_favorite])
    create index(:prompts, [:tags], using: :gin)
  end
end