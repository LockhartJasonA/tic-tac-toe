import axios from 'axios';
import env from '../_env'

export function fetchLeaderboardReq(count) {
    const leaderboardUrl = `${env.api}/leaderboard?count=${count}`;

    return axios.get(leaderboardUrl)
        .then(response => {
            return response;
        })
}

export function fetchActiveLobbiesReq() {
    const activeLobbiesUrl = `${env.api}/games`;

    return axios.get(activeLobbiesUrl)
        .then(response => {
            return response;
        })
}

export function createGameReq(parameters) {
    const createGameUrl = `${env.api}/game`;

    return axios.post(createGameUrl, parameters)
        .then(response => {
            return response;
        })
}

export function updateGameReq(gameId, parameters) {
    const updateGameUrl = `${env.api}/game/${gameId}`;

    return axios.put(updateGameUrl, parameters)
        .then(response => {
            return response;
        })
}