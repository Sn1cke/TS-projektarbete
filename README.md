# Ambrosia - A meal inspiration website

![WebsiteOverviewImg](/src/images/Ambrosia%20MealDB.png)

## Description

This website was created as a final project of a Typescript course. There is a heavy emphasis on Typescript, of course, but also on learning how to use AJAX and SASS. My motivation behind the project is my own endless battle with finding inspiration for what meals to cook. I wanted a simple and easy-to-use website where I can find just enough information, without any fuzz.

## How to use

Use the search function to find an array of different recipes matching your search. Your searches get saved in a search history section, so that you can easily return to where you were. You can also navigate to meals by using the category dropdown menu. Once you've found something you like, you can either click it to view the full information, or add it to your favourite list. You can access your favourites via the heart-shaped button in the top right corner. In case you don't know what to look for, you're always greeted with a random recipe to spark your imagination!

## How to install and run

1.  Clone the repo to your machine by using the command prompt

```
git clone git@github.com:Sn1cke/SASS-projektarbete.git
```

2. Enter the directory of the repo
3. Install the node modules

```
npm install
```

4. Start the dev server that will watch for any saved changes you make

```
npm run start
```

5. Open the localhost server in your browser to view the project

```
http://localhost:1234/
```

## API

The base website where I found all the different API is [TheMealDB](https://www.themealdb.com/api.php)

I also used the following APIs to fetch data

- [Search meal by name](https://www.themealdb.com/api/json/v1/1/search.php?s=)
- [Find a random meal](https://www.themealdb.com/api/json/v1/1/random.php)
- [Find a meal by its ID](https://www.themealdb.com/api/json/v1/1/lookup.php?i=)
- [Look up categories](https://www.themealdb.com/api/json/v1/1/categories.php)
- [Filter by category](https://www.themealdb.com/api/json/v1/1/filter.php?c=)

## Technologies and Framework

- Typescript
- HTML
- SASS
- AJAX
- Parcel build tool

### A special thanks

To all my clasmates for the inspiration to learn new things together! Having people to trade ideas with is invaluable.

## Developer

Thank you for taking an interest in my project!

[Add me on LinkedIn](https://www.linkedin.com/in/niclas-broberg-a6b079251/)

[Follow me on GitHub](https://github.com/Sn1cke)
