const Source = $("#ingredientContainerTemplate").html();
const template = Handlebars.compile(Source);
const recipeElement = $(".recipe-album-container");
let startIndex = 0;
let lastIndex = 3;
const render = function (data) {
  recipeElement.empty();
  let newHTML = template(data);
  recipeElement.append(newHTML);
};
const updateIndex = function (pagination) {
  if (pagination === "prev") {
    startIndex -= 4;
    lastIndex -= 4;
  } else {
    startIndex += 4;
    lastIndex += 4;
  }
};
const displayRecipes = function () {
  let ingredient = $("#ingredientInputField").val();
  let gluten = $(this)
    .closest(".search-field-container")
    .find("#gluten:checked").length;
  let dairy = $(this)
    .closest(".search-field-container")
    .find("#dairy:checked").length;
  $.get(
    `/recipe/${ingredient}?gluten=${gluten}&dairy=${dairy}&startIndex=${startIndex}&lastIndex=${lastIndex}`
  ).then((data) => {
    render(data);
  });
};

$("#Ingredient-search-button").on("click", displayRecipes);
$("#next-button").on("click", function () {
  updateIndex("next");
  displayRecipes();
});
$("#prev-button").on("click", function () {
  updateIndex("prev");
  displayRecipes();
});

$(".recipe-album-container").on("click", "img", function () {
  let firstIngredient = $(this)
    .closest(".recipe-container")
    .find("li:first")
    .text();
  alert(firstIngredient);
});
