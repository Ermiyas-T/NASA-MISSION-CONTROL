const Launch = require("./launches.mongo");
const axios = require("axios"); // FIX: Use standard axios unless you have a custom config
const getPagination = require("../../utils/paginate");
loadLaunchesFromAPI();
//TODO: load launches from SpaceX api
async function loadLaunchesFromAPI() {
  const launches = Launch.find({});
  if (!launches.length) {
    // await Launch.deleteMany({});
    try {
      // FIX: Use full SpaceX API URL
      const { data } = await axios.post(
        "https://api.spacexdata.com/v4/launches/query",
        {
          query: {},
          options: {
            populate: [
              {
                path: "rocket",
                select: {
                  name: 1,
                },
              },
              {
                path: "payloads",
                select: {
                  customers: 1,
                },
              },
            ],
            pagination: false, // FIX: Ensure pagination is set to false
          },
        }
      );
      if (data) {
        // console.log(data["docs"][0]);
        const docs = data["docs"];
        for (const doc of docs) {
          const launch = {
            flightNumber: doc.flight_number,
            missionName: doc.name,
            rocketType: doc.rocket.name,
            launchDate: doc.date_local,
            target: "", // Not applicable, can be set to a default value
            customers: doc.payloads.flatMap((payload) => payload.customers),
            upcoming: doc.upcoming, // Assuming all fetched launches are upcoming
            success: doc.success,
          };
          await Launch.updateOne(
            { flightNumber: launch.flightNumber },
            launch,
            {
              upsert: true,
            }
          );
        }
      }
    } catch (err) {
      console.error("Error loading launches from API:", err);
    }
    const launches = await getAllLaunches();
    console.log(
      "successfully loaded ",
      launches.length,
      " launches data from API"
    );
  } else {
    console.log("Database is ready with loaded launches");
  }
}

// FIX: Make this function async and use 'some' instead of 'includes', and await getAllLaunches
async function checkLaunchExist(id) {
  const launch = await Launch.findOne({ flightNumber: id });
  if (launch) {
    return 1;
  } else {
    return 0;
  }
}
async function getLatestFlightNumber() {
  const latestLaunch = await Launch.findOne().sort({ flightNumber: -1 });
  const latestFlightNumber = latestLaunch ? latestLaunch.flightNumber : 0;
  return +latestFlightNumber;
}
async function getAllLaunches(query) {
  const { limit, skip } = getPagination(query);
  try {
    const launches = await Launch.find()
      .sort({ flightNumber: 1 })
      .limit(limit)
      .skip(skip);
    return launches;
  } catch (err) {
    console.error("Error getting launches:", err); // FIX: Log error
    throw new Error("Failed to get launches");
  }
}

async function addLaunch(launch) {
  if (await checkLaunchExist(launch.flightNumber)) {
    // FIX: Await checkLaunchExist
    throw new Error("Launch already exists");
  }
  const latestFlightNumber = await getLatestFlightNumber(); // FIX: Await getLatestFlightNumber
  launch.flightNumber = latestFlightNumber;
  launch.upcoming = true; // FIX: Typo 'upcomming' -> 'upcoming'
  launch.success = true;
  launch.launchDate = new Date(launch.launchDate);
  await Launch.updateOne({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
  });
  return launch;
}

async function abortLaunch(flightNumber) {
  const launch = await Launch.findOne({ flightNumber }); // FIX: Use Launch.findOne and await
  if (launch) {
    await Launch.updateOne(
      { flightNumber: launch.flightNumber },
      { upcoming: false, success: false }
    );
    return launch.flightNumber;
  } else {
    throw new Error("Not found"); // FIX: Throw error for not found
  }
}

module.exports = {
  getAllLaunches,
  addLaunch,
  abortLaunch,
  checkLaunchExist,
};
