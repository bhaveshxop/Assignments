// leaderBoard.js

document.addEventListener("DOMContentLoaded", () => {
    const leaderBoardBody = document.getElementById("leaderBoardBody");

    // Retrieve scores from localStorage
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    // Sort scores in descending order
    scores.sort((a, b) => b.score - a.score);

    // Limit to top 10 scores (optional)
    scores = scores.slice(0, 10);

    // Populate the leaderboard table
    scores.forEach((entry, index) => {
        const tr = document.createElement("tr");
        tr.classList.add("text-center");

        const rankTd = document.createElement("td");
        rankTd.classList.add("py-2", "border", "px-4");
        rankTd.textContent = index + 1;

        const nameTd = document.createElement("td");
        nameTd.classList.add("py-2", "border", "px-4");
        nameTd.textContent = entry.name;

        const scoreTd = document.createElement("td");
        scoreTd.classList.add("py-2", "border", "px-4");
        scoreTd.textContent = entry.score;

        tr.appendChild(rankTd);
        tr.appendChild(nameTd);
        tr.appendChild(scoreTd);

        leaderBoardBody.appendChild(tr);
    });

    // If no scores, display a message
    if(scores.length === 0){
        const tr = document.createElement("tr");
        tr.classList.add("text-center");

        const td = document.createElement("td");
        td.setAttribute("colspan", "3");
        td.classList.add("py-2", "border", "px-4");
        td.textContent = "No scores available.";
        
        tr.appendChild(td);
        leaderBoardBody.appendChild(tr);
    }
});
