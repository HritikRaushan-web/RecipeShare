"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Custom hook: useFavorites
// Reads/writes favorites from localStorage using useSyncExternalStore.
// This is React's recommended way to subscribe to an external store without
// triggering the react-hooks/set-state-in-effect lint rule.
// On the server, `getServerSnapshot` always returns [] so hydration is safe.
// ---------------------------------------------------------------------------
function subscribe(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// Cached snapshot - React requires getSnapshot to return the same reference
// when the value hasn't changed, otherwise it causes an infinite loop.
let _lastRaw = null;
let _lastParsed = [];

function getSnapshot() {
  try {
    const raw = localStorage.getItem("recipe-favorites");
    // Only parse & create a new array when the stored string actually changed
    if (raw !== _lastRaw) {
      _lastRaw = raw;
      _lastParsed = raw ? JSON.parse(raw) : [];
    }
    return _lastParsed;
  } catch {
    return _lastParsed;
  }
}

// Module-level constant so getServerSnapshot always returns the SAME reference.
// React requires this — returning `[]` inline creates a new array every call
// which React interprets as a constantly changing value, causing an infinite loop.
const EMPTY_FAVORITES = [];

function getServerSnapshot() {
  return EMPTY_FAVORITES;
}

function useFavorites() {
  // useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  // Provides a safe, lint-clean way to read localStorage with SSR support.
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleFavorite = useCallback((recipeId) => {
    const current = getSnapshot();
    const updated = current.includes(recipeId)
      ? current.filter((id) => id !== recipeId)
      : [...current, recipeId];
    localStorage.setItem("recipe-favorites", JSON.stringify(updated));
    // Dispatch a storage event so useSyncExternalStore re-reads from localStorage
    window.dispatchEvent(new StorageEvent("storage"));
  }, []);

  return { favorites, toggleFavorite };
}

// ---------------------------------------------------------------------------
// Star Rating Subcomponent (Visual Only, Local State)
// ---------------------------------------------------------------------------
function StarRating({ recipeId }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="rating-widget" title="Rate this recipe!">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? "active" : ""}`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{ fontSize: "1.2rem", cursor: "pointer", transition: "color 0.2s" }}
        >
          ★
        </span>
      ))}
      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.4rem" }}>
        {rating > 0 ? `(${rating}/5)` : "(unrated)"}
      </span>
    </div>
  );
}

export default function RecipeGrid({ initialRecipes }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  // useFavorites encapsulates the localStorage subscription (no setState-in-effect)
  const { favorites, toggleFavorite } = useFavorites();

  // Perform client-side searching & favorite filtering
  const filteredRecipes = initialRecipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = !showOnlyFavorites || favorites.includes(recipe.id);
    return matchesSearch && matchesFavorite;
  });

  return (
    <div>
      {/* Search and Favorites Toggles */}
      <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        {/* Real-time search bar */}
        <div style={{ flexGrow: 1, position: "relative" }}>
          <input
            type="text"
            placeholder="🔍 Search recipes by name in real-time..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ padding: "0.8rem 1rem 0.8rem 2.5rem" }}
          />
          <span style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
            
          </span>
        </div>

        {/* Show Favorites Toggle */}
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className="reset-btn"
          style={{
            borderColor: showOnlyFavorites ? "#ff4d6d" : "var(--border-color)",
            color: showOnlyFavorites ? "#ff4d6d" : "var(--text-secondary)",
            background: showOnlyFavorites ? "rgba(255, 77, 109, 0.08)" : "transparent",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          ♥ {showOnlyFavorites ? "Showing Favorites" : `Show Favorites (${favorites.length})`}
        </button>
      </div>

      {/* Recipe Cards Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="recipes-grid">
          {filteredRecipes.map((recipe) => {
            const isFav = favorites.includes(recipe.id);
            return (
              <div 
                key={recipe.id} 
                className={`recipe-card ${recipe.isPremium ? "premium-card" : ""}`}
              >
                <div className="card-header-decor" />
                <div className="card-body">
                  <div className="card-top">
                    <span className={`category-badge ${recipe.category}`}>
                      {recipe.category}
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      {recipe.isPremium && <span className="premium-badge">Premium</span>}
                      <button 
                        onClick={() => toggleFavorite(recipe.id)}
                        className={`fav-toggle ${isFav ? "is-fav" : ""}`}
                        aria-label="Add to favorites"
                      >
                        ♥
                      </button>
                    </div>
                  </div>

                  <h3 className="recipe-title">{recipe.name}</h3>
                  <p className="recipe-desc">{recipe.description}</p>

                  <div style={{ margin: "0.5rem 0 1rem 0" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>Rating:</span>
                    <StarRating recipeId={recipe.id} />
                  </div>

                  <div className="card-meta">
                    <div className="meta-item">
                      <span>⏱</span> {recipe.prepTime} mins prep
                    </div>
                    <div className="meta-item">
                      <span>🔥</span>
                      <span className={`difficulty-indicator ${recipe.difficulty}`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>

                  {recipe.isPremium ? (
                    <Link href={`/recipes/${recipe.id}?access=true`} className="card-btn">
                      View Recipe Detail
                    </Link>
                  ) : (
                    <Link href={`/recipes/${recipe.id}`} className="card-btn">
                      View Recipe Detail
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">🍲</div>
          <h3>No Recipes Found</h3>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Try resetting your filters or adjusting your search query.
          </p>
        </div>
      )}
    </div>
  );
}
