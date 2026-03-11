const gTTS = require("gtts")
const path = require("path")

async function generateCommentaryAudio(text){

return new Promise((resolve,reject)=>{

try{

const filePath = path.join(__dirname,"public","commentary.mp3")

const tts = new gTTS(text,"en")

tts.save(filePath,(err)=>{

if(err){
reject(err)
return
}

resolve("/commentary.mp3")

})

}catch(err){
reject(err)
}

})

}

module.exports = generateCommentaryAudio