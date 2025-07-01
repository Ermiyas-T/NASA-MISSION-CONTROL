const launchesCollection = require("./launches.mongo");
const planetsCollection = require("./planets.mongo");

const launch = {
  missionName: "Mission to Kepler - 1652",
  rocketType: "Explorer ISI",
  launchDate: "June 30, 2025",
  target: "Kepler-442 b",
  customers: ["ET", "NASA"],
  success: true,
  upcomming: true,
};
async function deleteAllLaunches() {
  await launchesCollection.deleteMany();
}

getLatestFlightNumber().then((flightNumber) => {
  if (flightNumber === 99) {
    new Promise(() => {
      launch.flightNumber = flightNumber;
      saveLaunch(launch).then(() => {});
    }).then(() => {});
  }
});
async function saveLaunch(launch) {
  launch.flightNumber = (await getLatestFlightNumber()) + 1;

  await launchesCollection.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
  return launch;
}
async function existsLaunchWithId(flightNumberId) {
  return await launchesCollection.findOne({ flightNumber: flightNumberId });
}
async function getLatestFlightNumber() {
  // Get all lists of flightNumber and then sort in ascending order and get the last Number
  const latestLaunches = await launchesCollection
    .findOne({}, { flightNumber: 1, _id: 0 })
    .sort({ flightNumber: -1 });
  if (!latestLaunches) {
    return 99;
  }
  return latestLaunches.flightNumber;
}
async function getAllLaunches() {
  try {
    const launches = await launchesCollection.find({}, { _id: 0, __v: 0 });

    return launches;
  } catch (err) {
    return err;
  }
}

async function scheduleLaunch(launch) {
  //check whether the target is valid ( among the habitable planets)
  const planet = await planetsCollection.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("Target Planet is Invalid");
  }
  //add the remaining constant launches properties
  const newLaunch = Object.assign(launch, {
    upcomming: true,
    success: true,
    customers: ["NASA", "ET"],
    flightNumber: (await getLatestFlightNumber()) + 1,
  });

  //save on the database
  return await saveLaunch(newLaunch);
}
async function abortLaunch(flightNumber) {
  try {
    await launchesCollection.updateOne(
      { flightNumber: flightNumber },
      { upcomming: false, success: false }
    );
  } catch (err) {
    throw new Error("failed to abort the launch");
  }

  return await launchesCollection.findOne(
    { flightNumber: flightNumber },
    { _id: 0, __v: 0 }
  );
}
module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleLaunch,
  abortLaunch,
};
