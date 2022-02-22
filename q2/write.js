import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
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

const uid = uuidv4();

// Writing Data into Database
function writeUserData(pos, team, rating, points, matches) {
  set(ref(db, `root/${uid}/` + pos), {
    pos: pos,
    team: team,
    rating: rating,
    points: points,
    matches: matches,
  });
}

function writetimeData(posforup, lastUpdated) {
  set(ref(db, `root/${uid}/` + posforup), {
    lastUpdated: lastUpdated,
  });
}

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
        writeUserData(
          teams[key].pos,
          teams[key].team,
          teams[key].rating,
          teams[key].points,
          teams[key].matches
        );
      }
    }

    writetimeData(posforup, lastUpdated);
  } catch (err) {
    console.log("RF Error", err);
  }
  console.log("Data Uploaded Sucessfully");
});
