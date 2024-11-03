const apiKey = 'eb23580ee2d64d6bad96c8e88c21646f';

// Get the modals
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');

// Get the buttons that open the modals
const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');

// Get the close buttons
const closeLogin = document.getElementById('close-login');
const closeSignup = document.getElementById('close-signup');

// When the user clicks the login button, open the login modal
loginBtn.onclick = function() {
    loginModal.style.display = 'block';
}

// When the user clicks the signup button, open the signup modal
signupBtn.onclick = function() {
    signupModal.style.display = 'block';
}

// When the user clicks on (x), close the modals
closeLogin.onclick = function() {
    loginModal.style.display = 'none';
}

closeSignup.onclick = function() {
    signupModal.style.display = 'none';
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === signupModal) {
        signupModal.style.display = 'none';
    }
}

async function searchRecipes() {
    const ingredient1 = document.getElementById('ingredient1').value;
    const ingredient2 = document.getElementById('ingredient2').value;
    const ingredient3 = document.getElementById('ingredient3').value;

    const ingredients = `${ingredient1},${ingredient2},${ingredient3}`;

    const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`);
    const recipes = await response.json();

    displayRecipes(recipes);
}

function displayRecipes(recipes) {
    const recipeContainer = document.getElementById('recipes');
    recipeContainer.innerHTML = ''; // Clear previous results

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');

        // Link to recipe.html with recipe ID as a query parameter
        const recipeContent = `
            <a href="recipe.html?id=${recipe.id}" class="recipe-link">
                <h3>${recipe.title}</h3>
                <img src="${recipe.image}" alt="${recipe.title}">
                <p>${recipe.description || ''}</p>
            </a>
        `;

        recipeDiv.innerHTML = recipeContent;
        recipeContainer.appendChild(recipeDiv);
    });
}
async function fetchRecipeDetails() {
    try {
        // Retrieve the recipe ID from the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('id');
        console.log("Recipe ID:", recipeId); // Debugging output

        // Check if recipeId is null or empty
        if (!recipeId) {
            console.error("No recipe ID found in URL");
            return;
        }

        // Fetch recipe details from the API
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${apiKey}`);
        console.log("API Response:", response); // Debugging output

        if (response.ok) {
            const recipe = await response.json();
            console.log("Recipe Data:", recipe); // Debugging output
            displayRecipeDetails(recipe); // Display recipe details on the page
        } else {
            console.error("Failed to fetch recipe data:", response.status);
            document.getElementById('recipe-details').innerHTML = `<p>Error: Unable to load recipe details (status: ${response.status})</p>`;
        }
    } catch (error) {
        console.error("Error fetching recipe:", error);
        document.getElementById('recipe-details').innerHTML = `<p>Error: Unable to load recipe details. Please try again later.</p>`;
    }
}

function displayRecipeDetails(recipe) {
    const recipeDetailsSection = document.getElementById('recipe-details');

    if (!recipeDetailsSection) {
        console.error("Recipe details section not found in HTML");
        return;
    }

    // Populate the HTML with the recipe details
    recipeDetailsSection.innerHTML = `
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}">
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Preparation time:</strong> ${recipe.readyInMinutes} minutes</p>
        <h3>Ingredients</h3>
        <ul>
            ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
        </ul>
        <h3>Instructions</h3>
        <p>${recipe.instructions || "No instructions available"}</p>
    `;
}

// Call the function to fetch and display the recipe details after the DOM has loaded
document.addEventListener("DOMContentLoaded", function() {
    fetchRecipeDetails();
});



