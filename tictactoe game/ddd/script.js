const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#new-btn");
const print = document.querySelector("#print");
const msgContainer = document.querySelector("#msgcontainer");
const playerForm = document.querySelector("#player-form");
const startBtn = document.querySelector("#start-game");

let turnO = true;
let currentIndex = 0;
let gameEnded = false;
let player1Name = "";
let player2Name = "";

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to start the game
const startGame = () => {
    player1Name = document.querySelector("#player1").value.trim();
    player2Name = document.querySelector("#player2").value.trim();
    
    if (!player1Name || !player2Name) {
        alert("Please enter names for both players!");
        return;
    }

    playerForm.classList.add("hide");
    resetGame();
};

// Reset the game
const resetGame = () => {
    turnO = true;
    gameEnded = false;
    print.innerText = "";
    msgContainer.classList.add("hide");
    boxes.forEach(box => {
        box.innerText = "";
        box.classList.remove("highlight", "o", "x");
        box.disabled = false;
        box.addEventListener("click", boxClickHandler); // Re-enable click handler
    });
    currentIndex = 0;
    highlightCurrentBox();
};

// Disable all boxes
const disableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = true;
    });
};

// Function to handle click on a box
const boxClickHandler = (event) => {
    const box = event.target;
    const index = parseInt(box.getAttribute("data-index"));
    if (!box.innerText && !gameEnded) {
        // Disable click handler for this box after setting text
        box.removeEventListener("click", boxClickHandler);
        placeMark(index);
    }
};

// Place mark based on current turn and index
const placeMark = (index) => {
    if (!gameEnded) {
        const currentBox = boxes[index];
        if (turnO) {
            currentBox.innerText = "X";
            currentBox.classList.add("x");
        } else {
            currentBox.innerText = "O";
            currentBox.classList.add("o");
        }
        turnO = !turnO;
        currentIndex = index; // Update currentIndex
        checkWinner();
    }
};

// Check for a winner
const checkWinner = () => {
    for (let pattern of winPatterns) {
        const [pos1, pos2, pos3] = pattern;
        const pos1Val = boxes[pos1].innerText;
        const pos2Val = boxes[pos2].innerText;
        const pos3Val = boxes[pos3].innerText;

        if (pos1Val && pos1Val === pos2Val && pos2Val === pos3Val) {
            showWinner(pos1Val);
            return;
        }
    }
    // Check for tie game
    if ([...boxes].every(box => box.innerText)) {
        print.innerText = "It's a tie!";
        showMsgContainer();
    }
};

// Show the winner
const showWinner = (winner) => {
    print.innerText = `Congratulations, the winner is ${winner} (${winner === 'X' ? player1Name : player2Name})!`;
    showMsgContainer();
};

// Show message container
const showMsgContainer = () => {
    msgContainer.classList.remove("hide");
    disableBoxes();
    gameEnded = true;
};

// Event listener for keyboard input
document.addEventListener("keydown", (e) => {
    if (!gameEnded) {
        switch (e.key) {
            case "ArrowLeft":
                currentIndex = currentIndex === 0 || currentIndex === 3 || currentIndex === 6 ? currentIndex + 2 : currentIndex - 1;
                break;
            case "ArrowRight":
                currentIndex = currentIndex === 2 || currentIndex === 5 || currentIndex === 8 ? currentIndex - 2 : currentIndex + 1;
                break;
            case "ArrowUp":
                currentIndex = currentIndex < 3 ? currentIndex + 6 : currentIndex - 3;
                break;
            case "ArrowDown":
                currentIndex = currentIndex > 5 ? currentIndex - 6 : currentIndex + 3;
                break;
            case "o":
            case "O":
                placeMark(currentIndex);
                break;
            case "x":
            case "X":
                placeMark(currentIndex);
                break;
            default:
                break;
        }
        highlightCurrentBox();
    }
});

// Event listener for start game button
startBtn.addEventListener("click", startGame);

// Event listener for reset button
resetBtn.addEventListener("click", resetGame);

// Initialize the game
resetGame();
