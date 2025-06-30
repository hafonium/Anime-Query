const names = document.querySelectorAll(".name");
const scores = document.querySelectorAll(".score");
const ranks = document.querySelectorAll(".rank");
const types = document.querySelectorAll(".type");
const genres = document.querySelectorAll(".genres");
const imgs = document.querySelectorAll(".query");
const  playerScoreDoc = document.getElementById("playerScore");
const playerHighscoreDoc = document.getElementById("playerHighscore");
const queries = [];
const num = 50;
let playerScore = 0;
let playerHighscore = 0;
let curQuery = 1;

async function fetchData(pageNum) {
    const url = `https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${pageNum}`;
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error("Could not fetch data");
        }
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.log(error);
    }
}

async function buildList(num) {
    for(let i = 0; i < num; i += 25) {
        const response = await fetchData(Math.floor(i / 25) + 1);
        response.data.forEach(element => {
            if(queries.length < num) {
                queries.push(element);
            }
        })
    }
}

function displayQuery(queryIdx, displayIdx){
    if(displayIdx === 0) {
        names[displayIdx].textContent = `${queries[queryIdx].title_english}`;
        scores[displayIdx].textContent = `Score: ${queries[queryIdx].score}`;
    }
    else {
        names[displayIdx].textContent = `${queries[queryIdx].title_english} has a`;
        scores[displayIdx].textContent = `score`;
    }
    ranks[displayIdx].textContent = `Popularity rank: ${queries[queryIdx].popularity}`;
    types[displayIdx].textContent = `Type: ${queries[queryIdx].type}`;
    genres[displayIdx].textContent = "Genres: "
    queries[queryIdx].genres.forEach((element, index, arr) => {
       genres[displayIdx].textContent += (element.name + (index === arr.length - 1 ? "":", ")); 
    });
    imgs[displayIdx].style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${queries[queryIdx].images.jpg.large_image_url}")`;
}

function queryHandler() {
    playerHighscore = Math.max(playerScore, playerHighscore);
    playerScoreDoc.textContent = `Score: ${playerScore}`;
    playerHighscoreDoc.textContent = `High score: ${playerHighscore}`;
    curQuery++;
    console.log(playerScore);
    displayQuery(curQuery - 1, 0);
    displayQuery(curQuery, 1);
}

function gameOver() {
    localStorage.setItem("score", playerScore);
    localStorage.setItem("highscore", playerHighscore);
    window.location.href = "gameOver.html";

    // const playerScore = localStorage.getItem("score");
    // const playerHighscore = localStorage.getItem("highscore");
    // const playerScoreDoc = document.getElementById("playerScore");
    // const playerHighscoreDoc = document.getElementById("playerHighscore");
    
    // playerScoreDoc.textContent = `Score: ${playerScore}`;
    // playerHighscoreDoc.textContent = `High score: ${playerHighscore}`;
}

function playAgain() {
    console.log("clicked");
    window.history.back();
    playerScore = 0;
    curQuery = 1;
    playerScoreDoc = document.getElementById("playerScore");
    playerHighscoreDoc = document.getElementById("playerHighscore");
    game();
}

function higher() {
    if(queries[curQuery].score >= queries[curQuery - 1].score) playerScore++; 
    else gameOver();
    console.log(playerScore);
    queryHandler();
}

function lower() {
    if(queries[curQuery].score <= queries[curQuery - 1].score) playerScore++; 
    else gameOver();
    queryHandler();
}

function game() {
    for(let i = 0; i < num; i++) {
        const pre = Math.floor(Math.random() * (i + 1));
        [queries[i], queries[pre]] = [queries[pre], queries[i]]; 
    }
    displayQuery(0, 0);
    displayQuery(1, 1);
}

document.addEventListener("DOMContentLoaded", async() => {
    buildList(num).then(() => {
        game();
        document.body.style.display = "block";
    })
});
