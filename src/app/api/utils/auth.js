const axios = require('axios');
const qs = require('qs');

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
            const { data = {} } = response
            return {data, status:response.status}
        })
        .catch((error) => {
            return {error:error.message, status:error.status}
        });
}
