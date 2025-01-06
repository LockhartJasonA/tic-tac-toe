import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Paper } from "@mui/material";

import { selectLobbyPlayers } from "../selectors";

export const PlayerList = () => {
    const { id } = useParams();
    const players = useSelector(selectLobbyPlayers(id));

    return (
        <Paper className="player-list">
            <h4 className="players-title">Players</h4>
                {players.map((player, index) => {
                    if (player) {
                        const playerNumber = index + 1;
                        return (
                            <div key={`player-${player.id}`}>
                                #{playerNumber} {player.name}
                            </div>
                        )
                    }
                    return null;
                })}
        </Paper>
    );
};