// ========== Declaring HTML elements ==========
const inputField = document.querySelector("#user-search") as HTMLInputElement;
const searchBtn = document.querySelector("#search-btn") as HTMLButtonElement;
const favMeals = document.querySelector("#fav-meals") as HTMLButtonElement;
const mealSearchResults = document.querySelector(".meals") as HTMLElement;
const searchHits = document.querySelector("#search-hits") as HTMLElement;
const searchHistory = document.querySelector("#search-history") as HTMLElement;
const randomContainer = document.querySelector(
  ".random-container"
) as HTMLElement;
const categoryLink = document.querySelector(".meal-category") as HTMLElement;

// ========== Three different URLs ==========
const searchURL: string = "https://themealdb.com/api/json/v1/1/search.php?s=";
const randomRecipeURL: string =
  "https://www.themealdb.com/api/json/v1/1/random.php";
const mealID: string = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

// ===== Array to store the favourite meals =====
const favArr: string[] = [];

// ========== Functions to prevent DRY ==========
const loadMealCards = function (arr) {
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

    const notLiked = document.querySelector(".not-liked");
    if (favArr.includes(meal.idMeal)) {
      notLiked.classList.remove("not-liked");
      notLiked.classList.add("liked");
    }
  });
};

function reloadFavourites(arr) {
  Promise.all(
    arr.map((id) =>
      fetch(mealID + id)
        .then((res) => res.json())
        .then((results) => {
          const mealHTML = `
            <article class="meal-card ${results.meals[0].idMeal}">
            <img class="meal-img" src="${results.meals[0].strMealThumb}" />
            <div class="like liked">
            </div>
            <div class="meal-info">
            <h3 class="meal-name">${results.meals[0].strMeal}</h3>
            <p class="meal-category">${results.meals[0].strCategory}</p>
            </div>
            </article>
                `;
          mealSearchResults.insertAdjacentHTML("afterbegin", mealHTML);
          listenForLikes();
          console.log(arr);
        })
    )
  );
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
          <p class="meal-category">${data.meals[0].strCategory}</p>
          <h4>Instructions</h4>
          <p>${data.meals[0].strInstructions}</p>
          </article>
      `;
  randomContainer.insertAdjacentHTML("beforeend", randomInfo);
}
randomRecipe();

// ========== Search button that takes user input and looks through an API ==========
searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const res = await fetch(searchURL + inputField.value);
  const data = await res.json();
  if (
    data.meals &&
    data.meals.length > 0 &&
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
});

favMeals.addEventListener("click", async () => {
  mealSearchResults.innerHTML = "";
  searchHistory.innerHTML = "";
  searchHits.innerHTML = `<h3 id="search-heading">Your favourite meals</h3>`;
  reloadFavourites(favArr);
});

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
          // console.log(parentID);
          // console.log(favArr);
        }
      } else {
        const index = favArr.indexOf(parentID);
        favArr.splice(index, 1);
        this.classList.add("not-liked");
        this.classList.remove("liked");
        console.log(parentID);
        console.log(favArr);
      }
    });
  }
}
