import { api } from './api.js';

let allProducts = [];

function formatCategoryName(category) {
    return category
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

api.getCategories()
.then(productsData => {
    allProducts = productsData;
    
    const categorySelect = document.getElementById('category');
    const categories = [...new Set(productsData.products.map(p => p.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = formatCategoryName(category);
        categorySelect.appendChild(option);
    });
    
    if (categories.length > 0) {
        loadBrandsForCategory(categories[0]);
        updateChartWithFilters();
    }
});

let myChart;

function createChart(productsData) {
    const ctx = document.getElementById('myChart');
    const chartData = processChartData(productsData);

    const rootStyles = getComputedStyle(document.documentElement);
    const borderColor = rootStyles.getPropertyValue('--line-chart-stroke').trim();
    const borderColorBoard = rootStyles.getPropertyValue('--border-colorboard').trim();
    const borderColorPositive = rootStyles.getPropertyValue('--line-chart-stroke-positive').trim();
    const borderColorNegative = rootStyles.getPropertyValue('--line-chart-stroke-negative').trim();
    const textColor = rootStyles.getPropertyValue('--text-main').trim();
    const gridColor = rootStyles.getPropertyValue('--line-chart-grid').trim();
    const linkColor = rootStyles.getPropertyValue('--links').trim();
    const highlightColor = rootStyles.getPropertyValue('--highlight').trim();

    
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.months,
            datasets: [{
                label: 'Reviews Total',
                data: chartData.totalData,
                backgroundColor: '#66AFDA',
                borderColor: '#0076d1',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            },
            {
                label: 'Reviews Positivos',
                data: chartData.positiveData,
                backgroundColor: '#85B18B',
                borderColor: '#4CAF50',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            },
            {
                label: 'Reviews Negativos',
                data: chartData.negativeData,
                backgroundColor: '#E77575',
                borderColor: '#f44336',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }

    });
}

function processChartData(productsData) {
    const reviewsByMonth = {};
    
    productsData.products.forEach(product => {
        if (product.reviews && product.reviews.length > 0) {
            product.reviews.forEach(review => {
            const date = new Date(review.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!reviewsByMonth[monthKey]) {
                reviewsByMonth[monthKey] = { total: 0, positive: 0, negative: 0 };
            }
            
            reviewsByMonth[monthKey].total++;
            if (review.rating >= 3.5) reviewsByMonth[monthKey].positive++;
            if (review.rating <= 3.5) reviewsByMonth[monthKey].negative++;
            });
        }
    });
    
    const months = Object.keys(reviewsByMonth).sort();
    const totalData = months.map(month => reviewsByMonth[month].total);
    const positiveData = months.map(month => reviewsByMonth[month].positive);
    const negativeData = months.map(month => reviewsByMonth[month].negative);
    
    return { months, totalData, positiveData, negativeData };
}

function updateChart(productsData) {
    const chartData = processChartData(productsData);

    if (myChart) {
        myChart.data.labels = chartData.months;
        myChart.data.datasets[0].data = chartData.totalData;
        myChart.data.datasets[1].data = chartData.positiveData;
        myChart.data.datasets[2].data = chartData.negativeData;
        myChart.update();
    } else {
        createChart(productsData);
    }
}

function loadBrandsForCategory(category) {
    const brandSelect = document.getElementById('brand');
    brandSelect.innerHTML = '';
    
    const brands = [...new Set(allProducts.products
        .filter(p => p.category === category)
        .map(p => p.brand)
        .filter(Boolean)
    )];
    
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
}

function updateChartWithFilters() {
    const categorySelect = document.getElementById('category');
    const brandSelect = document.getElementById('brand');
    const reviewsSelect = document.getElementById('reviews');
    
    let filteredProducts = allProducts.products;
    
    // Filter by category
    if (categorySelect.value) {
        filteredProducts = filteredProducts.filter(p => p.category === categorySelect.value);
    }
    
    // Filter by brand
    if (brandSelect.value) {
        filteredProducts = filteredProducts.filter(p => p.brand === brandSelect.value);
    }
    
    // Filter by type of reviews
    if (reviewsSelect.value !== 'All') {
        filteredProducts = filteredProducts.map(product => ({
            ...product,
            reviews: product.reviews.filter(review => {
                if (reviewsSelect.value === 'Positive') return review.rating >= 3.5;
                if (reviewsSelect.value === 'Negative') return review.rating < 3.5;
                return true;
            })
        }));
    }
    
    const chartData = { products: filteredProducts };
    updateChart(chartData);
    
    // hidden/show dataset Reviews Total
    if (myChart) {
        myChart.data.datasets[0].hidden = reviewsSelect.value !== 'All';
        myChart.update();
    }
}


 
function changeCategory() {
    const selectedCategory = document.getElementById('category').value;
    if (selectedCategory) {
        document.getElementById('reviews').value = 'All';
        loadBrandsForCategory(selectedCategory);
        updateChartWithFilters();
    }
}

function changeBrand() {
    document.getElementById('reviews').value = 'All';
    updateChartWithFilters();
}

function changeReviews() {
    updateChartWithFilters();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('category').addEventListener('change', changeCategory);
    document.getElementById('brand').addEventListener('change', changeBrand);
    document.getElementById('reviews').addEventListener('change', changeReviews);
});