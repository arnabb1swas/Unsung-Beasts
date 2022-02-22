import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";
import { exit } from "process";
import fs from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyC3tCnIkZNfSK43BAJ3PF_HpRsisrarQvU",
  authDomain: "unsung-beasts-ps.firebaseapp.com",
  databaseURL: "https://unsung-beasts-ps-default-rtdb.firebaseio.com",
  projectId: "unsung-beasts-ps",
  storageBucket: "unsung-beasts-ps.appspot.com",
  messagingSenderId: "637809097625",
  appId: "1:637809097625:web:8e138fcc0aff7089a33108",
  measurementId: "G-JM4TGY12LQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const uid = "e35332b3-7dac-458c-9e93-c60aa1f2e8d1"; //Enter Updating collection's UID

function UpdateTeam(uid, pos, team, rating, points, matches) {
  const teamData = {
    pos: pos,
    team: team,
    rating: rating,
    points: points,
    matches: matches,
  };

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates["/root/" + uid + "/" + pos] = teamData;

  return update(ref(db), updates);
}

function updateTime(uid, posforup, lastUpdated) {
  const timeData = {
    lastUpdated: lastUpdated,
  };

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates["/root/" + uid + "/" + posforup] = timeData;

  return update(ref(db), updates);
}

// Updating Data
fs.readFile("./data.json", "utf8", (err, data) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
  try {
    const teams = JSON.parse(data);
    var posforup =
      teams[Object.keys(teams)[Object.keys(teams).length - 2]].pos + 1;
    var lastUpdated =
      teams[Object.keys(teams)[Object.keys(teams).length - 1]].lastUpdated;

    for (var key in teams) {
      if (key == posforup - 1) {
        exit;
      } else {
        UpdateTeam(
          uid,
          teams[key].pos,
          teams[key].team,
          teams[key].rating,
          teams[key].points,
          teams[key].matches
        );
      }
    }

    updateTime(uid, posforup, lastUpdated);
  } catch (err) {
    console.log("RF Error", err);
  }
  console.log("Data Updated Sucessfully");
});
