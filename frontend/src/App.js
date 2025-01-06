import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { Home } from './Modules/Home';
import { GameLobby } from './Modules/GameLobby';
import { createUser } from './Modules/User/actions';
import { fetchActiveLobbies } from "./Modules/Home/actions";
import { selectUser, selectIsLoadingUser } from './Modules/User/selectors';
import { selectIsLoadingActiveLobbies } from "./Modules/GameLobby/selectors";
import { useWebSocket } from "./hooks/useWebSocket";

import './App.css';

export const App = () => {
    const { isConnected } = useWebSocket();
    const dispatch = useDispatch();
    const isLoadingUser = useSelector(selectIsLoadingUser);
    const user = useSelector(selectUser);
    const isLoadingLobbies = useSelector(selectIsLoadingActiveLobbies);

    useEffect(() => {
        const params = {
            name: `guest-${uuidv4()}`
        }
        dispatch(createUser(params));
        dispatch(fetchActiveLobbies());
    }, []);

    if (!user || !isConnected || isLoadingLobbies || isLoadingUser) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<GameLobby />} />
        </Routes>
  );
}
