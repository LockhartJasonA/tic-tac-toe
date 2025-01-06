import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import HomeReducer from './Home/reducer';
import GameLobbyReducer from './GameLobby/reducer';
import UserReducer from './User/reducer';

const logger = createLogger();

const middleware = (getDefaultMiddleware) => {
    let middleware = getDefaultMiddleware();
    if (process.env.NODE_ENV !== 'production') {
        middleware = middleware.concat(logger);
    }
    return middleware;
}

export const store = configureStore({
    reducer: {
        home: HomeReducer,
        gameLobby: GameLobbyReducer,
        user: UserReducer
    },
    middleware
});
