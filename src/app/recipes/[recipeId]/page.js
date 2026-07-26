import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import IngredientsList from "@/components/IngredientsList";

// Helper to load a recipe by ID
async function getRecipe(recipeId) {
  try {
    const filePath = path.join(process.cwd(), "recipes.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(fileContent);
    return parsedData.recipes.find((r) => r.id === recipeId);
  } catch (error) {
    console.error(`[RecipeDetailPage] Error loading recipe ${recipeId}:`, error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { recipeId } = resolvedParams;
  const recipe = await getRecipe(recipeId);

  if (!recipe) {
    return {
      title: "Recipe Not Found | RecipeShare",
      description: "The requested recipe could not be found on RecipeShare.",
    };
  }

  return {
    title: `${recipe.name} (${recipe.category}) - How to Make | RecipeShare`,
    description: recipe.description,
    openGraph: {
      title: recipe.name,
      description: recipe.description,
      type: "article",
    },
  };
}

export default async function RecipeDetailPage({ params }) {
  const resolvedParams = await params;
  const { recipeId } = resolvedParams;
  const recipe = await getRecipe(recipeId);

  if (!recipe) {
    return (
      <div className="container" style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Recipe Not Found</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          We couldn&apos;t find the recipe you&apos;re looking for. It may have been removed or the link is incorrect.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container detail-container">
      {/* Back button */}
      <Link href="/" className="back-btn">
        ← Back to Recipes
      </Link>

      {/* Hero Details Header */}
      <div className="detail-header">
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span className={`category-badge ${recipe.category}`}>
            {recipe.category}
          </span>
          {recipe.isPremium && <span className="premium-badge">Premium Collection</span>}
        </div>
        
        <div className="detail-title-wrapper">
          <h1 className="detail-title">{recipe.name}</h1>
        </div>

        <p className="detail-desc">{recipe.description}</p>

        {/* Info Tiles */}
        <div className="info-tiles">
          <div className="info-tile">
            <div className="info-tile-label">Prep Time</div>
            <div className="info-tile-value">{recipe.prepTime} mins</div>
          </div>
          <div className="info-tile">
            <div className="info-tile-label">Cook Time</div>
            <div className="info-tile-value">{recipe.cookTime} mins</div>
          </div>
          <div className="info-tile">
            <div className="info-tile-label">Total Time</div>
            <div className="info-tile-value">{recipe.prepTime + recipe.cookTime} mins</div>
          </div>
          <div className="info-tile">
            <div className="info-tile-label">Difficulty</div>
            <div className={`info-tile-value ${recipe.difficulty}`}>
              {recipe.difficulty}
            </div>
          </div>
        </div>
      </div>

      {/* Main Detail Content Grid */}
      <div className="detail-content">
        {/* Ingredients section */}
        <div className="content-section">
          <h2>Ingredients</h2>
          <IngredientsList ingredients={recipe.ingredients} />
        </div>

        {/* Instructions section */}
        <div className="content-section">
          <h2>Instructions</h2>
          <div className="instructions-list">
            {recipe.instructions.map((step, index) => (
              <div key={index} className="instruction-step">
                <div className="step-number">{index + 1}</div>
                <div className="step-text">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
