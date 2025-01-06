import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import { joinGameAction, leaveGameAction } from "./actions";
import { selectLobby, selectLobbyPlayers, selectPositions} from "./selectors";
import { selectUser } from "../User/selectors";
import { useWebSocket } from "../../hooks/useWebSocket";
import { GameBoard } from "./components/GameBoard";
import { GameStateMessage } from "./components/GameStateMessage";
import { PlayerList } from "./components/PlayerList";

import './gamelobby.css';

export const GameLobby = () => {
    const { id } = useParams();
    const { wsRef } = useWebSocket();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lobby = useSelector(selectLobby(id));
    const players = useSelector(selectLobbyPlayers(id));
    const currentPositions = useSelector(selectPositions(id));
    const user = useSelector(selectUser);
    const playerNumber = useRef(null);

    useEffect(() => {
        if (lobby && players.filter(Boolean).length < 2) {
            const playerPlaceholder = players.indexOf(null) + 1;
            playerNumber.current = playerPlaceholder ? playerPlaceholder : players.length + 1;

            const parameters = {
                [`player${playerNumber.current}_user_id`]: user.id
            }

            dispatch(joinGameAction({gameId: id, parameters}))
                .then(action => handleJoinMessage(action))
        }
        else {
            navigate(`/`)
        }

        return () => {
            const parameters = {
                [`player${playerNumber.current}_user_id`]: null
            }
            dispatch(leaveGameAction({ gameId: id, parameters }))
                .then(action => handleLeaveMessage(action))
        }
    }, []);

    const handleJoinMessage = (action) => {
        if (joinGameAction.fulfilled.match(action)) {
            const message = {
                action: 'joinGame',
                user,
                gameId: id
            };
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.error('Failed to join game');
        }
    }

    const handleLeaveMessage = (action) => {
        if (leaveGameAction.fulfilled.match(action)) {
            const message = {
                action: 'leaveGame',
                user,
                gameId: id
            };
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.error('Failed to leave game');
        }
    }

    const isMyTurn = () => {
        const filledPositions = currentPositions.filter(position => position !== null);
        if (playerNumber.current === 1) {
            return !filledPositions || filledPositions.length % 2 === 0;
        }
        if (playerNumber.current === 2) {
            return filledPositions && filledPositions.length % 2 === 1;
        }
    }

    return (
        <div className="game-lobby-container">
            <div className="game-lobby-header">
                <PlayerList />
                <Link to='/'>
                    <Button variant="contained">
                        Back to Lobbies
                    </Button>
                </Link>
            </div>
            <GameStateMessage isMyTurn={isMyTurn} />
            <h1>Tic-Tac-Toe</h1>
            <GameBoard isMyTurn={isMyTurn}/>
        </div>
    );
}
