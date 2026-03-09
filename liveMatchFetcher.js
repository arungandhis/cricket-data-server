const axios = require("axios")

async function fetchMatches(){

 const response = await axios.get(
 "https://api.cricapi.com/v1/currentMatches?apikey=YOUR_API_KEY"
 )

 return response.data.data

}

module.exports = {fetchMatches}