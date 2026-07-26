import Link from "next/link";

export const metadata = {
  title: "Premium Access Required | RecipeShare",
  description: "Access to premium recipes requires authorization.",
};

export default async function UnauthorizedPage({ searchParams }) {
  // Await searchParams as per Next.js 15 App Router requirements
  const params = await searchParams;
  const recipeId = params?.id || "";

  return (
    <div className="container">
      <div className="unauth-card">
        <div className="unauth-icon">🔒</div>
        <h1 className="unauth-title">Premium Recipe</h1>
        <p className="unauth-message">
          This recipe is part of our **Premium Selection** and requires a premium subscription to access. 
          To unlock this and other exclusive recipes, please subscribe or use the button below to test with demo access.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          {recipeId && (
            <Link href={`/recipes/${recipeId}?access=true`} className="btn-primary" style={{ background: "linear-gradient(135deg, #7b2cbf, #9d4edd)", color: "#ffffff", width: "100%" }}>
              Unlock with Demo Access (?access=true)
            </Link>
          )}
          <Link href="/" className="btn-primary" style={{ width: "100%" }}>
            Browse Free Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}
