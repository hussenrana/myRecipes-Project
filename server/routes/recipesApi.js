const express = require("express");
const axios = require("axios");
const router = express.Router();
module.exports = router;
const sensetivity = require("./sensetivity");

let allRecipes = [];
let filterRecipes = [];
let paginationRecipesArray = [];
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
const paginationRecipes = function (recipesArray, startIndex, lastIndex) {
  paginationRecipesArray = [];
  for (const index in recipesArray) {
    if (index >= startIndex && index <= lastIndex) {
      paginationRecipesArray.push(recipesArray[index]);
    }
  }
};
router.get(`/recipe/:YOUR_INGREDIENT`, function (req, res) {
  let ingredient = req.params.YOUR_INGREDIENT;
  let dairy = req.query.dairy;
  let gluten = req.query.gluten;
  let startIndex = parseInt(req.query.startIndex);
  let lastIndex = parseInt(req.query.lastIndex);
  allRecipes = [];
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
      allRecipes.push(recipe);
    });

    if (dairy == 0 && gluten == 1) {
      filterRecipes = filter_Recipes(allRecipes, sensetivity.glutenIngredients);
      paginationRecipes(filterRecipes, startIndex, lastIndex);
      res.send(paginationRecipesArray);
      return;
    }
    if (dairy == 1 && gluten == 0) {
      filterRecipes = filter_Recipes(allRecipes, sensetivity.dairyIngredients);
      paginationRecipes(filterRecipes, startIndex, lastIndex);
      res.send(paginationRecipesArray);
      return;
    }
    if (dairy == 1 && gluten == 1) {
      filterRecipes = filter_Recipes(allRecipes, sensetivity.dairyIngredients);
      let moreFilterRecipes = filter_Recipes(
        filterRecipes,
        sensetivity.glutenIngredients
      );
      paginationRecipes(moreFilterRecipes, startIndex, lastIndex);
      res.send(paginationRecipesArray);
      return;
    } else {
      paginationRecipes(allRecipes, startIndex, lastIndex);
      res.send(paginationRecipesArray);
      return;
    }
  });
});
