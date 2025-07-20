const {
  getAllLaunches,
  abortLaunch,
  checkLaunchExist,
  addLaunch,
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
  //programatically pass query param to getAllLaunches if query is present if not leave the default
  const query = { ...req.query };
  if (!query.page) query.page = 1;
  if (!query.limit) query.limit = 5;
  const launches = await getAllLaunches(query);
  if (!launches) {
    return res.status(500).json({
      error: "unexpected error happened on get launches",
    });
  }
  return res.status(200).json({
    ok: true,
    launches: launches,
  });
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

  const addedLaunch = await addLaunch(launch);
  if (!addedLaunch) {
    return res
      .status(500)
      .json({ error: "unexpected error happenend on add Launch" });
  }
  return res.status(200).json({ ok: true, launch: addedLaunch });
}

async function httpAbortLaunch(req, res) {
  const flightNumber = Number(req.params.id);

  if (!(await checkLaunchExist(flightNumber))) {
    return res.status(404).json({
      error: "launch not found",
    });
  }
  const aborted = await abortLaunch(flightNumber);
  if (!aborted) {
    return res
      .status(400)
      .json({ error: "unexpected error occured on abort launch" });
  }
  return res.status(200).json({ ok: true });
}

module.exports = {
  httpGetAllLaunches,
  httpPostLaunch,
  httpAbortLaunch,
};
