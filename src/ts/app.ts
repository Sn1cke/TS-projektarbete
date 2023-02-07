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


// ========== Search button that takes user input and looks through an API ==========
// TODO: När jag skriver något som inte finns, ex. "Test" får jag error för att forEach kan inte läsa "null". Hur fixar jag det?
searchBtn.addEventListener("click", async (event) => {
    event.preventDefault()
    mealSearchResults.innerHTML = '';
    
    const res = await fetch(searchURL + inputField.value);
    const data = await res.json();
    searchHits.innerHTML =`
    <h3 id="search-heading">${data.meals.length} matching results</h3>
    `;
    const historyBtn = document.createElement('button');
    historyBtn.className = "history-btn";
    historyBtn.innerText = inputField.value;
    searchHistory.append(historyBtn);
    historyBtn.addEventListener("click", async (event) => {
        mealSearchResults.innerHTML = '';
    
        const res = await fetch(searchURL + historyBtn.innerText);
        const data = await res.json();
        searchHits.innerHTML =`
        <h3 id="search-heading">${data.meals.length} matching results</h3>
        `;
        data.meals.forEach(meal => {
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
    });


    data.meals.forEach(meal => {
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
        console.log(data.meals[0]);


        // TODO: Fixa den här funktionen. Det går att toggla, men varannan kort har ett ojämt nummer och togglar en gång mer än föregående. Vad beror det på?
        function listenForLikes () {
            const likes = document.querySelectorAll(".like");
            likes.forEach(like => {
                like.addEventListener("click", (event) => {
                    console.log("You clicked");
                    (event.target as HTMLElement).classList.toggle("not-liked");
                    (event.target as HTMLElement).classList.toggle("liked");
                })
            })
        }
        listenForLikes();

    });
});


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


    console.log(data.meals[0]);
}

randomRecipe();