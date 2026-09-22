interface ProductIngredientsProps {
  ingredients: string[];
}

export function ProductIngredients({ ingredients }: ProductIngredientsProps) {
  if (ingredients.length === 0) return null;

  return (
    <section aria-labelledby="ingredients-heading">
      <h2 id="ingredients-heading" className="text-2xl text-foreground">
        Ingredients
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
          >
            {ingredient}
          </li>
        ))}
      </ul>
    </section>
  );
}
