const apiKey = 'eb23580ee2d64d6bad96c8e88c21646f';

// Get the modals
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');

// Get the buttons that open the modals
const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');
const loginFormBtn = document.getElementById('login-form-btn');
const signupFormBtn = document.getElementById('signup-form-btn');

let isLoggedIn = false; // Tracks if a user is logged in

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

// Login functionality
loginFormBtn.onclick = function(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if user exists
    const user = users.find(user => user.signupEmail === email && user.signupPassword === password);
    if (user) {
        alert(`${email} is successfully logged in`);
        loginModal.style.display = 'none';
        isLoggedIn = true;
        document.getElementById('loggedInAs').innerText = `Logged in as: ${email}`;
    } else {
        alert('Invalid credentials');
    }
}

// Signup functionality
signupFormBtn.onclick = function(event) {
    event.preventDefault(); // Prevent form submission

    const signupEmail = document.getElementById('signup-email').value;
    const signupPassword = document.getElementById('signup-password').value;
    const signupConfirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('name').value;

    if (signupPassword !== signupConfirmPassword) {
        alert("Password must match with re-type password");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if user already exists
    if (users.some(user => user.signupEmail === signupEmail)) {
        alert("User already exists");
    } else {
        // Save new user
        users.push({ signupEmail, signupPassword });
        localStorage.setItem('users', JSON.stringify(users));
        alert("User has been successfully registered!");
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    }
}

// Fetch available cuisines and populate dropdown
async function populateCuisineDropdown() {
    const cuisineDropdown = document.getElementById('cuisine');

    if (!cuisineDropdown) {
        console.error("Cuisine dropdown element not found!");
        return;
    }

    // Cuisines offered by Spoonacular API
    const cuisines = [
        "African", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European",
        "European", "French", "German", "Greek", "Indian", "Irish", "Italian", "Japanese",
        "Jewish", "Korean", "Latin American", "Mediterranean", "Mexican", "Middle Eastern",
        "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
    ];

    cuisines.forEach(cuisine => {
        const option = document.createElement("option");
        option.value = cuisine;
        option.textContent = cuisine;
        cuisineDropdown.appendChild(option);
    });
}


// Recipe search and display functions
async function searchRecipes() {
    const ingredient1 = document.getElementById('ingredient1').value.trim();
    const ingredient2 = document.getElementById('ingredient2').value.trim();
    const ingredient3 = document.getElementById('ingredient3').value.trim();
    const selectedCuisine = document.getElementById('cuisine').value.trim();

    // Check if all ingredient fields are empty
    if (!ingredient1 && !ingredient2 && !ingredient3) {
        const recipeContainer = document.getElementById('recipes');
        recipeContainer.innerHTML = "<p>Please enter at least one ingredient.</p>";
        return; // Exit the function early
    }

    // Create a cleaned list of non-empty ingredients
    const ingredients = [ingredient1, ingredient2, ingredient3].filter(Boolean).join(',');

    let apiUrl;

    // Use complexSearch if a cuisine is selected; otherwise, use findByIngredients
    if (selectedCuisine && selectedCuisine !== "Select Cuisine") {
        apiUrl = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredients}&cuisine=${selectedCuisine}&number=20&apiKey=${apiKey}`;
    } else {
        apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=20&apiKey=${apiKey}`;
    }

    try {
        // Log the API URL to inspect
        console.log("API URL:", apiUrl);

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if the API response contains `results` (for complexSearch) or is a direct array (for findByIngredients)
        const recipes = data.results || data;

        // Log the data to inspect the structure and see if there are any error messages
        console.log("API Response Data:", data);

        // Display recipes or show an error if no valid recipes are returned
        if (recipes && recipes.length > 0) {
            displayRecipes(recipes);
        } else {
            document.getElementById('recipes').innerHTML = "<p>No recipes found for the selected criteria.</p>";
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
        
        // Display specific message for network issues
        if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
            document.getElementById('recipes').innerHTML = `<p>Unable to connect. Please check your internet connection and try again.</p>`;
        } else {
            document.getElementById('recipes').innerHTML = `<p>Error: Unable to load recipes. Please try again later.</p>`;
        }
    }
}


// Pagination variable support
let currentPage = 1;
const recipesPerPage = 4;
let allRecipes = [];

// Display only the recipes for the current page
function displayRecipes(recipes) {
    allRecipes = recipes; // Store all recipes in a global variable
    const recipeContainer = document.getElementById('recipes');
    recipeContainer.innerHTML = ''; // Clear previous results

    // Calculate the recipes to display for the current page
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const recipesToDisplay = allRecipes.slice(startIndex, endIndex);

    recipesToDisplay.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');

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

    // Display navigation buttons if there are more than one page of results
    displayPaginationControls();
}

// Show pagination controls
function displayPaginationControls() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear previous buttons

    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => {
            currentPage--;
            displayRecipes(allRecipes);
        };
        paginationContainer.appendChild(prevButton);
    }

    // Next button
    if (currentPage * recipesPerPage < allRecipes.length) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            currentPage++;
            displayRecipes(allRecipes);
        };
        paginationContainer.appendChild(nextButton);
    }
}


// Fetch and display detailed recipe information on the recipe page
async function fetchRecipeDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('id');

        if (!recipeId) {
            console.error("No recipe ID found in URL");
            return;
        }

        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${apiKey}`);

        if (response.ok) {
            const recipe = await response.json();
            displayRecipeDetails(recipe);
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

// Call the functions to fetch recipe details and populate the cuisine dropdown after the DOM has loaded
document.addEventListener("DOMContentLoaded", function() {
    fetchRecipeDetails();
    populateCuisineDropdown();
});
