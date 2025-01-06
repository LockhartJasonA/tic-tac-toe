import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

import { selectLobbyWinner, selectLobbyIsTie } from '../selectors';
import { selectUser } from '../../User/selectors';

export const GameStateMessage = ({ isMyTurn }) => {
    const { id } = useParams();
    const winnerUserId = useSelector(selectLobbyWinner(id));
    const isTie = useSelector(selectLobbyIsTie(id));
    const user = useSelector(selectUser);
    let message = ''
    let color = ''

    if (winnerUserId) {
        if (winnerUserId === user.id) {
            message = "You Win!";
            color = "green-text";
        }
        else {
            message = "You Lose!";
            color = "red-text";
        }
    }
    else if (isTie) {
        message = "Tie!";
        color = "black-text";
    }
    else if (isMyTurn()) {
        message = "Your Turn";
        color = "green-text";
    }
    else {
        message = "Opponent's Turn";
        color = "red-text";
    }

    return (
        <h2 className={color}>{message}</h2>
    )
};