// ========== Declaring HTML elements ==========
const dropdownCategories = document.querySelector(".dropdown-content");
const favMeals = document.querySelector("#fav-meals") as HTMLButtonElement;
const inputField = document.querySelector("#user-search") as HTMLInputElement;
const searchBtn = document.querySelector("#search-btn") as HTMLButtonElement;
const introductionContainer = document.querySelector(
  ".introduction"
) as HTMLElement;
const highlightContainer = document.querySelector(
  ".highlighted-recipe"
) as HTMLElement;
const searchHeader = document.querySelector(".search-header");
const searchContainer = document.querySelector(
  ".search-container"
) as HTMLElement;
const mealSearchResults = document.querySelector(".meals") as HTMLElement;
const searchHits = document.querySelector("#search-hits") as HTMLElement;
const searchHistory = document.querySelector("#search-history") as HTMLElement;
const randomContainer = document.querySelector(
  ".random-container"
) as HTMLElement;

// ========== Three different URLs ==========
const searchURL: string = "https://themealdb.com/api/json/v1/1/search.php?s=";
const randomRecipeURL: string =
  "https://www.themealdb.com/api/json/v1/1/random.php";
const mealID: string = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const mealCategories: string =
  "https://www.themealdb.com/api/json/v1/1/categories.php";
const filterCategory: string =
  "https://www.themealdb.com/api/json/v1/1/filter.php?c=";

// ===== Array to store the favourite meals =====
let favArr: string[] = [];

// ========== DID I REPEAT MYSELF??? ==========
const highlightFunction = function (targetMealID: string) {
  const mealIMG = document.querySelector(".meal-img");
  mealIMG.addEventListener("click", async () => {
    const res = await fetch(mealID + targetMealID);
    const data = await res.json();
    console.log(data);
    mealSearchResults.innerHTML = "";
    searchHits.innerHTML = "";
    searchHistory.innerHTML = "";

    console.log(data.meals[0].strMeal);

    highlightContainer.classList.remove("hidden");
    highlightContainer.innerHTML = "";

    const recipeHTML = `
      <article class="highlighted-meal">
        <img class="highlighted-img" src="${data.meals[0].strMealThumb}" />
        <h2 class="highlighted-name">${data.meals[0].strMeal}</h2>
        <p class="highlighted-category">${data.meals[0].strCategory}</p>
        <h4>Ingredients</h4>
        <ul>
            <li>${data.meals[0].strMeasure1} ${data.meals[0].strIngredient1}</li>
            <li>${data.meals[0].strMeasure2} ${data.meals[0].strIngredient2}</li>
            <li>${data.meals[0].strMeasure3} ${data.meals[0].strIngredient3}</li>
            <li>${data.meals[0].strMeasure4} ${data.meals[0].strIngredient4}</li>
            <li>${data.meals[0].strMeasure5} ${data.meals[0].strIngredient5}</li>
            <li>${data.meals[0].strMeasure6} ${data.meals[0].strIngredient6}</li>
            <li>${data.meals[0].strMeasure7} ${data.meals[0].strIngredient7}</li>
            <li>${data.meals[0].strMeasure8} ${data.meals[0].strIngredient8}</li>
        </ul>
        <h4>Instructions</h4>
        <p>${data.meals[0].strInstructions}</p>
      </article>
      `;

    highlightContainer.insertAdjacentHTML("afterbegin", recipeHTML);
  });
};

const loadMealCards = function (arr) {
  highlightContainer.classList.add("hidden");
  arr.forEach((meal) => {
    const mealHTML = `
        <article class="meal-card ${meal.idMeal}">
            <img class="meal-img" src="${meal.strMealThumb}" />
            <div class="like not-liked">
            </div>
            <div class="meal-info">
            <h3 class="meal-name">${meal.strMeal}</h3>
            <p class="meal-category">${meal.strCategory}</p>
            </div>
        </article>
        `;
    mealSearchResults.insertAdjacentHTML("afterbegin", mealHTML);
    highlightFunction(meal.idMeal);

    const notLiked = document.querySelector(".not-liked");
    if (favArr.includes(meal.idMeal)) {
      notLiked.classList.remove("not-liked");
      notLiked.classList.add("liked");
    }
  });
};

const hideIntro = function () {
  introductionContainer.classList.add("hidden");
  searchContainer.classList.remove("hidden");
};

async function categoryMenu() {
  highlightContainer.classList.add("hidden");
  const res = await fetch(mealCategories);
  const data = await res.json();
  data.categories.forEach((category) => {
    const categoryName = document.createElement("p");
    categoryName.innerText = category.strCategory;
    dropdownCategories.append(categoryName);

    categoryName.addEventListener("click", async () => {
      const res2 = await fetch(filterCategory + categoryName.innerText);
      const data2 = await res2.json();
      mealSearchResults.innerHTML = "";
      data2.meals.forEach((meal) => {
        const mealHTML = `
        <article class="meal-card ${meal.idMeal}">
            <img class="meal-img" src="${meal.strMealThumb}" />
            <div class="like not-liked">
            </div>
            <div class="meal-info">
            <h3 class="meal-name">${meal.strMeal}</h3>
            <p class="meal-category">${categoryName.innerText}</p>
            </div>
        </article>
        `;
        mealSearchResults.insertAdjacentHTML("afterbegin", mealHTML);
        searchHits.innerHTML = `<h3 id="search-heading">${data2.meals.length} matching results</h3>`;

        const notLiked = document.querySelector(".not-liked");
        if (favArr.includes(meal.idMeal)) {
          notLiked.classList.remove("not-liked");
          notLiked.classList.add("liked");
        }
      });
      listenForLikes();
    });
  });
}

// ========== Funktion för att ladda ett random recipe, knapp för att slumpa igen ==========
async function randomRecipe() {
  const res = await fetch(randomRecipeURL);
  const data = await res.json();

  const image = document.createElement("img");
  image.id = "random-img";
  image.src = data.meals[0].strMealThumb;
  randomContainer.append(image);

  const randomInfo = `
  <article class="random-meal-info">
  <h2 class="meal-name">${data.meals[0].strMeal}</h2>
  </div>
  <p class="meal-category">${data.meals[0].strCategory}</p>
  <h4>Instructions</h4>
  <p>${data.meals[0].strInstructions}</p>
  </article>
  `;
  randomContainer.insertAdjacentHTML("beforeend", randomInfo);
}

// ========== Search button that takes user input and looks through an API ==========
searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  hideIntro();

  const res = await fetch(searchURL + inputField.value);
  const data = await res.json();
  if (
    data.meals &&
    inputField.value.length > 0 &&
    inputField.value.charAt(0) !== " "
  ) {
    mealSearchResults.innerHTML = "";
    searchHits.innerHTML = `<h3 id="search-heading">${data.meals.length} matching results</h3>`;

    const historyBtn = document.createElement("button");
    historyBtn.className = "history-btn";
    historyBtn.innerText = inputField.value;
    searchHistory.append(historyBtn);
    historyBtn.addEventListener("click", async (event) => {
      mealSearchResults.innerHTML = "";

      const res = await fetch(searchURL + historyBtn.innerText);
      const data = await res.json();
      searchHits.innerHTML = `<h3 id="search-heading">${data.meals.length} matching results</h3>`;

      loadMealCards(data.meals);
      listenForLikes();
    });
    loadMealCards(data.meals);
    listenForLikes();
  } else {
    alert(`${inputField.value} doesn't exist, try something else!`);
  }
  inputField.value = "";
});

favMeals.addEventListener("click", async () => {
  highlightContainer.classList.add("hidden");
  introductionContainer.classList.add("hidden");
  mealSearchResults.innerHTML = "";
  searchHistory.innerHTML = "";
  searchHits.innerHTML = `<h3 id="search-heading">Your favourite meals</h3>`;
  if (favArr.length === 0) {
    mealSearchResults.innerHTML = `<p>No favourites yet! :(`;
  }
  reloadFavourites(favArr);
});

function reloadFavourites(arr) {
  Promise.all(
    arr.map((id) =>
      fetch(mealID + id)
        .then((res) => res.json())
        .then((results) => {
          const mealHTML = `
            <article class="meal-card ${results.meals[0].idMeal}">
            <img class="meal-img" src="${results.meals[0].strMealThumb}" />
            <div class="remove-fav"></div>
            <div class="meal-info">
            <h3 class="meal-name">${results.meals[0].strMeal}</h3>
            <p class="meal-category">${results.meals[0].strCategory}</p>
            </div>
            </article>
                `;
          mealSearchResults.insertAdjacentHTML("afterbegin", mealHTML);

          const mealIMG = document.querySelector(".meal-img");
          const parentID = mealIMG.parentElement.classList[1];
          highlightFunction(parentID);
          const removeFav = document.querySelector(".remove-fav");

          removeFav.addEventListener("click", function () {
            mealIMG.parentElement.remove();
            favArr = favArr.filter((meal) => meal !== parentID);
            if (favArr.length === 0) {
              mealSearchResults.innerHTML = `<p>Empty! :(`;
            }
          });
        })
    )
  );
  randomContainer.classList.add("hidden");
}

// ===== Function that tracks the like buttons and adds/removes the meals' index to a favourite array =====
function listenForLikes() {
  const likes = document.querySelectorAll(".like") as NodeListOf<HTMLElement>;
  for (const like of likes) {
    like.addEventListener("click", function () {
      const parentID = like.parentElement.classList[1];
      if (this.classList.contains("not-liked")) {
        this.classList.remove("not-liked");
        this.classList.add("liked");
        if (!favArr.includes(parentID)) {
          favArr.push(parentID);
        }
      } else {
        const index = favArr.indexOf(parentID);
        favArr.splice(index, 1);
        this.classList.add("not-liked");
        this.classList.remove("liked");
      }
    });
  }
}

categoryMenu();
randomRecipe();
