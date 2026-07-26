"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derive current filter values directly from URL searchParams on each render.
  // This avoids useEffect+setState sync (which ESLint flags) while staying reactive
  // to URL changes (e.g. after Reset navigates the user to a clean URL).
  const category = searchParams.get("category") || "all";
  const difficulty = searchParams.get("difficulty") || "all";
  const maxPrepTime = searchParams.get("maxPrepTime") || "60";

  // Local slider state for the range input (display only; URL is updated on release)
  const [sliderVal, setSliderVal] = useState(maxPrepTime);

  // Helper to push updated search params to URL
  const applyFilters = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, val]) => {
      if (val && val !== "all" && val !== "") {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (e) => {
    applyFilters({ category: e.target.value });
  };

  const handleDifficultyChange = (e) => {
    applyFilters({ difficulty: e.target.value });
  };

  const handleSliderChange = (e) => {
    // Update local display state immediately so the label feels responsive
    setSliderVal(e.target.value);
  };

  const handleSliderRelease = (e) => {
    // Commit to URL only on release to avoid spamming router.push on every pixel
    applyFilters({ maxPrepTime: e.target.value });
  };

  const handleReset = () => {
    setSliderVal("60");
    router.push(pathname);
  };

  return (
    <div className="filter-wrapper">
      <div className="filter-bar">
        
        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select 
            value={category} 
            onChange={handleCategoryChange} 
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="filter-group">
          <label className="filter-label">Difficulty</label>
          <select 
            value={difficulty} 
            onChange={handleDifficultyChange} 
            className="filter-select"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Max Preparation Time Filter */}
        <div className="filter-group" style={{ flexGrow: 1.5 }}>
          <label className="filter-label">Max Prep Time</label>
          <div className="range-container">
            <input 
              type="range" 
              min="5" 
              max="60" 
              step="5"
              value={sliderVal} 
              onChange={handleSliderChange} 
              onMouseUp={handleSliderRelease}
              onTouchEnd={handleSliderRelease}
              className="range-slider"
            />
            <span className="range-val">{sliderVal} mins</span>
          </div>
        </div>

        {/* Reset Filters button */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={handleReset} className="reset-btn">
            Reset Filters
          </button>
        </div>

      </div>
    </div>
  );
}
