window.addEventListener('load', function() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    splashScreen.addEventListener('animationend', () => {
        splashScreen.style.display = 'none';
        mainContent.style.display = 'block';
    });
});


// index.js

document.addEventListener("DOMContentLoaded", () => {
    const playAsGuestButton = document.getElementById("playAsGuest");

    playAsGuestButton.addEventListener("click", () => {
        let playerName = prompt("Enter your name:", "Guest");
        if (playerName === null || playerName.trim() === "") {
            playerName = "Guest";
        }
        // Store the player name in localStorage
        localStorage.setItem("playerName", playerName.trim());

        // Navigate to the game page
        window.location.href = "game.html";
    });
});
