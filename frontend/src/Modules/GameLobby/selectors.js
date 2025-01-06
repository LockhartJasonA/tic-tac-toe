export const selectLobby = gameId => state => {
    if (state.gameLobby.gameLobbies[gameId]) {
        return state.gameLobby.gameLobbies[gameId];
    }
    return null;
}

export const selectLobbyPlayers  = gameId => state => {
    if (state.gameLobby.gameLobbies[gameId]) {
        return state.gameLobby.gameLobbies[gameId].players;
    }
    return []
}

export const selectLobbyWinner = gameId => state => {
    if (state.gameLobby.gameLobbies[gameId]) {
        return state.gameLobby.gameLobbies[gameId].winner_user_id;
    }
    return null;
}

export const selectLobbyIsTie = gameId => state => {
    if (state.gameLobby.gameLobbies[gameId]) {
        return state.gameLobby.gameLobbies[gameId].tie;
    }
    return null;
}
export const selectGameLobbies = (state) => state.gameLobby.gameLobbies;

export const selectPositions = gameId => state => {
    if (state.gameLobby.gameStates[gameId]) {
        return state.gameLobby.gameStates[gameId].positions;
    }
    return [];
}

export const selectIsLoadingActiveLobbies = state => state.gameLobby.loadingActiveLobbies;