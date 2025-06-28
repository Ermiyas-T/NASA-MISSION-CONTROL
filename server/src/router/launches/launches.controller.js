const {
  getAllLaunches,
  abortLaunch,
  addLaunch,
} = require("../../model/launches.model");
function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}
function httpPostLaunch(req, res) {
  const launch = req.body;
  if (!launch) {
    res.status(404).json({ error: "Bad request -- No data sent to server" });
  }
  if (
    !launch.missionName ||
    !launch.rocketType ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  } else if (isNaN(Date.parse(launch.launchDate))) {
    return res.status(400).json({
      error: "Invalid launch date -- the data must be in ISO format",
    });
  }
  const addedLaunch = addLaunch(launch);
  return res.status(200).json(addedLaunch);
}

function httpAbortLaunch(req, res) {
  const flightNumber = Number(req.params.id);
  const launches = getAllLaunches();
  if (!flightNumber || isNaN(flightNumber)) {
    return res.status(400).json({
      error: "Flight number is required",
    });
  }

  if (!launches.some((launch) => launch.flightNumber === flightNumber)) {
    return res.status(404).json({
      error: "launch not found",
    });
  }
  return res.status(200).json(abortLaunch(flightNumber));
}
module.exports = {
  httpGetAllLaunches,
  httpPostLaunch,
  httpAbortLaunch,
};
