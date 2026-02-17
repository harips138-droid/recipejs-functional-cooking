const RecipeApp = (() => {
    console.log("RecipeApp initializing...");

    // ----- Recipe Data -----
    const recipes = [
        {
            id: 1, title: "Classic Spaghetti Carbonara", time: 25, difficulty: "easy",
            description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
            category: "pasta",
            ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Black Pepper"],
            steps: ["Boil spaghetti","Cook pancetta","Mix eggs and cheese",{text:"Combine pasta and sauce",substeps:["Drain pasta","Mix with pancetta","Add egg-cheese mixture"]},"Serve hot"]
        },
        {
            id: 2, title: "Chicken Tikka Masala", time: 45, difficulty: "medium",
            description: "Tender chicken pieces in a creamy, spiced tomato sauce.", category: "curry",
            ingredients: ["Chicken", "Yogurt", "Tomatoes", "Garam Masala", "Cream"],
            steps: ["Marinate chicken","Cook chicken",{text:"Prepare sauce",substeps:["Heat oil","Add spices","Add tomato and cream"]},"Combine chicken and sauce","Serve with rice"]
        },
        {
            id: 3, title: "Homemade Croissants", time: 180, difficulty: "hard",
            description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
            category: "baking",
            ingredients: ["Flour", "Butter", "Yeast", "Sugar", "Milk", "Salt"],
            steps: ["Prepare dough","Fold butter into dough",{text:"Shape croissants",substeps:["Roll dough","Cut triangles","Roll triangles"]},"Proof croissants","Bake until golden"]
        },
        {
            id: 4, title: "Greek Salad", time: 15, difficulty: "easy",
            description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
            category: "salad",
            ingredients: ["Tomatoes", "Cucumber", "Onion", "Feta Cheese", "Olives", "Olive Oil"],
            steps: ["Chop vegetables","Mix vegetables in bowl","Add feta and olives","Drizzle olive oil","Season and serve"]
        },
        {
            id: 5, title: "Beef Wellington", time: 120, difficulty: "hard",
            description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
            category: "meat",
            ingredients: ["Beef fillet", "Mushrooms", "Puff pastry", "Eggs", "Mustard"],
            steps: ["Prepare beef fillet","Cook mushroom duxelles",{text:"Wrap beef",substeps:["Coat beef with mustard","Wrap in duxelles","Wrap in puff pastry"]},"Bake until golden","Rest and serve"]
        },
        {
            id: 6, title: "Vegetable Stir Fry", time: 20, difficulty: "easy",
            description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
            category: "vegetarian",
            ingredients: ["Broccoli", "Carrots", "Bell peppers", "Soy sauce", "Garlic", "Ginger"],
            steps: ["Chop vegetables","Heat pan with oil","Stir-fry vegetables","Add sauce","Cook until tender-crisp"]
        },
        {
            id: 7, title: "Pad Thai", time: 30, difficulty: "medium",
            description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
            category: "noodles",
            ingredients: ["Rice noodles", "Shrimp", "Eggs", "Peanuts", "Tamarind sauce", "Bean sprouts"],
            steps: ["Soak noodles","Cook shrimp and eggs","Stir-fry noodles with sauce","Add vegetables and peanuts","Serve hot"]
        },
        {
            id: 8, title: "Margherita Pizza", time: 60, difficulty: "medium",
            description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
            category: "pizza",
            ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil", "Olive oil"],
            steps: ["Preheat oven","Prepare dough","Spread sauce and add toppings","Bake until crust is golden","Add fresh basil before serving"]
        }
    ];

    // ----- DOM Elements -----
    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('[data-filter]');
    const sortButtons = document.querySelectorAll('[data-sort]');

    // ----- State -----
    let currentFilter = 'all';
    let currentSort = 'none';

    // ----- Filtering -----
    const applyFilter = (recipes, filterType) => {
        switch(filterType){
            case 'easy': return recipes.filter(r => r.difficulty === 'easy');
            case 'medium': return recipes.filter(r => r.difficulty === 'medium');
            case 'hard': return recipes.filter(r => r.difficulty === 'hard');
            case 'quick': return recipes.filter(r => r.time <= 30);
            default: return recipes;
        }
    };

    // ----- Sorting -----
    const applySort = (recipes, sortType) => {
        switch(sortType){
            case 'name': return [...recipes].sort((a,b)=>a.title.localeCompare(b.title));
            case 'time': return [...recipes].sort((a,b)=>a.time-b.time);
            default: return recipes;
        }
    };

    // ----- Recursive Steps Rendering -----
    const renderSteps = (steps) => {
        let html = '<ol>';
        steps.forEach(step => {
            if(typeof step === 'string') html += `<li>${step}</li>`;
            else html += `<li>${step.text}${renderSteps(step.substeps)}</li>`;
        });
        html += '</ol>';
        return html;
    };

    // ----- Recipe Card -----
    const createRecipeCard = (recipe) => `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
            </div>
            <p>${recipe.description}</p>
            <button class="toggle-btn" data-toggle="steps" data-recipe-id="${recipe.id}">Show Steps</button>
            <button class="toggle-btn" data-toggle="ingredients" data-recipe-id="${recipe.id}">Show Ingredients</button>
            <div class="steps-container" id="steps-${recipe.id}">${renderSteps(recipe.steps)}</div>
            <div class="ingredients-container" id="ingredients-${recipe.id}"><ul>${recipe.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul></div>
        </div>
    `;

    // ----- Render -----
    const renderRecipes = (recipesToRender) => recipeContainer.innerHTML = recipesToRender.map(createRecipeCard).join('');

    // ----- Update Display -----
    const updateDisplay = () => {
        let result = recipes;
        result = applyFilter(result, currentFilter);
        result = applySort(result, currentSort);
        renderRecipes(result);
        filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter===currentFilter));
        sortButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.sort===currentSort));
    };

    // ----- Toggle Steps/Ingredients -----
    const handleToggleClick = (e) => {
        if(!e.target.classList.contains('toggle-btn')) return;
        const btn = e.target;
        const recipeId = btn.dataset.recipeId;
        const toggleType = btn.dataset.toggle;
        const container = document.getElementById(`${toggleType}-${recipeId}`);
        if(container){
            container.classList.toggle('visible');
            btn.textContent = container.classList.contains('visible') ? `Hide ${toggleType.charAt(0).toUpperCase()+toggleType.slice(1)}` : `Show ${toggleType.charAt(0).toUpperCase()+toggleType.slice(1)}`;
        }
    };

    // ----- Event Listeners -----
    const setupEventListeners = () => {
        filterButtons.forEach(btn => btn.addEventListener('click', ()=>{currentFilter=btn.dataset.filter; updateDisplay();}));
        sortButtons.forEach(btn => btn.addEventListener('click', ()=>{currentSort=btn.dataset.sort; updateDisplay();}));
        recipeContainer.addEventListener('click', handleToggleClick);
    };

    // ----- Init -----
    const init = () => {
        console.log("RecipeApp ready!");
        updateDisplay();
        setupEventListeners();
    };

    return { init, updateDisplay };
})();

document.addEventListener('DOMContentLoaded', () => RecipeApp.init());
