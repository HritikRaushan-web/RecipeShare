import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if this is a recipe detail page route
  if (pathname.startsWith("/recipes/")) {
    // Extract recipeId from the pathname /recipes/[recipeId]
    const segments = pathname.split("/");
    const recipeId = segments[2];

    if (recipeId) {
      // 1. Log access to the console (runs on the server terminal)
      console.log(`[Middleware] Accessed recipe details page for ID: ${recipeId} at ${new Date().toISOString()}`);

      // 2. Simple Authentication Check for Premium Recipes
      // Premium recipe IDs match those marked "isPremium: true" in recipes.json
      const premiumRecipeIds = ["4", "7", "10"];

      if (premiumRecipeIds.includes(recipeId)) {
        const hasAccess = request.nextUrl.searchParams.get("access") === "true";

        if (!hasAccess) {
          console.log(`[Middleware] Auth Failed: Redirecting unauthorized request for premium recipe ID: ${recipeId}`);
          
          // Clone the URL and redirect to the unauthorized error page
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = "/unauthorized";
          // Pass the recipeId to let the unauthorized page explain which recipe failed
          redirectUrl.searchParams.set("id", recipeId);
          return NextResponse.redirect(redirectUrl);
        }
      }
    }
  }

  return NextResponse.next();
}

// Config to run middleware only on recipe detail routes
export const config = {
  matcher: ["/recipes/:recipeId*"],
};
