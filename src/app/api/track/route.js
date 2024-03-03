import { getAuthToken } from "../utils/auth"
const axios = require('axios');
import { cookies } from 'next/headers'

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

export async function GET(req) {
    const cookieStore = cookies()
    let access_token = cookieStore.get('access_token')?.value
    if (!access_token) {
        const authTokenData = await getAuthToken()
        if (authTokenData.error) {
            return Response.error({ ...response })
        }
        access_token = authTokenData.access_token || ""
    }

    const searchParams = req.nextUrl.searchParams
    const trackId = searchParams.get('trackId')
    if (!trackId) {
        return Response.json({ status: 404, message: "trackId not found" })
    }
    const trackData = await getTrack({ access_token, trackId })
    if (trackData.error) {
        return Response.json(trackData)
    }
    const { data } = trackData
    return Response.json(data)

}