import { getAuthToken } from "../utils/auth"
const axios = require('axios');


const getTrack = async ({ access_token, trackId }) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.API_BASEPATH}/tracks/${trackId}`,
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
    const trackId = searchParams.get('trackId')
    if(!trackId){
        return Response.json({status:404, message:"trackId not found"})
    }
    const { access_token } = response.data
    const trackData = await getTrack({ access_token, trackId })
    if (trackData.error) {
        return Response.json(trackData)
    }
    const { data } = trackData
    return Response.json(data)

}