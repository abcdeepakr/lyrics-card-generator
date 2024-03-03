const axios = require('axios');
const qs = require('qs');
import { cookies } from 'next/headers'

export const getAuthToken = async () => {
    let data = qs.stringify({
        'grant_type': process.env.GRANT_TYPE,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.TOKEN_BASE_PATH}/token`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    return await axios.request(config)
        .then((response) => {
            const { data: { access_token } } = response
            const secondsToExpire = 60 * 60 * 1000; //one hour
            cookies().set({
                name: 'access_token',
                value: access_token,
                httpOnly: true,
                path: '/',
                expires: Date.now() + secondsToExpire
            })
            return { access_token, status: response.status }
        })
        .catch((error) => {
            return { error: error.message, status: error.status }
        });
}
