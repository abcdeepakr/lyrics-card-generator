import { getAuthToken } from "../utils/auth"
const axios = require('axios');


const getArtists = async ({ access_token, artistIds }) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.API_BASEPATH}/artists?ids=${artistIds}`,
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };

    return await axios.request(config)
        .then((response) => {
            return { data: response.data, status: response.status, isError: false }
        })
        .catch((error) => {
            return { status: error.response.status, error: error.message, isError: true }
        });

}

export async function GET(request) {
    const response = await getAuthToken()
    if (response.error) {
        return Response.error({ ...response })
    }
    const searchParams = request.nextUrl.searchParams
    const artistIds = searchParams.get('artists')
    if(!artistIds){
        return Response.json({status:404, message:"artists not found"})
    }
    const { access_token } = response.data
    const artistData = await getArtists({ access_token, artistIds })
    if (artistData.error) {
        return Response.json(artistData)
    }
    const { data } = artistData
    return Response.json(data)

}