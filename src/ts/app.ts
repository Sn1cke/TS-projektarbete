// ========== Declaring HTML elements ==========
const inputField = document.querySelector('#user-search') as HTMLInputElement;
const searchBtn = document.querySelector('#search-btn') as HTMLButtonElement;
const mealSearchResults = document.querySelector('.meals') as HTMLElement;
const searchHits = document.querySelector('#search-hits') as HTMLElement;
const searchHistory = document.querySelector('#search-history') as HTMLElement;
const randomContainer = document.querySelector('.random-container') as HTMLElement;

// ========== Three different URLs ==========
const searchURL: string = "https://themealdb.com/api/json/v1/1/search.php?s=";
const randomRecipeURL: string = "https://www.themealdb.com/api/json/v1/1/random.php";
const mealCategories: string = "https://www.themealdb.com/api/json/v1/1/categories.php";

// ========== Functions to prevent DRY ==========
const loadMealCards = function (arr) {
    arr.forEach(meal => {
        const mealHTML = `
        <article class="meal-card ${meal.strMeal}">
        <img class="meal-img" src="${meal.strMealThumb}" />
        <div class="like not-liked"></div>
        <div class="meal-info">
        <h3 class="meal-name">${meal.strMeal}</h3>
        <a href="url" class="meal-category">${meal.strCategory}</a>
        </div>
        </article>
        `;
        mealSearchResults.insertAdjacentHTML('afterbegin', mealHTML);
    });
}


// ========== Search button that takes user input and looks through an API ==========
// TODO: När jag skriver något som inte finns, ex. "Test" får jag error för att forEach kan inte läsa "null". Hur fixar jag det?
searchBtn.addEventListener("click", async (event) => {
    event.preventDefault()
    mealSearchResults.innerHTML = '';
    
    // ===== Fetches data from an API with user input as search value =====
    const res = await fetch(searchURL + inputField.value);
    const data = await res.json();
    console.log(data.meals);
    // ===== Creates a heading showing amount of hits on the search =====
    searchHits.innerHTML =`
    <h3 id="search-heading">${data.meals.length} matching results</h3>
    `;
    
    // ===== Creates a search history button with the input value its innerText =====
    const historyBtn = document.createElement('button');
    historyBtn.className = "history-btn";
    historyBtn.innerText = inputField.value;
    searchHistory.append(historyBtn);
    
    // ===== Added event listener to the history button to fetch and load the content =====
    historyBtn.addEventListener("click", async (event) => {
        mealSearchResults.innerHTML = '';
    
        const res = await fetch(searchURL + historyBtn.innerText);
        const data = await res.json();
        searchHits.innerHTML =`
        <h3 id="search-heading">${data.meals.length} matching results</h3>
        `;
        loadMealCards(data.meals);
        listenForLikes();
    });
    
    loadMealCards(data.meals);
    listenForLikes();
});


function listenForLikes () {
    const likes = document.querySelectorAll(".like") as NodeListOf<HTMLElement>;
    for (const like of likes) {
        like.addEventListener("click", function () {
            if(this.classList.contains('not-liked')) {
                this.classList.remove('not-liked')
                this.classList.add('liked')
            } else {
                this.classList.add('not-liked')
                this.classList.remove('liked')
            }
        })
    }
};


// ========== Funktion för att ladda ett random recipe, knapp för att slumpa igen ==========
async function randomRecipe () {
    const res = await fetch(randomRecipeURL);
    const data = await res.json();

    const image = document.createElement("img");
    image.id = "random-img";
    image.src = data.meals[0].strMealThumb;
    randomContainer.append(image);

    const randomInfo = `
        <article class="random-meal-info">
        <h2 class="meal-name">${data.meals[0].strMeal}</h2>
        <a href="url" class="meal-category">${data.meals[0].strCategory}</a>
        <h4>Instructions</h4>
        <p>${data.meals[0].strInstructions}</p>
        </article>
    `;
    randomContainer.insertAdjacentHTML('beforeend', randomInfo);
};
randomRecipe();