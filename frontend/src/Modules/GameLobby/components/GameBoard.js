import { useSelector, useDispatch } from "react-redux";

import {
    selectLobbyIsTie,
    selectLobbyWinner,
    selectLobbyPlayers,
    selectPositions
} from "../selectors";
import { useWebSocket } from "../../../hooks/useWebSocket";
import { useParams } from "react-router-dom";
import { selectUser } from "../../User/selectors";
import { makeMoveAction } from "../actions";

import { WINNING_LINES } from '../../../constants'

export const GameBoard = ({ isMyTurn }) => {
    const { id } = useParams();
    const { wsRef } = useWebSocket();
    const dispatch = useDispatch();
    const players = useSelector(selectLobbyPlayers(id));
    const currentPositions = useSelector(selectPositions(id));
    const user = useSelector(selectUser);
    const winner = useSelector(selectLobbyWinner(id));
    const isTie = useSelector(selectLobbyIsTie(id));

    const yourLetter = () => players.findIndex(player => player && player.id === user.id) === 0 ? 'X' : 'O';
    const yourMoves = () => {
        const letter = yourLetter();
        return currentPositions.reduce((acc, curr, index) => {
            if (curr === letter) {
                acc.push(index);
            }
            return acc;
        }, []);
    }

    const findWinningLine = (positions) => {
        for (let line of WINNING_LINES) {
            let first = positions[line[0]];
            let second = positions[line[1]];
            let third = positions[line[2]];

            if (first === 'X' && second === 'X' && third === 'X') {
                return line;
            }

            if (first === 'O' && second === 'O' && third === 'O') {
                return line;
            }
        }

        return [];
    }

    const checkForWinner = (positions) => {
        const winningLine = findWinningLine(positions);
        if (winningLine.length) {
            return positions[winningLine[0]] === 'X' ? players[0] : players[1];
        }

        return null;
    }

    const checkForTie = (positions) => {
        return positions.every(position => position !== null);
    }

    const makeMove = (position) => {
        if (isMyTurn() && !currentPositions[position]) {
            const updatedPositions = [...currentPositions];
            updatedPositions[position] = yourLetter();

            const isTie = checkForTie(updatedPositions);
            const winner = checkForWinner(updatedPositions);

            const parameters = {
                game_state: JSON.stringify(updatedPositions)
            }
            if (winner) {
                parameters.winner_user_id = winner.id;
            }
            if (isTie) {
                parameters.tie = isTie;
            }
            dispatch(makeMoveAction({gameId: id, parameters}))
                .then(action => handleMoveMessage(action, updatedPositions, isTie, winner))
        }
    }

    const handleMoveMessage = (action, updatedPositions, isTie, winner) => {
        if (makeMoveAction.fulfilled.match(action)) {
            const moveMessage = {
                action: 'makeMove',
                gameId: id,
                positions: updatedPositions
            };
            wsRef.current.send(JSON.stringify(moveMessage));
            if (isTie) {
                const tieMessage = {
                    action: 'setTie',
                    gameId: id
                }
                wsRef.current.send(JSON.stringify(tieMessage));
            }
            if (winner) {
                const winnerMessage = {
                    action: 'setWinner',
                    gameId: id,
                    userId: winner.id
                }
                wsRef.current.send(JSON.stringify(winnerMessage));
            }
        } else {
            console.error('Failed to join game');
        }
    }

    return (
        <div className={`play-area ${winner || isTie ? 'disabled' : ''}`}>
            {currentPositions.map((letter, index) => {
                const blockClass = yourMoves().includes(index) ? 'green-text' : 'red-text';
                const winningClass = findWinningLine(currentPositions).includes(index)
                    ? (winner === user.id ? 'winning-block-good' : 'winning-block-bad')
                    : '';
                return (
                    <div
                        key={`block-${index}`}
                        className={`block ${blockClass} ${winningClass}`}
                        onClick={() => makeMove(index)}
                    >
                        {letter}
                    </div>
                )
            })}
        </div>
    )
}