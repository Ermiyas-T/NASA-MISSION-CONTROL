const {
  getAllLaunches,
  abortLaunch,
  scheduleLaunch,
  existsLaunchWithId,
} = require("../../model/launches.model");
const Joi = require("joi");

// Joi schema for launch validation
const launchSchema = Joi.object({
  missionName: Joi.string().required(),
  rocketType: Joi.string().required(),
  launchDate: Joi.date().required(),
  target: Joi.string().required(),
});

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpPostLaunch(req, res) {
  const launch = req.body;
  launch.launchDate = new Date(launch.launchDate);
  const { error } = launchSchema.validate(launch);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  const addedLaunch = await scheduleLaunch(launch);
  return res.status(200).json(addedLaunch);
}

async function httpAbortLaunch(req, res) {
  const flightNumber = Number(req.params.id);

  if (!(await existsLaunchWithId(flightNumber))) {
    return res.status(404).json({
      error: "launch not found",
    });
  }
  return res.status(200).json(await abortLaunch(flightNumber));
}

module.exports = {
  httpGetAllLaunches,
  httpPostLaunch,
  httpAbortLaunch,
};
