const http = require("http");
const os = require("os");
// const cluster = require("cluster");
const { loadPlanetData } = require("./model/planets.model.js");
const app = require("./app.js");

const PORT = process.env.PORT;

function startHttpServer() {
  try {
    loadPlanetData();
    console.log("Planet data loaded successfully.");
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`server starts running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error in loading planet data:", error);
  }
}
/*
clusterring the node processes to utilize all CPU cores
*/
// async function main() {
//   if (cluster.isPrimary) {
//     try {
//       await loadPlanetData();
//       console.log("Planet data loaded successfully.");
//       const numCPUs = os.cpus().length;
//       for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//       }
//       cluster.on("exit", (worker, code, signal) => {
//         console.log(
//           `Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}`
//         );
//       });
//     } catch (error) {
//       console.error("Error loading planet data:", error);
//     }
//   } else {
//     startHttpServer();
//   }
// }
// main().catch((error)=>{
//   console.error("Error in main function:", error);
// })
startHttpServer();
