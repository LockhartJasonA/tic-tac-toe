import { useRef, useEffect, createContext, useContext, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useDispatch, useSelector } from "react-redux";

import { selectUser } from "../Modules/User/selectors";
import {
    createNewGame,
    joinGame,
    leaveGame,
    removeUserFromGames,
    makeMove,
    setTie,
    setWinner
} from "../Modules/GameLobby/reducer";

export const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const wsRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const WS_URL = 'ws://localhost:8000/ws';

    useEffect(() => {
        if (!user) {
            return;
        }

        wsRef.current = new ReconnectingWebSocket(WS_URL);

        wsRef.current.addEventListener('open', () => {
            setIsConnected(true);
            const message = {
                action: 'connect',
                userId: user.id
            };
            wsRef.current.send(JSON.stringify(message));
        });

        wsRef.current.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);

            if (message.action === 'createGame') {
                const { lobby } = message;
                dispatch(createNewGame(lobby));
            }

            if (message.action === 'joinGame') {
                const { user, gameId } = message;
                const payload = { user, gameId };
                dispatch(joinGame(payload));
            }

            if (message.action === 'leaveGame') {
                const { user, gameId } = message;
                const payload = { user, gameId };
                dispatch(leaveGame(payload));
            }

            if (message.action === 'userDisconnected') {
                const { userId } = message;
                dispatch(removeUserFromGames(userId));
            }

            if (message.action === 'makeMove') {
                const { gameId, positions } = message;
                dispatch(makeMove({ gameId, positions }));
            }

            if (message.action === 'setTie') {
                const { gameId } = message;
                dispatch(setTie({ gameId }));
            }

            if (message.action === 'setWinner') {
                const { gameId, userId } = message;
                dispatch(setWinner({ gameId, userId }));
            }
        });

        return () => {
            wsRef.current.close();
        };
    }, [user]);

    return (
        <WebSocketContext.Provider value={{ wsRef, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
}