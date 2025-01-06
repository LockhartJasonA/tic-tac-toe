import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@mui/material"

import { fetchLeaderboard } from "./actions";
import { createGameAction } from '../GameLobby/actions';
import { selectGameLobbies } from '../GameLobby/selectors';
import { useWebSocket } from "../../hooks/useWebSocket";
import { Leaderboard } from "./components/Leaderboard";
import { LobbyTile } from "./components/LobbyTile";

import { LEADERBOARD_SIZE } from "../../constants";
import './home.css'

export const Home = () => {
    const { wsRef } = useWebSocket();
    const dispatch = useDispatch();
    const gameLobbies = useSelector(selectGameLobbies);

    useEffect(() => {
        dispatch(fetchLeaderboard(LEADERBOARD_SIZE));
    }, []);

    const handleCreateLobby = () => {
        const lobby_name = uuidv4();
        dispatch(createGameAction({ lobby_name }))
            .then((action) => handleCreateLobbyMessage(action));
    }

    const handleCreateLobbyMessage = (action) => {
        if (createGameAction.fulfilled.match(action)) {
            const message = {
                action: 'createGame',
                lobby: {
                    id: action.payload.id,
                    lobby_name: action.payload.lobby_name
                }
            }
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.error('Failed to create game');
        }
    }

    const lobbyList = () => {
        let lobbies = Object.keys(gameLobbies).filter(lobbyId => {
            let lobby = gameLobbies[lobbyId];
            return !lobby.winner_user_id && !lobby.tie;
        });

        if(!lobbies.length) {
            return <h3 className='no-lobbies'>No Lobbies Available</h3>
        }
        else {
            return (
                <div className='lobby-list'>
                    {lobbies.map(lobbyId => {
                        return <LobbyTile key={`lobby-${lobbyId}`} lobbyId={lobbyId}/>
                    })}
                </div>
            )
        }
    }

    return (
        <div className='home-container'>
            <div className='home-header'>
                <Leaderboard/>
                <div className='create-lobby-holder'>
                    <div className="create-lobbies-title">
                        <h2>Tic-Tac-Toe Lobbies</h2>
                    </div>
                    <div className="create-lobbies-button-wrapper">
                        <Button variant="contained" onClick={handleCreateLobby}>Create Lobby</Button>
                    </div>
                </div>
            </div>
            {lobbyList()}
        </div>
    );
}
