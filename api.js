const API_BASE = 'https://dummyjson.com';
const LIMIT = 100;

export const api = {
    getBrands: (category) => fetch(`${API_BASE}/products/category/${category}?select=brand,reviews`).then(res => res.json()),
    
    getCategories: () => fetch(`${API_BASE}/products?limit=${LIMIT}&select=brand,category,reviews`).then(res => res.json().then(data => excludeCategories(data))),
};


function excludeCategories(data) {
    // Categories without brands
  const categoriesToSkip = new Set([
    "groceries",
    "home-decoration",
    "kitchen-accessories"
  ]);

  const filteredProducts = data.products.filter(product => {
    return !categoriesToSkip.has(product.category);
  });

  return { ...data, products: filteredProducts };
}