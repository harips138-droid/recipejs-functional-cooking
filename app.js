const RecipeApp = (() => {
  console.log("RecipeApp initializing...");

  // ====== DATA ======
  const recipes = [
    {
      id:1, title:"Classic Spaghetti Carbonara", time:25, difficulty:"easy",
      description:"A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
      category:"pasta",
      ingredients:["spaghetti","eggs","pancetta","parmesan","black pepper"],
      steps:["Boil pasta","Cook pancetta","Mix eggs and cheese","Combine pasta and sauce","Serve immediately"]
    },
    {
      id:2, title:"Chicken Tikka Masala", time:45, difficulty:"medium",
      description:"Tender chicken pieces in a creamy, spiced tomato sauce.",
      category:"curry",
      ingredients:["chicken","yogurt","tomato","garam masala","cream"],
      steps:[
        "Marinate chicken in yogurt and spices",
        {
          text:"Cook chicken",
          substeps:["Heat oil","Cook chicken until brown","Remove chicken"]
        },
        {
          text:"Make sauce",
          substeps:["Sauté onions","Add tomato paste","Add spices","Simmer","Add cream"]
        },
        "Combine chicken and sauce",
        "Serve with rice"
      ]
    },
    {
      id:3, title:"Homemade Croissants", time:180, difficulty:"hard",
      description:"Buttery, flaky French pastries.",
      category:"baking",
      ingredients:["flour","butter","yeast","milk","sugar","salt"],
      steps:["Prepare dough","Layer butter","Fold dough","Shape croissants","Proof","Bake"]
    },
    {
      id:4, title:"Greek Salad", time:15, difficulty:"easy",
      description:"Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
      category:"salad",
      ingredients:["cucumber","tomato","feta","olive oil","olives"],
      steps:["Chop vegetables","Add feta and olives","Drizzle with olive oil","Season and toss"]
    },
    {
      id:5, title:"Beef Wellington", time:120, difficulty:"hard",
      description:"Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
      category:"meat",
      ingredients:["beef","mushrooms","puff pastry","mustard","egg"],
      steps:["Prepare beef","Make mushroom duxelles","Wrap beef in pastry","Bake","Serve"]
    },
    {
      id:6, title:"Vegetable Stir Fry", time:20, difficulty:"easy",
      description:"Colorful mixed vegetables cooked quickly in a savory sauce.",
      category:"vegetarian",
      ingredients:["broccoli","carrot","bell pepper","soy sauce","garlic"],
      steps:["Chop vegetables","Heat pan","Stir fry veggies","Add sauce","Serve hot"]
    },
    {
      id:7, title:"Pad Thai", time:30, difficulty:"medium",
      description:"Thai stir-fried rice noodles with shrimp, peanuts, and tamarind sauce.",
      category:"noodles",
      ingredients:["rice noodles","shrimp","peanuts","tamarind paste","bean sprouts"],
      steps:["Soak noodles","Cook shrimp","Prepare sauce","Stir fry noodles and shrimp","Garnish with peanuts"]
    },
    {
      id:8, title:"Margherita Pizza", time:60, difficulty:"medium",
      description:"Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
      category:"pizza",
      ingredients:["pizza dough","tomato sauce","mozzarella","basil","olive oil"],
      steps:["Preheat oven","Roll dough","Spread sauce","Add cheese","Bake","Add basil"]
    }
  ];

  // ====== STATE ======
  let currentFilter = 'all';
  let currentSort = '';
  let searchQuery = '';
  let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];

  // ====== DOM ======
  const recipeContainer = document.querySelector('#recipe-container');
  const filterButtons = document.querySelectorAll('.filter-buttons button');
  const sortButtons = document.querySelectorAll('.sort-buttons button');
  const searchInput = document.querySelector('#search-input');
  const clearSearchBtn = document.querySelector('#clear-search');
  const recipeCounter = document.querySelector('#recipe-counter');

  // ====== FUNCTIONS ======
  const createStepsHTML = (steps) => {
    if(!steps || !steps.length) return '';
    const createList = (arr) => {
      let html = '<ul>';
      arr.forEach(step => {
        if(typeof step === 'string') {
          html += `<li>${step}</li>`;
        } else {
          html += `<li>${step.text}${createList(step.substeps)}</li>`;
        }
      });
      html += '</ul>';
      return html;
    };
    return `<div class="steps-container">${createList(steps)}</div>`;
  };

  const createIngredientsHTML = (ingredients) => {
    if(!ingredients || !ingredients.length) return '';
    const items = ingredients.map(i => `<li>${i}</li>`).join('');
    return `<div class="ingredients-container"><ul>${items}</ul></div>`;
  };

  const createRecipeCard = (recipe) => {
    const isFavorited = favorites.includes(recipe.id) ? 'favorited' : '';
    return `
      <div class="recipe-card" data-id="${recipe.id}">
        <span class="favorite-btn ${isFavorited}" data-recipe-id="${recipe.id}">&#10084;</span>
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
          <span>⏱️ ${recipe.time} min</span>
          <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
        </div>
        <p>${recipe.description}</p>
        <button class="toggle-btn" data-toggle="steps" data-recipe-id="${recipe.id}">Show Steps</button>
        <button class="toggle-btn" data-toggle="ingredients" data-recipe-id="${recipe.id}">Show Ingredients</button>
        ${createStepsHTML(recipe.steps)}
        ${createIngredientsHTML(recipe.ingredients)}
      </div>
    `;
  };

  const renderRecipes = (recipesToRender) => {
    recipeContainer.innerHTML = recipesToRender.map(createRecipeCard).join('');
    recipeCounter.textContent = `Showing ${recipesToRender.length} of ${recipes.length} recipes`;
  };

  const applyFilter = (arr) => {
    if(currentFilter === 'all') return arr;
    if(currentFilter === 'favorites') return arr.filter(r => favorites.includes(r.id));
    return arr.filter(r => r.difficulty === currentFilter);
  };

  const applySearch = (arr) => {
    if(!searchQuery) return arr;
    const q = searchQuery.toLowerCase();
    return arr.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.toLowerCase().includes(q)) ||
      r.description.toLowerCase().includes(q)
    );
  };

  const applySort = (arr) => {
    if(currentSort === 'time') return [...arr].sort((a,b)=>a.time-b.time);
    if(currentSort === 'title') return [...arr].sort((a,b)=>a.title.localeCompare(b.title));
    return arr;
  };

  const updateDisplay = () => {
    let filtered = applyFilter(recipes);
    filtered = applySearch(filtered);
    filtered = applySort(filtered);
    renderRecipes(filtered);
  };

  const toggleFavorite = (id) => {
    id = Number(id);
    if(favorites.includes(id)) favorites = favorites.filter(fid => fid!==id);
    else favorites.push(id);
    localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
    updateDisplay();
  };

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // ====== EVENT LISTENERS ======
  recipeContainer.addEventListener('click', (e) => {
    const btn = e.target;
    if(btn.classList.contains('toggle-btn')) {
      const recipeId = btn.dataset.recipeId;
      const type = btn.dataset.toggle;
      const container = document.querySelector(`.recipe-card[data-id="${recipeId}"] .${type}-container`);
      if(container) {
        container.classList.toggle('visible');
        btn.textContent = container.classList.contains('visible') ? `Hide ${type.charAt(0).toUpperCase()+type.slice(1)}` : `Show ${type.charAt(0).toUpperCase()+type.slice(1)}`;
      }
    }
    if(btn.classList.contains('favorite-btn')) {
      toggleFavorite(btn.dataset.recipeId);
    }
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      updateDisplay();
    });
  });

  sortButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentSort = btn.dataset.sort;
      updateDisplay();
    });
  });

  searchInput.addEventListener('input', debounce((e)=>{
    searchQuery = e.target.value;
    updateDisplay();
  }, 300));

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    updateDisplay();
  });

  console.log("RecipeApp ready!");
  return { init: updateDisplay };
})();

// Initialize
RecipeApp.init();
