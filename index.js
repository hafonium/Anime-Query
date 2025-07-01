const names = document.querySelectorAll(".name");
const scores = document.querySelectorAll(".score");
const ranks = document.querySelectorAll(".rank");
const types = document.querySelectorAll(".type");
const genres = document.querySelectorAll(".genres");
const imgs = document.querySelectorAll(".query");
const  playerScoreDoc = document.getElementById("playerScore");
const playerHighscoreDoc = document.getElementById("playerHighscore");
const  playerScoreResult = document.getElementById("playerScoreResult");
const playerHighscoreResult = document.getElementById("playerHighscoreResult");
const queries = [];
const pageList = [];
const num = 500;
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

function randomList(list, length = list.length) {
    for(let i = 0; i < length; i++) {
        const pre = Math.floor(Math.random() * (i + 1));
        [list[pre], list[i]] = [list[i], list[pre]];
    }
}

async function preBuildList() {
    // Pre build 2 pages
    for(let i = 0; i < 2; i++) {
        const response = await fetchData(pageList[i]);
        response.data.forEach(element => {
            if(queries.length < num) {
                queries.push(element);
            }
        })
    }
    randomList(queries);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function buildRestList() {
    // Build the rest
    for(let i = 2; i < pageList.length; i++) {
        // Wait 2000ms to fetch the next page
        await delay(2000);
        const response = await fetchData(pageList[i]);
        response.data.forEach(element => {
            if(queries.length < num) {
                queries.push(element);
                const length = queries.length;
                const pre = Math.floor(Math.random() * (length - curQuery - 1) + curQuery + 1);
                [queries[length - 1], queries[pre]] = [queries[pre], queries[length - 1]];
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
    imgs[displayIdx].style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${queries[queryIdx].images.webp.large_image_url}")`;
}

function displayScore() {
    playerScoreDoc.textContent = `Score: ${playerScore}`;
    playerHighscoreDoc.textContent = `High score: ${playerHighscore}`;
}

function queryHandler() {
    playerHighscore = Math.max(playerScore, playerHighscore);
    displayScore();
    curQuery++;
    console.log(playerScore);
    displayQuery(curQuery - 1, 0);
    displayQuery(curQuery, 1);
}

function gameOver() {
    playerScoreResult.textContent = `Score: ${playerScore}`;
    playerHighscoreResult.textContent = `High score: ${playerHighscore}`;

       document.getElementById("game-state").style = "display: none;";
    document.getElementById("gameOver-state").style = "display: flex";
}

function playAgain() {
    playerScore = 0;
    curQuery = 1;
    document.getElementById("game-state").style = "display: flex";
    document.getElementById("gameOver-state").style = "display: none";
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
    randomList(queries, 50);
    buildRestList();
    displayQuery(0, 0);
    displayQuery(1, 1);
    displayScore();
}

document.addEventListener("DOMContentLoaded", async() => {
    for(let i = 1; i <= num / 25; i++) {
        pageList[i - 1] = i;
    }
    randomList(pageList);   

    preBuildList().then(() => {
        game();
        document.body.style.display = "block";
    })
});
