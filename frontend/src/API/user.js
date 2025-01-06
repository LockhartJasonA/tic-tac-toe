import axios from 'axios';
import env from '../_env'

export function createUserReq(parameters) {
    const createUserUrl = `${env.api}/user`

    return axios.post(createUserUrl, parameters)
        .then(response => {
            return response;
        })
}