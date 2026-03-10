let ball = 0

function startEngine(broadcast){

  console.log("Match engine started")

  setInterval(()=>{

    ball++

    const payload = {

      team1: "India 145/3",
      team2: "Australia",

      overs: "16." + ball,

      batsman1: "Kohli 67 (42)",
      batsman2: "Rahul 21 (14)",

      bowler: "Starc",

      commentary: "Kohli drives through covers for four!"

    }

    console.log("Broadcasting:", payload)

    broadcast(payload)

  },5000)

}

module.exports = startEngine