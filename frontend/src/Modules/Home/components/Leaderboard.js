import { useSelector } from "react-redux";
import { Paper } from "@mui/material";

import { selectIsLoadingLeaderboard, selectLeaderboard } from "../selectors";

export const Leaderboard = () => {
    const isLoadingLeaderboard = useSelector(selectIsLoadingLeaderboard);
    const leaderboard = useSelector(selectLeaderboard);

    const playerWins = () => {
        if (isLoadingLeaderboard) {
            return <div>Loading...</div>
        }
        if (!leaderboard.length) {
            return <div className="no-leaderboard">No players on the leaderboard</div>
        }
        return leaderboard.map((leaderboardUser, index) => {
            const place = index + 1;
            return (
                <div key={`leaderboard-${leaderboardUser.name}`}>
                    {place}: {leaderboardUser.name}: {leaderboardUser.wins}
                </div>
            )
        })
    }

    return (
        <Paper className='leaderboard'>
            <h4>Leaderboard</h4>
            {playerWins()}
        </Paper>
    );
};