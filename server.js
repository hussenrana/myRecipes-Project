const express = require("express");
const path = require("path");
const app = express();
//const api = require("./server/routes/api");
const axios = require("axios");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "node_modules")));

app.get("/");
const dairyIngredients = [
  "Cream",
  "Cheese",
  "Milk",
  "Butter",
  "Creme",
  "Ricotta",
  "Mozzarella",
  "Custard",
  "Cream Cheese",
];
const glutenIngredients = ["Flour", "Bread", "spaghetti", "Biscuits", "Beer"];
let allIngredient = [];
let filterRecipes = [];
const URL =
  "https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient";

const filter_Recipes = function (recipes, ingredients) {
  let helper = 1;
  filterRecipes = [];
  recipes.forEach((element) => {
    ingredients.forEach((speceficIgredients) => {
      if (element.ingredients.includes(speceficIgredients)) {
        helper = 0;
      }
    });
    if (helper == 1) {
      filterRecipes.push(element);
    }
    helper = 1;
  });
  return filterRecipes;
};
app.get(`/recipe/:YOUR_INGREDIENT`, function (req, res) {
  let ingredient = req.params.YOUR_INGREDIENT;
  let dairy = req.query.dairy;
  let gluten = req.query.gluten;
  allIngredient = [];
  filterRecipes = [];
  axios.get(`${URL}/${ingredient}`).then((recipes) => {
    recipes.data.results.map((element) => {
      let recipe = {
        idMeal: element.idMeal,
        ingredients: element.ingredients,
        title: element.title,
        thumbnail: element.thumbnail,
        href: element.href,
      };
      allIngredient.push(recipe);
    });
    if (dairy == 0 && gluten == 1) {
      filterRecipes = filter_Recipes(allIngredient, glutenIngredients);
      res.send(filterRecipes);
      return;
    }
    if (dairy == 1 && gluten == 0) {
      filterRecipes = filter_Recipes(allIngredient, dairyIngredients);
      res.send(filterRecipes);
      return;
    }
    if (dairy == 1 && gluten == 1) {
      filterRecipes = filter_Recipes(allIngredient, dairyIngredients);
      let moreFilterRecipes = filter_Recipes(filterRecipes, glutenIngredients);
      res.send(moreFilterRecipes);
      return;
    } else {
      res.send(allIngredient);
      return;
    }
  });
});

const port = 3000;
app.listen(port, function () {
  console.log(`Server running on ${port}`);
});
