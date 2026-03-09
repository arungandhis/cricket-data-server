const gTTS = require("gtts")
const fs = require("fs")
const path = require("path")

function speak(text){

 const filePath = path.join(__dirname,"public","commentary.mp3")

 const speech = new gTTS(text,"en")

 speech.save(filePath,(err)=>{

  if(err){
   console.log("TTS Error:",err)
  }else{
   console.log("Audio generated")
  }

 })

}

module.exports={speak}