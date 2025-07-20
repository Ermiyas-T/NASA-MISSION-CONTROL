const API = "http://localhost:5000";
async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const response = await fetch(`${API}/planets`);
  if (!response.ok) {
    throw new Error("Failed to fetch planets");
  }
  return await response.json();
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${API}/launches/?page=3&limit=50`);
  if (!response.ok) {
    throw new Error("Failed to fetch launches");
  }
  // let fetchedLaunches = await response.json();
  // fetchedLaunches = fetchedLaunches.sort(
  //   (a, b) => a.flightNumber - b.flightNumber
  // );
  const data = await response.json();
  return data.launches;
}

async function httpSubmitLaunch(launch) {
  // the response object from api has two attributes
  const response = await fetch(`${API}/launches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(launch),
  });
  if (!response.ok) {
    throw new Error("--Failed to submit launch");
  }
  return await response?.json();
}
async function httpAbortLaunch(id) {
  //TODO: Once API is ready.
  // Delete launch with given ID.
  const response = await fetch(`${API}/launches/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to abort launch");
  }
  return await response.json();
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
