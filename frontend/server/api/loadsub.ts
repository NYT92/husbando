import axios from 'axios'
import { getToken } from "#auth";

export default eventHandler(async (event) => {
  const { data } = await axios.get(`${useRuntimeConfig().public.FORMATE_URL}api/submissions?table=submissions-husbandosub`, { 
    headers: { 
      'X-Space-App-Key': useRuntimeConfig().FORMATE_API_KEY,
    }
  })
  // check if the user is logged in
  const token = await getToken({ event });
  if (token) {
    return {
      statusCode: 200,
      data: data.submissions,
    };
  }
  return {
    statusCode: 401,
    error: "Not authorized!",
  };
})