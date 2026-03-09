const express = require("express")
const cors = require("cors")
const http = require("http")

const {generateBall,score} = require("./matchEngine")
const {initWebsocket} = require("./websocket")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const server = http.createServer(app)
const wss = initWebsocket(server)

let engineRunning=false

function broadcast(data){

 wss.clients.forEach(client=>{
  if(client.readyState===1){
   client.send(JSON.stringify(data))
  }
 })

}

setInterval(()=>{

 if(!engineRunning) return

 const event = generateBall()

 broadcast(event)

},6000)

app.get("/",(req,res)=>{
 res.json({status:"Broadcast Pro Running"})
})

app.post("/admin/start",(req,res)=>{
 engineRunning=true
 res.json({message:"Match started"})
})

app.post("/admin/stop",(req,res)=>{
 engineRunning=false
 res.json({message:"Match stopped"})
})

app.get("/score",(req,res)=>{
 res.json(score)
})

server.listen(process.env.PORT || 3000,()=>{
 console.log("Broadcast server running")
})