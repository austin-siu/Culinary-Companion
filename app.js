const apiKey = 'eb23580ee2d64d6bad96c8e88c21646f';

// Modals
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const forgetPasswordModal = document.getElementById('change-password-modal');

// Buttons
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');
const signupBtn = document.getElementById('signup');
const loginFormBtn = document.getElementById('login-form-btn');
const signupFormBtn = document.getElementById('signup-form-btn');
const changepasswordbtn = document.getElementById('change-password');
const changePasswordSubmit = document.getElementById('change-password-submit-btn');

// Close Buttons
const closeLogin = document.getElementById('close-login');
const closeSignup = document.getElementById('close-signup');
const closeChangePassword = document.getElementById('close-signup'); // Fix mismatch

// Tracks login state
let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
const loggedInUser = localStorage.getItem('loggedInUser') || '';

// Update UI based on login state
function updateUIAfterLogin(email) {
    document.getElementById('loggedInAs').innerText = `Logged in as: ${email}`;
    logoutBtn.style.display = 'block';
    loginBtn.style.display = 'none';
    changepasswordbtn.style.display = 'block';
    signupBtn.style.display = 'none';
}

function updateUIAfterLogout() {
    document.getElementById('loggedInAs').innerText = '';
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'block';
    changepasswordbtn.style.display = 'none';
    signupBtn.style.display = 'block';
}

// Initialize UI
if (isLoggedIn && loggedInUser) {
    updateUIAfterLogin(loggedInUser);
}

// Open modals
loginBtn.onclick = () => (loginModal.style.display = 'block');
signupBtn.onclick = () => (signupModal.style.display = 'block');
changepasswordbtn.onclick = () => (forgetPasswordModal.style.display = 'block');

// Close modals
closeLogin.onclick = () => (loginModal.style.display = 'none');
closeSignup.onclick = () => (signupModal.style.display = 'none');
closeChangePassword.onclick = () => (forgetPasswordModal.style.display = 'none');

// Close modals when clicking outside
window.onclick = (event) => {
    if (event.target === loginModal) loginModal.style.display = 'none';
    if (event.target === signupModal) signupModal.style.display = 'none';
    if (event.target === forgetPasswordModal) forgetPasswordModal.style.display = 'none';
};

// Logout functionality
logoutBtn.onclick = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    updateUIAfterLogout();
};

// Login functionality
loginFormBtn.onclick = (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find((user) => user.signupEmail === email && user.signupPassword === password);
    if (user) {
        alert(`${email} is successfully logged in`);
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('loggedInUser', email);
        loginModal.style.display = 'none';
        updateUIAfterLogin(email);
    } else {
        alert('Invalid credentials');
    }
};

// Signup functionality
signupFormBtn.onclick = (event) => {
    event.preventDefault();

    const signupEmail = document.getElementById('signup-email').value;
    const signupPassword = document.getElementById('signup-password').value;
    const signupConfirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('name').value;

    if (signupPassword !== signupConfirmPassword) {
        alert("Password must match with re-type password");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some((user) => user.signupEmail === signupEmail)) {
        alert("User already exists");
    } else {
        users.push({ signupEmail, signupPassword, name });
        localStorage.setItem('users', JSON.stringify(users));
        alert("User has been successfully registered!");
        signupModal.style.display = 'none';
        document.getElementById('signup-form').reset(); // Reset form
        loginModal.style.display = 'block';
    }
};

// Change password functionality
changePasswordSubmit.onclick = (event) => {
    event.preventDefault();

    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    const email = localStorage.getItem('loggedInUser');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((user) => user.signupEmail === email);

    if (!user) {
        alert("No user found!");
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert("New Password must match with Confirm New Password");
        return;
    }

    if (oldPassword !== user.signupPassword) {
        alert("Old Password is not correct");
        return;
    }

    user.signupPassword = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    alert("Password successfully changed!");
    forgetPasswordModal.style.display = 'none';
};

// Populate cuisines
async function populateCuisineDropdown() {
    const cuisineDropdown = document.getElementById('cuisine');
    if (!cuisineDropdown) {
        console.error("Cuisine dropdown element not found!");
        return;
    }

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

// Search recipes
async function searchRecipes() {
    const ingredient1 = document.getElementById('ingredient1').value.trim();
    const ingredient2 = document.getElementById('ingredient2').value.trim();
    const ingredient3 = document.getElementById('ingredient3').value.trim();
    const selectedCuisine = document.getElementById('cuisine').value.trim();

    if (!ingredient1 && !ingredient2 && !ingredient3) {
        const recipeContainer = document.getElementById('recipes');
        recipeContainer.innerHTML = "<p>Please enter at least one ingredient.</p>";
        return;
    }

    const ingredients = [ingredient1, ingredient2, ingredient3].filter(Boolean).join(',');
    let apiUrl;

    if (selectedCuisine && selectedCuisine !== "Select Cuisine") {
        apiUrl = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredients}&cuisine=${selectedCuisine}&number=20&apiKey=${apiKey}`;
    } else {
        apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=20&apiKey=${apiKey}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const recipes = data.results || data;

        if (recipes && recipes.length > 0) {
            displayRecipes(recipes);
        } else {
            document.getElementById('recipes').innerHTML = "<p>No recipes found for the selected criteria.</p>";
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
        document.getElementById('recipes').innerHTML = `<p>Error: Unable to load recipes. Please try again later.</p>`;
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

// Fetch recipe details
async function fetchRecipeDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('id');

        if (!recipeId) {
            console.error("No recipe ID found in URL");
            return;
        }

        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${apiKey}`);
        const recipe = await response.json();

        if (response.ok) {
            const recipeDetailsSection = document.getElementById('recipe-details');
            recipeDetailsSection.innerHTML = `
                <h2>${recipe.title}</h2>
                <img src="${recipe.image}" alt="${recipe.title}">
                <p><strong>Servings:</strong> ${recipe.servings}</p>
                <p><strong>Preparation time:</strong> ${recipe.readyInMinutes} minutes</p>
            `;
        } else {
            console.error("Failed to fetch recipe data:", response.status);
        }
    } catch (error) {
        console.error("Error fetching recipe:", error);
    }
}

// Cuisine dropdown population
document.addEventListener("DOMContentLoaded", () => {
    fetchRecipeDetails();
    populateCuisineDropdown();
    if (isLoggedIn && loggedInUser) updateUIAfterLogin(loggedInUser);
});