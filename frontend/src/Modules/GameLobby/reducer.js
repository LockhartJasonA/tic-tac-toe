import { createSlice } from '@reduxjs/toolkit';
import {fetchActiveLobbies} from "../Home/actions";

export const initialState = {
    loadingActiveLobbies: true,
    gameLobbies: {},
    gameStates: {}
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        createNewGame: (state, action) => {
            const lobbyId = action.payload.id;
            const lobbyName = action.payload.lobby_name;
            state.gameLobbies[lobbyId] = {
                name: lobbyName,
                players: [],
                winner_user_id: null,
                tie: false
            }
            state.gameStates[lobbyId] = {
                positions: Array(9).fill(null)
            }
        },
        joinGame: (state, action) => {
            const { user, gameId } = action.payload;
            if (state.gameLobbies[gameId]) {
                const { players } = state.gameLobbies[gameId];
                const playerPlaceholder = players.indexOf(null);
                if (playerPlaceholder !== -1) {
                    state.gameLobbies[gameId].players[playerPlaceholder] = user;
                } else {
                    state.gameLobbies[gameId].players.push(user);
                }
            }
        },
        leaveGame: (state, action) => {
            const { user, gameId } = action.payload;
            if (state.gameLobbies[gameId]) {
                const { players } = state.gameLobbies[gameId]
                state.gameLobbies[gameId].players = players.map(player => player && player.id === user.id ? null : player);
            }
        },
        removeUserFromGames: (state, action) => {
            const userId = action.payload;
            Object.keys(state.gameLobbies).forEach(lobbyId => {
                const { players } = state.gameLobbies[lobbyId]
                state.gameLobbies[lobbyId].players = players.map(player => player && player.id === userId ? null : player);
            });
        },
        makeMove: (state, action) => {
            const { gameId, positions } = action.payload;
            if (state.gameStates[gameId]) {
                state.gameStates[gameId].positions = positions;
            }
        },
        setTie: (state, action) => {
            const { gameId } = action.payload;
            state.gameLobbies[gameId].tie = true;
        },
        setWinner: (state, action) => {
            const { gameId, userId } = action.payload;
            state.gameLobbies[gameId].winner_user_id = userId;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActiveLobbies.pending, (state) => {
                state.loadingActiveLobbies = true;
            })
            .addCase(fetchActiveLobbies.fulfilled, (state, action) => {
                action.payload.forEach(lobby => {
                    const players = [];
                    if (lobby.player2 && !lobby.player1) {
                        players.push(null);
                    }
                    lobby.player1 && players.push(lobby.player1);
                    lobby.player2 && players.push(lobby.player2);
                    state.gameLobbies[lobby.id] = {
                        name: lobby.lobby_name,
                        players,
                        winner_user_id: null,
                        tie: false
                    };
                    state.gameStates[lobby.id] = {
                        positions: JSON.parse(lobby.game_state)
                    }
                });
                state.loadingActiveLobbies = false;
            })
    },
});

export const {
    createNewGame,
    joinGame,
    leaveGame,
    removeUserFromGames,
    makeMove,
    setTie,
    setWinner
} = gameSlice.actions;

export default gameSlice.reducer;