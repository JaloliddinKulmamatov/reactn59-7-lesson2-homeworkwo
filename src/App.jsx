import React, { useState, useEffect, useReducer } from "react";
import "./App.css";

const initialState = {
  items: [],
  visibleProducts: [],
  categoryFilter: "All",
  priceFilter: "all",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ITEMS":
      return {
        ...state,
        items: action.payload,
        visibleProducts: action.payload,
      };
    case "SET_CATEGORY_FILTER":
      return { ...state, categoryFilter: action.payload };
    case "SET_PRICE_FILTER":
      return { ...state, priceFilter: action.payload };
    case "FILTER_PRODUCTS":
      let filteredProducts = state.items;

      if (state.categoryFilter !== "All") {
        filteredProducts = filteredProducts.filter(
          (item) => item.category === state.categoryFilter
        );
      }

      if (state.priceFilter === "cheap") {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (state.priceFilter === "expensive") {
        filteredProducts.sort((a, b) => b.price - a.price);
      }

      return { ...state, visibleProducts: filteredProducts };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchUrl(API_URL) {
      const response = await fetch(API_URL);
      const data = await response.json();
      dispatch({ type: "SET_ITEMS", payload: data });
    }

    fetchUrl("http://localhost:3000/products/").catch((error) =>
      console.error("Error fetching data:", error)
    );
  }, []);

  useEffect(() => {
    dispatch({ type: "FILTER_PRODUCTS" });
  }, [state.categoryFilter, state.priceFilter]);

  const handleCategoryFilterChange = (event) => {
    dispatch({ type: "SET_CATEGORY_FILTER", payload: event.target.value });
  };

  const handlePriceFilterChange = (event) => {
    dispatch({ type: "SET_PRICE_FILTER", payload: event.target.value });
  };

  return (
    <div className="ProductApp">
      <div className="filter">
        <label htmlFor="priceFilter">Filter by Price:</label>
        <select
          id="priceFilter"
          value={state.priceFilter}
          onChange={handlePriceFilterChange}
        >
          <option value="all">Default</option>
          <option value="cheap">Cheap to Expensive</option>
          <option value="expensive">Expensive to Cheap</option>
        </select>
        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select
          id="categoryFilter"
          value={state.categoryFilter}
          onChange={handleCategoryFilterChange}
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Apparel">Apparel</option>
          <option value="Accessories">Accessories</option>
          <option value="Sports & Outdoors">Sports & Outdoors</option>
        </select>
      </div>
      <div className="products">
        {state.visibleProducts.map((p) => (
          <div key={p.id} className="product">
            <h3 className="product-name">{p.name}</h3>
            <p className="category">Category: {p.category}</p>
            <p className="price">Price: ${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
