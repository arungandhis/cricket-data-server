const gTTS = require("gtts")
const path = require("path")

function generateCommentaryAudio(text){

return new Promise((resolve,reject)=>{

if(!text || text.trim()===""){
return reject(new Error("No text to speak"))
}

const filePath = path.join(__dirname,"public","commentary.mp3")

const tts = new gTTS(text,"en")

tts.save(filePath,(err)=>{

if(err){
return reject(err)
}

resolve("/commentary.mp3")

})

})

}

module.exports = generateCommentaryAudio