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

        const recipeContent = `
            <a href="${recipe.sourceUrl}" target="_blank" class="recipe-link">
                <h3>${recipe.title}</h3>    
                <img src="${recipe.image}" alt="${recipe.title}">
                <p>${recipe.description || ''}</p>
            </a>
        `;

        recipeDiv.innerHTML = recipeContent;
        recipeContainer.appendChild(recipeDiv);
    });
}

