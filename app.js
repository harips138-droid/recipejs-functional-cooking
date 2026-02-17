// // ============================
// Recipe Data - Foundation for all 4 parts
// ============================
const recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        time: 25,
        difficulty: "easy",
        description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
        category: "pasta"
    },
    {
        id: 2,
        title: "Chicken Tikka Masala",
        time: 45,
        difficulty: "medium",
        description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
        category: "curry"
    },
    {
        id: 3,
        title: "Homemade Croissants",
        time: 180,
        difficulty: "hard",
        description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
        category: "baking"
    },
    {
        id: 4,
        title: "Greek Salad",
        time: 15,
        difficulty: "easy",
        description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
        category: "salad"
    },
    {
        id: 5,
        title: "Beef Wellington",
        time: 120,
        difficulty: "hard",
        description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
        category: "meat"
    },
    {
        id: 6,
        title: "Vegetable Stir Fry",
        time: 20,
        difficulty: "easy",
        description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
        category: "vegetarian"
    },
    {
        id: 7,
        title: "Pad Thai",
        time: 30,
        difficulty: "medium",
        description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
        category: "noodles"
    },
    {
        id: 8,
        title: "Margherita Pizza",
        time: 60,
        difficulty: "medium",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
        category: "pizza"
    }
];

// ============================
// DOM Selection
// ============================
const recipeContainer = document.querySelector('#recipe-container');

// ============================
// State Management
// ============================
let currentFilter = 'all';
let currentSort = 'none';

// ============================
// Filter Functions
// ============================
const filterByDifficulty = (recipes, difficulty) => {
    if (difficulty === 'all') return recipes;
    return recipes.filter(recipe => recipe.difficulty === difficulty);
};

const filterByTime = (recipes, maxTime) => {
    return recipes.filter(recipe => recipe.time <= maxTime);
};

const applyFilter = (recipes, filterType) => {
    switch(filterType) {
        case 'easy':
        case 'medium':
        case 'hard':
            return filterByDifficulty(recipes, filterType);
        case 'quick':
            return filterByTime(recipes, 30);
        default:
            return recipes;
    }
};

// ============================
// Sort Functions
// ============================
const sortByName = (recipes) => [...recipes].sort((a, b) => a.title.localeCompare(b.title));
const sortByTime = (recipes) => [...recipes].sort((a, b) => a.time - b.time);

const applySort = (recipes, sortType) => {
    switch(sortType) {
        case 'name': return sortByName(recipes);
        case 'time': return sortByTime(recipes);
        default: return recipes;
    }
};

// ============================
// Render Functions
// ============================
const createRecipeCard = (recipe) => {
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
            </div>
            <p>${recipe.description}</p>
        </div>
    `;
};

const renderRecipes = (recipesToRender) => {
    const allCardsHTML = recipesToRender.map(createRecipeCard).join('');
    recipeContainer.innerHTML = allCardsHTML;
};

// ============================
// Update Display (Filter + Sort)
// ============================
const updateDisplay = () => {
    let recipesToDisplay = applyFilter(recipes, currentFilter);
    recipesToDisplay = applySort(recipesToDisplay, currentSort);
    renderRecipes(recipesToDisplay);
    updateActiveButtons();
};

// ============================
// Active Button Styling
// ============================
const updateActiveButtons = () => {
    document.querySelectorAll('#filters button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === currentFilter);
    });
    document.querySelectorAll('#sorts button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === currentSort);
    });
};

// ============================
// Event Listeners
// ============================
const setupEventListeners = () => {
    document.querySelectorAll('#filters button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            updateDisplay();
        });
    });

    document.querySelectorAll('#sorts button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSort = btn.dataset.sort;
            updateDisplay();
        });
    });
};

// ============================
// Initialize App
// ============================
updateDisplay();
setupEventListeners();
