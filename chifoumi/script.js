const choices = ["pierre", "feuille", "ciseaux"];
const playerScoreSpan = document.getElementById("player-score");
const computerScoreSpan = document.getElementById("computer-score");
const outcomeText = document.getElementById("outcome");
const playerChoiceText = document.getElementById("player-choice");
const computerChoiceText = document.getElementById("computer-choice");
let playerScore = 0;
let computerScore = 0;

const images = {
  pierre: "images/logo-pierre.png",
  feuille: "images/logo-feuille.png",
  ciseaux: "images/logo-ciseaux.png",
  thinking: "images/thinking.png",
};

function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function determineWinner(player, computer) {
  if (player === computer) return "Égalité";
  if (
    (player === "pierre" && computer === "ciseaux") ||
    (player === "feuille" && computer === "pierre") ||
    (player === "ciseaux" && computer === "feuille")
  ) {
    playerScore++;
    return "Tu gagnes !";
  } else {
    computerScore++;
    return "Tu perds !";
  }
}

function playGame(playerChoice) {
  playerChoiceText.innerHTML = `🧍 Choix: <img src="${images[playerChoice]}" alt="${playerChoice}" class="choice-img">`;

  // Affiche image cerveau animé pendant 1 seconde avant de révéler le choix de l’ordi
  computerChoiceText.innerHTML = `🤖 Choix: <img src="${images.thinking}" alt="réflexion" class="choice-img thinking">`;
  outcomeText.textContent = "L'ordinateur réfléchit...";

  setTimeout(() => {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);

    computerChoiceText.innerHTML = `🤖 Choix: <img src="${images[computerChoice]}" alt="${computerChoice}" class="choice-img">`;
    outcomeText.textContent = result;
    playerScoreSpan.textContent = playerScore;
    computerScoreSpan.textContent = computerScore;
  }, 1000);
}

const choiceButtons = document.querySelectorAll(".choice");
choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const playerChoice = button.getAttribute("data-choice");
    playGame(playerChoice);
  });
});

document.getElementById("reset").addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  playerScoreSpan.textContent = 0;
  computerScoreSpan.textContent = 0;
  outcomeText.textContent = "Fais ton choix !";
  playerChoiceText.innerHTML = "🧍 Choix: -";
  computerChoiceText.innerHTML = "🤖 Choix: -";
});
