const puppeteer = require("puppeteer");
const writeFileSync = require("fs").writeFileSync;

function writeToJson(data) {
  writeFileSync("./data.json", JSON.stringify(data));
  writeFileSync("../q2/data.json", JSON.stringify(data));
}

(async () => {
  // Connection
  const URL = "https://www.icc-cricket.com/rankings/mens/team-rankings/odi";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded" });

  // Fetching Data
  const Data = await page.evaluate(() => {
    let teams = Array.from(document.querySelectorAll("tbody > tr")).map(
      (team) => [
        parseInt(team.querySelector("td:nth-child(1)").innerText),
        team.querySelector("td:nth-child(2)").innerText.trim(),
        parseInt(team.querySelector("td:nth-child(5)").innerText),
        parseInt(
          team.querySelector("td:nth-child(4)").innerText.replace(",", "")
        ),
        parseInt(team.querySelector("td:nth-child(3)").innerText),
      ]
    );
    return teams;
  });

  const time = await page.evaluate(() => {
    return Array(
      document.querySelector(
        "div.rankings-block__meta-container > div:nth-child(1)"
      ).innerText
    );
  });

  let newData = [];
  let lastUpdated = {};
  lastUpdated["lastUpdated"] = time.toString();

  Data.forEach((team) => {
    let temp = {};
    temp["pos"] = team[0];
    temp["team"] = team[1];
    temp["rating"] = team[2];
    temp["points"] = team[3];
    temp["matches"] = team[4];
    newData.push(temp);
  });
  newData.push(lastUpdated);

  //console.log(newData);
  writeToJson(newData);

  //closing the opend browser
  await browser.close();
})();
