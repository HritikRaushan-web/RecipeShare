import fs from "fs/promises";
import path from "path";
import FilterBar from "@/components/FilterBar";
import RecipeGrid from "@/components/RecipeGrid";

export const metadata = {
  title: "RecipeShare | Exquisite Recipes for Every Chef",
  description: "Explore, filter, and discover your next signature culinary creation on RecipeShare. Simple, vegan, vegetarian, or premium gourmet experiences.",
};

export default async function HomePage({ searchParams }) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;
  const categoryFilter = params?.category || "all";
  const difficultyFilter = params?.difficulty || "all";
  const maxPrepTimeFilter = params?.maxPrepTime ? parseInt(params.maxPrepTime) : null;

  let recipes = [];

  try {
    // Read recipes.json from project root
    const filePath = path.join(process.cwd(), "recipes.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(fileContent);
    recipes = parsedData.recipes || [];
  } catch (error) {
    console.error("[Homepage] Error loading recipes.json:", error);
  }

  // Server-Side Filtering
  const filteredRecipes = recipes.filter((recipe) => {
    // Category check
    if (categoryFilter !== "all" && recipe.category !== categoryFilter) {
      return false;
    }
    // Difficulty check
    if (difficultyFilter !== "all" && recipe.difficulty !== difficultyFilter) {
      return false;
    }
    // Max Prep Time check
    if (maxPrepTimeFilter !== null && recipe.prepTime > maxPrepTimeFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="container" style={{ minHeight: "80vh" }}>
      {/* Hero Header */}
      <section className="hero">
        <h1>Discover Culinary Artistry</h1>
        <p>
          Browse our curated selection of fine dishes. Filter by category, 
          difficulty, or time to find the perfect recipe for your next meal.
        </p>
      </section>

      {/* Server Filter Component */}
      <FilterBar />

      {/* Client Recipe list with local search and favorites */}
      <RecipeGrid initialRecipes={filteredRecipes} />
    </div>
  );
}
