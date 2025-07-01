const launchesCollection = require("./launches.mongo");
const planetsCollection = require("./planets.mongo");
// const launches = new Map();

const launch = {
  missionName: "Mission to Kepler - 1652",
  rocketType: "Explorer ISI",
  launchDate: "June 30, 2025",
  target: "Kepler-442 b",
  customers: ["ET", "NASA"],
  success: true,
  upcomming: true,
};
//delete all launches from the database
async function deleteAllLaunches() {
  await launchesCollection.deleteMany();
}
// deleteAllLaunches().then();
// console.log(await getLatestFlightNumber());
getLatestFlightNumber().then((flightNumber) => {
  if (flightNumber === 99) {
    new Promise(() => {
      launch.flightNumber = flightNumber;
      saveLaunch(launch).then(() => {});
    }).then(() => {});
  }
});
// launches.set(launch.flightNumber, launch);
async function saveLaunch(launch) {
  // check whether the target is valid (among the habitable planets)
  // const planet = planetsCollection.findOne({
  //   keplerName: launch.target,
  // });
  // if (!planet) {
  //   throw new Error("Target Planet is Invalid");
  // }
  // save on the database
  // check launch exist in the database before saving
  // avoid the duplicate loading of launch object

  launch.flightNumber = (await getLatestFlightNumber()) + 1;
  //use findandupdate operation  on launchesCollection to avoid unnessary properties that mongodb crearte by default
  // and to avoid duplicate loading of launch object

  await launchesCollection.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
  return launch;
}
// function checkLaunchExist(id) {
//   let launches = getAllLaunches();
//   return launches.includes((launch) => {
//     launch.flightNumber === id;
//   });
// }
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
    // const data = Array.from(launches.values());
    //get all launches from the database
    const launches = await launchesCollection.find({}, { _id: 0, __v: 0 });

    // const launches = await launchesCollection.find();
    return launches;
    // return data;
  } catch (err) {
    return err;
  }
}
// function addLaunch(launch) {
//   if (checkLaunchExist(launch.flightNumber)) {
//     throw new Error("Launch already exists");
//   }
//   latestFlightNumber = latestFlightNumber + 1;
//   launch.flightNumber = latestFlightNumber;
//   launch.upcomming = true;
//   launch.success = true;
//   launch.launchDate = new Date(launch.launchDate);
//   launches.set(latestFlightNumber, launch);

//   return launch;
// }
async function scheduleLaunch(launch) {
  //check whether the target is valid ( among the habitable planets)
  const planet = await planetsCollection.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("Target Planet is Invalid");
  }
  //add the remaining constant launches properties
  launch.upcomming = true;
  launch.success = true;
  launch.customers = ["ZTM", "NASA"];
  launch.launchDate = new Date(launch.launchDate);

  //save on the database
  return await saveLaunch(launch);
}
async function abortLaunch(flightNumber) {
  // const launch = launches.get(flightNumber);
  try {
    await launchesCollection.updateOne(
      { flightNumber: flightNumber },
      { upcomming: false, success: false }
    );
  } catch (err) {
    throw new Error("failed to abort the launch");
  }

  // launch.upcomming = false;
  // launch.success = false;
  // launches.set(flightNumber, launch);
  return await launchesCollection.findOne({}, { flightNumber: flightNumber });
}
module.exports = {
  getAllLaunches,
  scheduleLaunch,
  abortLaunch,
};
