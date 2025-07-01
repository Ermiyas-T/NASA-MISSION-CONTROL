const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const planetDatabase = require("./planets.mongo.js");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

async function loadPlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await planetDatabase.updateOne(
            { keplerName: data.kepler_name },
            {
              $set: {
                keplerName: data.kepler_name,
              },
            },
            { upsert: true }
          );
        }
      })
      .on("error", (err) => {
        // console.error("Error reading the file:", err);
        reject(err); // Reject the promise on error
      })
      .on("end", async () => {
        const result = await getAllPlanets();
        console.log(`${result.length} habitable planets found!`);
        resolve(planetDatabase); // Resolve the promise on completion
      });
  });
}
async function getAllPlanets() {
  return await planetDatabase.find({});
}
module.exports = {
  loadPlanetData,
  planets: planetDatabase,
  getAllPlanets,
};
