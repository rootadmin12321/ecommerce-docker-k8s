import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./Home.css"; // Make sure you have this CSS file

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featuredCar, setFeaturedCar] = useState(null);
  const [recommendedCars, setRecommendedCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        // Featured car: 1 random
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setFeaturedCar(data[randomIndex]);
        }

        // Recommended cars: 3 random
        if (data.length > 3) {
          let shuffled = [...data].sort(() => 0.5 - Math.random());
          let recommended = shuffled.slice(0, 3);
          setRecommendedCars(recommended);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="home-container">
      {/* Featured Car */}
      <section className="featured-section">
        <h2 className="section-title">🚗 Featured Car</h2>
        {featuredCar ? (
          <div className="featured-card">
            <ProductCard product={featuredCar} />
          </div>
        ) : (
          <p className="loading-text">Loading featured car...</p>
        )}
      </section>

      {/* Recommended Cars */}
      <section className="recommended-section">
        <h2 className="section-title">✨ Recommended Cars</h2>
        <div className="cars-grid">
          {recommendedCars.length > 0 ? (
            recommendedCars.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="loading-text">Loading recommended cars...</p>
          )}
        </div>
      </section>

      {/* All Cars */}
      <section className="all-cars-section">
        <h2 className="section-title">All Cars</h2>
        <div className="cars-grid">
          {products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="loading-text">Loading all cars...</p>
          )}
        </div>
      </section>
    </div>
  );
}
