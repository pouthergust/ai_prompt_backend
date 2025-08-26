defmodule AiPromptManagerApi.Prompts.Prompt do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "prompts" do
    field :title, :string
    field :content, :string
    field :category, :string
    field :tags, {:array, :string}, default: []
    field :is_favorite, :boolean, default: false

    belongs_to :user, AiPromptManagerApi.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(prompt, attrs) do
    prompt
    |> cast(attrs, [:title, :content, :category, :tags, :is_favorite, :user_id])
    |> validate_required([:title, :content, :category, :user_id])
    |> validate_length(:title, min: 1, max: 255)
    |> validate_length(:content, min: 1)
    |> validate_inclusion(:category, [
      "Desenvolvimento",
      "Marketing", 
      "Criatividade",
      "Análise",
      "Educação",
      "Negócios",
      "Outros"
    ])
    |> foreign_key_constraint(:user_id)
  end
end