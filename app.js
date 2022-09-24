const HTTP = require('http') // imported the http module to use its {create server function, request&&response methods , etc}
const FS = require('fs'); // imported the nodejs fs(filesystem) module because we would be reading, writing and deleting a file on our computer 
const path = require('path') // imported the path module to join path

let playersDB = [];
const dbPath = path.join(__dirname, "DB", 'winners.Json' ); // creating a direct path by using the path module (DB/winners.JSON)
const PORT = 8080; // the port the server is running on
const HOSTNAME = "localhost"; // hostname 

const requestListener = function(request, response){ // function is used to handle request
    if(request.url==='/winners' && request.method === "GET" ){ // http path and methods perform different funtion (this perform a GET request)
        getAllWinners(request, response);
    }else if(request.url==='/winners' && request.method ==="POST"){  // http path and methods perform different funtion (this perform a POST request)
        addPlayers(request, response);
    }else if (request.url === '/winners' && request.method=== "DELETE"){ // http path and methods perform different funtion (this perform a Delete request)
        deletePlayer(request, response);
    } else{  // error handling if the path or method is not found or availabile 
        response.writeHead(400);
        response.end('unknown url')
    }
}

function getAllWinners(request, response){
    FS.readFile(dbPath , 'utf8', (error, winners)=>{
        if(error){
            response.writeHead(400)
            response.end('An error occured')
        }
        response.end(winners)
    })
}

function addPlayers(request, response){
    const body = [];
    request.on("data", (chunk)=> {
        body.push(chunk)
        console.log(body);
    })

    request.on("end", ()=>{
        const parsedBody = Buffer.concat(body).toString(); 
        const newPlayer = JSON.parse(parsedBody);
        console.log(newPlayer)


        FS.readFile(dbPath, 'utf8', (err, data)=>{
            if(err){
                console.log(err)
                response.writeHead(400)
                response.end('An error occured')
            }
            const previousData = JSON.parse(data);
            const lastPlayer = previousData[previousData.length - 1];
            const previousLastPlayerId = lastPlayer.id;
            console.log(previousLastPlayerId);
            newPlayer.id =  parseInt(previousLastPlayerId) + 1;
            const presentData = [...previousData, newPlayer];
       

        FS.writeFile(dbPath, JSON.stringify(presentData), (err) =>{
            if (err){
                console.log(err)
                response.writeHead(400)
                res.end(JSON.stringify({
                    message: 'Internal Server Error. Could not save book to database.'
                }));
            }
            response.end(JSON.stringify(newPlayer));
        }) 
    })
    })
}

function deletePlayer(request, response) {
    body= []
    request.on("data", (chunk)=> {
        body.push(chunk);
    })

    request.on("end",() => {
            const parsedBook = Buffer.concat(body).toString()
            const detailsToDelete = JSON.parse(parsedBook)
            const playerId = detailsToDelete.id

            FS.readFile(dbPath, 'utf8', (err, players)=>{
                if(err){
                    console.log(err)
                    response.writeHead(500);
                    response.end("An error occured")
                }

                const playerObj = JSON.parse(players);

                const playerIndex = playerObj.findIndex(player => player.id === playerId)

                if (playerIndex === -1) {
                    response.writeHead(404)
                    response.end("Book with the specified id not found!")
                    return
                }

                playerObj.splice(playerIndex, 1);

                FS.writeFile(dbPath, JSON.stringify(playerObj), (err) => {
                    if(err){
                        console.log(err);
                    response.writeHead(500);
                    response.end(JSON.stringify({
                        message: 'Internal Server Error. Could not delete book to database.'
                    }));
                    }
                    response.writeHead(200);
                    response.end("player has been sucessfully deleted")
                })
            })
    })

}


const server = HTTP.createServer(requestListener); // creating server
server.listen(PORT, HOSTNAME, ()=>{ // starting server
    console.log(`server started at ${PORT} `)
})

module.exports = server;