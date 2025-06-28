const { getAllPlanets } = require("../../model/planets.model");
async function httpGetAllPlanets(req, res) {
  // Fetch all planets from the model and send as a response
  const allPlanets = await getAllPlanets();
  res.status(200).json(allPlanets);
}
module.exports = {
  httpGetAllPlanets,
};
