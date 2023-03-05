const Source = $("#ingredientContainerTemplate").html();
const template = Handlebars.compile(Source);
const recipeElement = $(".recipe-album-container");

const render = function (data) {
  recipeElement.empty();
  let newHTML = template(data);
  recipeElement.append(newHTML);
};

$("#Ingredient-search-button").on("click", function () {
  let ingredient = $(this).siblings("#ingredientInputField").val();
  let gluten = $(this)
    .closest(".search-field-container")
    .find("#gluten:checked").length;
  let dairy = $(this)
    .closest(".search-field-container")
    .find("#dairy:checked").length;
  $.get(`/recipe/${ingredient}?gluten=${gluten}&dairy=${dairy}`).then(
    (data) => {
      render(data);
    }
  );
});

$(".recipe-album-container").on("click", "img", function () {
  let firstIngredient = $(this)
    .closest(".recipe-container")
    .find("li:first")
    .text();
  alert(firstIngredient);
});

$("#Next-button").on("click", function () {
  let nextPage = $(this).siblings("#ingredientInputField").val();
  $.get(`/recipe/:nextPage${nextPage}?gluten=${gluten}&dairy=${dairy}`).then(
    (data) => {
      render(data);
    }
  );
});
