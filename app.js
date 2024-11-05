const apiKey = '954d97b6472e4b95be3147cf5aee48b0';

// Get the modals
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');

// Get the buttons that open the modals
const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');
const loginFormBtn = document.getElementById('login-form-btn');
const signupFormBtn = document.getElementById('signup-form-btn');

//This is a Upload Test from Dave

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

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if user already exists
    if (users.some(user => user.signupEmail === signupEmail)) {
        alert("User already exists");
    } else {
        // Save new user
        users.push({ signupEmail, signupPassword });
        localStorage.setItem('users', JSON.stringify(users));
        alert("User has been successfully registered!");
    }
}

// Recipe search and display functions
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

// Call the function to fetch and display the recipe details after the DOM has loaded
document.addEventListener("DOMContentLoaded", function() {
    fetchRecipeDetails();
});
