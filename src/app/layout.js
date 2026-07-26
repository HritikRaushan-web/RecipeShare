import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "RecipeShare | Premium Recipe Discoveries",
  description: "Browse, search, and filter a curated list of gourmet and everyday recipes.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="navbar">
          <div className="container nav-container">
            <Link href="/" className="logo">
              Recipe<span>Share</span>
            </Link>
            <nav className="nav-links">
              <Link href="/" className="nav-link active">Home</Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
            </nav>
          </div>
        </header>

        <main style={{ flex: 1 }}>
          {children}
        </main>

        <footer className="footer">
          <div className="container footer-content">
            <div>
              &copy; {new Date().getFullYear()} RecipeShare. Made with passion for food lovers.
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <Link href="/?category=vegetarian" style={{ color: "var(--text-secondary)" }}>Vegetarian</Link>
              <Link href="/?category=vegan" style={{ color: "var(--text-secondary)" }}>Vegan</Link>
              <Link href="/?category=non-vegetarian" style={{ color: "var(--text-secondary)" }}>Non-Vegetarian</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
