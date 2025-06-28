const launches = new Map();
let latestFlightNumber = 100;
const launch = {
  flightNumber: 100,
  missionName: "ZTM KepLaunch100",
  rocketType: "Explorer ISI",
  launchDate: "June 30, 2025",
  target: "Kepler - 1652",
  customers: ["ET", "NASA"],
  success: true,
  upcomming: true,
};
launches.set(launch.flightNumber, launch);
function checkLaunchExist(id) {
  let launches = getAllLaunches();
  return launches.includes((launch) => {
    launch.flightNumber === id;
  });
}
function getAllLaunches() {
  try {
    const data = Array.from(launches.values());
    return data;
  } catch (err) {
    return err;
  }
}
function addLaunch(launch) {
  if (checkLaunchExist(launch.flightNumber)) {
    throw new Error("Launch already exists");
  }
  latestFlightNumber = latestFlightNumber + 1;
  launch.flightNumber = latestFlightNumber;
  launch.upcomming = true;
  launch.success = true;
  launch.launchDate = new Date(launch.launchDate);
  launches.set(latestFlightNumber, launch);

  return launch;
}
function abortLaunch(flightNumber) {
  const launch = launches.get(flightNumber);
  if (!launch) {
    throw new Error("Launch not found");
  }
  launch.upcomming = false;
  launch.success = false;
  launches.set(flightNumber, launch);
  return launch;
}
module.exports = {
  getAllLaunches,
  addLaunch,
  abortLaunch,
};
