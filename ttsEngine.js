const gTTS = require("gtts")
const path = require("path")

async function generateAudio(text){

return new Promise((resolve,reject)=>{

const file = path.join(__dirname,"public","commentary.mp3")

const gtts = new gTTS(text,"en")

gtts.save(file,function(err){

if(err){
reject(err)
return
}

resolve("/commentary.mp3")

})

})

}

module.exports = generateAudio