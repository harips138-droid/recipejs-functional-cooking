(() => {
  // --------------------------
  // State
  // --------------------------
  const state = {
    recipes: [
      {
        id: 1,
        title: "Spaghetti Bolognese",
        description: "Classic Italian pasta dish",
        ingredients: ["pasta", "tomato", "beef", "garlic"],
        steps: ["Boil pasta", "Cook sauce", "Mix together"],
        time: 30,
        difficulty: "easy"
      },
      {
        id: 2,
        title: "Pancakes",
        description: "Fluffy breakfast treat",
        ingredients: ["flour", "milk", "egg", "sugar"],
        steps: ["Mix ingredients", "Cook on skillet"],
        time: 15,
        difficulty: "easy"
      },
      {
        id: 3,
        title: "Caesar Salad",
        description: "Fresh salad with creamy dressing",
        ingredients: ["lettuce", "croutons", "parmesan", "dressing"],
        steps: ["Chop lettuce", "Add toppings", "Drizzle dressing"],
        time: 10,
        difficulty: "easy"
      }
      // Add more recipes here
    ],
    searchQuery: "",
    activeFilter: "all",
    sortType: "none",
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
  const renderSteps = (steps) => {
    let html = '<ol>';
    steps.forEach(step => {
      if (typeof step === 'string') html += `<li>${highlightMatch(step)}</li>`;
      else html += `<li>${highlightMatch(step.text)}${renderSteps(step.substeps)}</li>`;
    });
    html += '</ol>';
    return html;
  };

  const createRecipeCard = (recipe) => {
    const favHeart = isFavorited(recipe.id) ? "❤️" : "🤍";

    return `
      <div class="recipe-card" data-id="${recipe.id}">
        <h3>${highlightMatch(recipe.title)}</h3>
        <div class="recipe-meta">
          <span>⏱️ ${recipe.time} min</span>
          <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
        </div>
        <p>${highlightMatch(recipe.description)}</p>
        <button class="toggle-btn" data-toggle="steps" data-recipe-id="${recipe.id}">Show Steps</button>
        <button class="toggle-btn" data-toggle="ingredients" data-recipe-id="${recipe.id}">Show Ingredients</button>
        <div class="steps-container" id="steps-${recipe.id}">${renderSteps(recipe.steps)}</div>
        <div class="ingredients-container" id="ingredients-${recipe.id}"><ul>${recipe.ingredients.map(i => `<li>${highlightMatch(i)}</li>`).join('')}</ul></div>
        <button class="favorite-btn" data-recipe-id="${recipe.id}">${favHeart}</button>
      </div>
    `;
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
    switch (state.activeFilter) {
      case "favorites": return recipes.filter(r => isFavorited(r.id));
      case "easy": return recipes.filter(r => r.difficulty === "easy");
      case "medium": return recipes.filter(r => r.difficulty === "medium");
      case "hard": return recipes.filter(r => r.difficulty === "hard");
      case "quick": return recipes.filter(r => r.time <= 30);
      default: return recipes;
    }
  };

  const applySort = (recipes) => {
    switch (state.sortType) {
      case "name": return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
      case "time": return [...recipes].sort((a, b) => a.time - b.time);
      default: return recipes;
    }
  };

  const updateDisplay = () => {
    let visibleRecipes = applySearch(state.recipes);
    visibleRecipes = applyFilter(visibleRecipes);
    visibleRecipes = applySort(visibleRecipes);

    recipeContainer.innerHTML = visibleRecipes.map(createRecipeCard).join('');
    updateCounter(visibleRecipes.length, state.recipes.length);

    // Update active states
    filterButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === state.activeFilter));
    sortButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.sort === state.sortType));
  };

  // --------------------------
  // Event Handlers
  // --------------------------
  const handleSearch = debounce(() => {
    state.searchQuery = searchInput.value;
    clearSearchBtn.hidden = !state.searchQuery;
    updateDisplay();
  }, 300);

  const handleClearSearch = () => {
    searchInput.value = "";
    state.searchQuery = "";
    clearSearchBtn.hidden = true;
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
    updateDisplay();
  };

  const handleSortClick = (sortType) => {
    state.sortType = sortType;
    updateDisplay();
  };

  const handleToggleClick = (e) => {
    if (!e.target.classList.contains('toggle-btn')) return;
    const btn = e.target;
    const recipeId = btn.dataset.recipeId;
    const toggleType = btn.dataset.toggle;
    const container = document.getElementById(`${toggleType}-${recipeId}`);
    if (container) {
      container.classList.toggle('visible');
      btn.textContent = container.classList.contains('visible')
        ? `Hide ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`
        : `Show ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`;
    }
  };

  // --------------------------
  // Setup Event Listeners
  // --------------------------
  const setupEventListeners = () => {
    searchInput.addEventListener("input", handleSearch);
    clearSearchBtn.addEventListener("click", handleClearSearch);

    recipeContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("favorite-btn")) handleFavoriteToggle(Number(e.target.dataset.recipeId));
      handleToggleClick(e);
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
