(() => {
 
  const state = {
    recipes: [
      {
        id: 1,
        title: "Spaghetti Bolognese",
        description: "Classic Italian pasta dish",
        ingredients: ["pasta", "tomato", "beef", "garlic"],
        steps: ["Boil pasta", "Cook sauce", "Mix together"],
        time: 30
      },
      {
        id: 2,
        title: "Pancakes",
        description: "Fluffy breakfast treat",
        ingredients: ["flour", "milk", "egg", "sugar"],
        steps: ["Mix ingredients", "Cook on skillet"],
        time: 15
      },
      {
        id: 3,
        title: "Caesar Salad",
        description: "Fresh salad with creamy dressing",
        ingredients: ["lettuce", "croutons", "parmesan", "dressing"],
        steps: ["Chop lettuce", "Add toppings", "Drizzle dressing"],
        time: 10
      }
      // Add more recipes here
    ],
    searchQuery: "",
    activeFilter: "all",
    sortType: null,
    favorites: JSON.parse(localStorage.getItem("recipeFavorites")) || []
  };

  // --------------------------
  // DOM References
  // --------------------------
  const recipeContainer = document.getElementById("recipe-container");
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortButtons = document.querySelectorAll(".sort-btn");
  const recipeCounter = document.getElementById("recipe-counter");

  // --------------------------
  // Utility Functions
  // --------------------------
  const debounce = (fn, delay = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const saveFavorites = () => {
    localStorage.setItem("recipeFavorites", JSON.stringify(state.favorites));
  };

  const isFavorited = (id) => state.favorites.includes(id);

  const highlightMatch = (text) => {
    const query = state.searchQuery.trim();
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, '<mark>$1</mark>');
  };

  // --------------------------
  // Rendering Functions
  // --------------------------
  const createRecipeCard = (recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const favHeart = isFavorited(recipe.id) ? "❤️" : "🤍";

    card.innerHTML = `
      <h3>${highlightMatch(recipe.title)}</h3>
      <p>${highlightMatch(recipe.description)}</p>
      <div class="recipe-ingredients">
        <strong>Ingredients:</strong>
        <ul>${recipe.ingredients.map(i => `<li>${highlightMatch(i)}</li>`).join("")}</ul>
      </div>
      <div class="recipe-steps">
        <strong>Steps:</strong>
        <ol>${recipe.steps.map(s => `<li>${highlightMatch(s)}</li>`).join("")}</ol>
      </div>
      <button class="favorite-btn" data-recipe-id="${recipe.id}">${favHeart}</button>
    `;
    return card;
  };

  const updateCounter = (visibleCount, totalCount) => {
    recipeCounter.textContent = `Showing ${visibleCount} of ${totalCount} recipes`;
  };

  const applySearch = (recipes) => {
    if (!state.searchQuery) return recipes;
    const query = state.searchQuery.toLowerCase().trim();
    return recipes.filter(r => 
      r.title.toLowerCase().includes(query) ||
      r.ingredients.some(i => i.toLowerCase().includes(query)) ||
      r.description.toLowerCase().includes(query)
    );
  };

  const applyFilter = (recipes) => {
    if (state.activeFilter === "favorites") {
      return recipes.filter(r => isFavorited(r.id));
    }
    return recipes;
  };

  const applySort = (recipes) => {
    if (state.sortType === "name") {
      return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
    } else if (state.sortType === "time") {
      return [...recipes].sort((a, b) => a.time - b.time);
    }
    return recipes;
  };

  const updateDisplay = () => {
    let visibleRecipes = applySearch(state.recipes);
    visibleRecipes = applyFilter(visibleRecipes);
    visibleRecipes = applySort(visibleRecipes);

    recipeContainer.innerHTML = "";
    visibleRecipes.forEach(recipe => recipeContainer.appendChild(createRecipeCard(recipe)));

    updateCounter(visibleRecipes.length, state.recipes.length);
  };

  // --------------------------
  // Event Handlers
  // --------------------------
  const handleSearch = debounce(() => {
    state.searchQuery = searchInput.value;
    clearSearchBtn.classList.toggle("show", !!state.searchQuery);
    updateDisplay();
  }, 300);

  const handleClearSearch = () => {
    searchInput.value = "";
    state.searchQuery = "";
    clearSearchBtn.classList.remove("show");
    updateDisplay();
  };

  const handleFavoriteToggle = (id) => {
    const idx = state.favorites.indexOf(id);
    if (idx > -1) state.favorites.splice(idx, 1);
    else state.favorites.push(id);
    saveFavorites();
    updateDisplay();
  };

  const handleFilterClick = (filter) => {
    state.activeFilter = state.activeFilter === filter ? "all" : filter;
    filterButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === state.activeFilter));
    updateDisplay();
  };

  const handleSortClick = (sortType) => {
    state.sortType = sortType;
    sortButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.sort === sortType));
    updateDisplay();
  };

  // --------------------------
  // Setup Event Listeners
  // --------------------------
  const setupEventListeners = () => {
    searchInput.addEventListener("input", handleSearch);
    clearSearchBtn.addEventListener("click", handleClearSearch);

    recipeContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("favorite-btn")) {
        handleFavoriteToggle(Number(e.target.dataset.recipeId));
      }
    });

    filterButtons.forEach(btn => btn.addEventListener("click", () => handleFilterClick(btn.dataset.filter)));
    sortButtons.forEach(btn => btn.addEventListener("click", () => handleSortClick(btn.dataset.sort)));
  };

  // --------------------------
  // Initialize App
  // --------------------------
  const init = () => {
    console.log("RecipeJS App Initialized");
    setupEventListeners();
    updateDisplay();
  };

  init();
})();
