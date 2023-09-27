// Wait for the DOM to be fully loaded before executing any code
document.addEventListener('DOMContentLoaded', () => {
    let board = null; // initialize the board
    const game= new Chess(); //create new instance of the chess game
    const moveHistory = document.getElementById('move-history'); // get the move history div
    let moveCount= 1; // initialize the move count
    let userColor = 'w'; // set the user color as white

    // Function to make random moves for Computer
    const makeRandomMove = () => {
        const possibleMoves = game.moves(); // get all possible moves

        if(game.game_over()) { // if the game is over
            alert('Checkmate!');
        }else{
            const randomIdx = Math.floor(Math.random() * possibleMoves.length); // get a random index
            const move = possibleMoves[randomIdx]; // get the random move
            game.move(move); // make the random move
            board.position(game.fen()); // update the board position
            recordMove(move, moveCount); // update the board position
            moveCount++; // increment the move count
        };
    };
    // Function to record and display a move in the move history
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
    moveHistory.textContent += formattedMove + ' ';
    moveHistory.scrollTop = moveHistory.scrollHeight; // Auto scroll to the most recent move
    };

    // Function to handle the start of a drag position
    const onDragStart = (source, piece) =>{
        // Allow the user to move only their pieces based on the color
        return !game.game_over() && piece.search(userColor)== 0;
    };

    // Function to handle a piece drop on the board
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        
        if(move === null) return 'snapback'; // if the move is not valid, snap back to the original

        window.setTimeout(makeRandomMove, 250); // make the random move after 1 second
        recordMover(move.san, moveCount); // Record and Display the move with move  count
        moveCount++; // increment the move count
    };

    // Function to handle a piece of snap animation
    const onSnapEnd = () => {
        board.position(game.fen()); // update the board position
    };

    // Configuration options for the chess board
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position:'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'slow',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    // Initialize the chess board
    board = ChessBoard('board', boardConfig);

    // Event listener to start a new game
    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    // Event listener for the "Set Position" button
    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt('Enter the FEN notation for the desired position');
        if(fen !== null) {
            if(game.load(fen)) {
                board.position(fen);
                moveHistory.textContent = '';
                moveCount = 1;
                userColor = 'w';
            }else{
                alert('Invalid FEN notation');
            }
        }
    });
    // Event listener for the flip board button
    document.querySelector('.flip-board').addEventListener('click', () =>{
        board.flip();
        makeRandomMove();
        // Toggle user's color after flipping the board
        userColor = userColor === 'w'? 'b' : 'w';
    })

})  