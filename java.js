const displayController = (()=>{
    const renderMessage = (message) =>{
        document.querySelector("#message").innerHTML = message;
    }
    return {
        renderMessage
    }
})();


const Gameboard = (()=>{
    let gameboard = Array(9).fill("");
    

    const render = ()=>{
        let boardHTML = "";
        
        gameboard.forEach((cell,index) => {
            boardHTML += `<div class="cell" id="cell-${index}">${cell}</div>`
        })
        document.querySelector(".gameboard").innerHTML = boardHTML;

        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell)=> {
            cell.addEventListener("click", Controller.handleClick);
        });
    };

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }
    const reset = ()=>{
        gameboard.fill("");
        render();
    }
    const getGameboard = ()=> gameboard


    return {
        render,
        update,
        reset,
        getGameboard
    }
})();

const createPlayer = (name,symbol) => {
    return {
        name,
        symbol,
    }
}

const Controller = (()=>{
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const startGame = ()=>{
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ]
        currentPlayerIndex=0;
        gameOver = false;
        Gameboard.render();

        
    }

    const restartGame = (()=> {
        Gameboard.reset();
        document.querySelector(".message").innerHTML = "";
        gameOver = false;
    })

    const handleClick = (event)=>{
        if (gameOver) return;

        let index = event.target.id.split("-")[1]; //get the index of the cell-X

        if (Gameboard.getGameboard()[index] !== "")
            return;
        Gameboard.update(index,players[currentPlayerIndex].symbol);

        if (checkWin(Gameboard.getGameboard())){
            gameOver = true;
           displayController.renderMessage(`${players[currentPlayerIndex].name} won!`);
        } else if (checkTie(Gameboard.getGameboard())){
            gameOver = true;
            displayController.renderMessage(`It's a tie!`);
        }
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const checkWin = (board)=>{
        const winCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i=0; i< winCombinations.length; i++){
            const [a, b, c] = winCombinations[i];
            if (board[a] && board[a] === board[b] && board[a]=== board[c]){
                return true;
            }
        }
        return false;
    }

    const checkTie = (board)=>{
        return (board.every(cell => cell!== ""));
    }

    return{
        startGame,
        handleClick,
        restartGame
    }

})();

const startButton = document.querySelector(".startButton");
startButton.addEventListener("click",() => {
    Controller.startGame();
});

const restartButton = document.querySelector(".restartButton")
restartButton.addEventListener("click",()=>{
    Controller.restartGame();
});