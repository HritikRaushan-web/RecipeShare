"use client";

import { useState } from "react";

export default function IngredientsList({ ingredients }) {
  const [checkedItems, setCheckedItems] = useState({});

  const handleToggle = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <ul className="ingredients-list">
      {ingredients.map((ingredient, index) => {
        const isChecked = !!checkedItems[index];
        return (
          <li 
            key={index} 
            className="ingredient-item"
            onClick={() => handleToggle(index)}
          >
            <input
              type="checkbox"
              className="ingredient-checkbox"
              checked={isChecked}
              onChange={() => {}} // Controlled by the list item click
            />
            <span style={{ textDecoration: isChecked ? "line-through" : "none", color: isChecked ? "var(--text-muted)" : "var(--text-secondary)" }}>
              {ingredient}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
