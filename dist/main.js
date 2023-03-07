const Source = $("#ingredientContainerTemplate").html();
const template = Handlebars.compile(Source);
const recipeElement = $(".recipe-album-container");
let startIndex = 0;
let lastIndex = 3;
let resetIndex = true;
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

const resetTheIndex = function () {
  let startIndex = 0;
  let lastIndex = 3;
};

const disableButton = function (button) {
  button.classList.add("disabled");
  button.setAttribute("disabled", true);
};
const inableButton = function (button) {
  button.classList.remove("disabled");
  button.removeAttribute("disabled");
};
const updateNextAndPrevStatus = function (recipesArraySize) {
  startIndex > 0 ? inableButton(prevButton) : disableButton(prevButton);
  lastIndex < recipesArraySize - 1
    ? inableButton(nextButton)
    : disableButton(nextButton);
};
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
  if (resetIndex == true) {
    resetTheIndex();
  }
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
    render(data.recipesArray);
    updateNextAndPrevStatus(data.size);
  });
};

$("#Ingredient-search-button").on("click", displayRecipes);
$("#next-button").on("click", function () {
  updateIndex("next");
  resetIndex = false;
  displayRecipes();
  resetIndex = true;
});
$("#prev-button").on("click", function () {
  updateIndex("prev");
  resetIndex = false;
  displayRecipes();
  resetIndex = true;
});

$(".recipe-album-container").on("click", "img", function () {
  let firstIngredient = $(this)
    .closest(".recipe-container")
    .find("li:first")
    .text();
  alert(firstIngredient);
});
