import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Paper, Button } from "@mui/material";

import { selectLobby } from "../../GameLobby/selectors";

import { MAX_PLAYERS } from "../../../constants";

export const LobbyTile = ({ lobbyId }) => {
    const navigate = useNavigate();
    const lobby = useSelector(selectLobby(lobbyId));
    const { players, name, winner_user_id, tie } = lobby
    const realPlayers = players.filter(Boolean)

    if (winner_user_id || tie) return null;

    const handleJoinLobby = () => {
        navigate(`/game/${lobbyId}`)
    }

    return (
        <Paper className='lobby-tile'>
            Lobby {name}
            <Button
                className="join-lobby-button"
                variant="outlined"
                onClick={handleJoinLobby}
                disabled={realPlayers.length >= MAX_PLAYERS}
            >
                Join
            </Button>
            <div className="lobby-total">
                {realPlayers.length} of {MAX_PLAYERS} players
            </div>
        </Paper>
    );
};