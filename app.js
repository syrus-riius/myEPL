/* 
epl 일정 사이트 https://sports.daum.net/schedule/epl
epl 팀 정보 (토트넘 : 249): 
간략정보
https://sports.daum.net/prx/hermes/api/person/list.json?leagueCode=epl&teamId=249
디테일정보 
event, league, season, stat, statTeam, 
https://sports.daum.net/prx/hermes/api/person/list.json?leagueCode=epl&seasonKey=20212022&teamId=249&detail=true&pageSize=100

애스턴 빌라 (토트넘 아이디값 +1)
https://sports.daum.net/prx/hermes/api/person/list.json?leagueCode=epl&teamId=250


[[[epl 구단 뉴스 :

토트넘 // https://sports.daum.net/prx/styler/query/alias/19?page=0&id=196456&limit=8
애스턴빌라 // https://sports.daum.net/prx/styler/query/alias/19?page=0&id=196457&limit=8

// https://sports.daum.net/prx/styler/query/alias/19?page=0&id=196461&limit=8

뉴캐슬의 경우 예외가 있는데
teamID : 1321  / newsid = 196480
https://sports.daum.net/prx/styler/query/alias/19?page=0&id=196480&limit=8

*/

const DAUM_SCHEDULE =
  "https://sports.daum.net/prx/hermes/api/game/schedule.json?page=1&leagueCode=epl&seasonKey=20212022&fromDate=20211101&toDate=20211130";

const TEAM_INFO =
  "https://sports.daum.net/prx/hermes/api/person/list.json?leagueCode=epl&seasonKey=20212022&teamId=@teamId&detail=true&pageSize=100";

// "https://sports.daum.net/prx/hermes/api/person/list.json?leagueCode=epl&teamId=@teamId";
const ajax = new XMLHttpRequest();
const container = document.getElementById("root");

const store = {
  currentPage: 1,
};

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

const epljson = getData(DAUM_SCHEDULE);

let dateKeyArray = [];
const epl_schedule = epljson["schedule"];

const ul = document.createElement("ul");
console.log(epl_schedule);

function router() {
  const routePath = location.hash;
  if (routePath === "") {
    scheduleInfo();
  } else {
    teamInfo();
  }
}

function scheduleInfo() {
  for (let i in epl_schedule) {
    const li = document.createElement("li");
    let div = document.createElement("div");

    let games = epl_schedule[i];
    let dateValue = document.createElement("h2");
    dateValue.innerHTML = `<h4>${i}</h4>`;

    div.appendChild(dateValue);

    for (let x in games) {
      const subli = document.createElement("li");

      let dateTime = `${games[x].startTime.substr(0, 2)} : ${games[
        x
      ].startTime.substr(2, 2)}`;
      subli.innerHTML = `
      <li>${dateTime} ::: <a href ="#${games[x].homeTeamId}"> ${games[x].homeTeamName}</a> vs <a href ="#${games[x].awayTeamId}">${games[x].awayTeamName}</a></li>
      `;
      li.appendChild(subli);
    }
    ul.appendChild(div);
    ul.appendChild(li);
  }
}

console.log();

const content = document.createElement("div");

function teamInfo() {
  const id = location.hash.substr(1);

  const teamContent = getData(TEAM_INFO.replace("@teamId", id));
  console.log(teamContent);

  const squad = teamContent["list"];

  const playerList = [];
  playerList.push("<a href='/'> 목록으로</a>");
  playerList.push("<ul>");

  for (let i in squad) {
    let stats = "";
    console.log(squad[i].name, squad[i].stat);
    if (squad[i].stat != null) {
      stats = squad[i].stat.gfPerGame;
    }
    playerList.push(`
      <li>
      <img src="${squad[i].imageUrl}" width="150px">
      <h4>${squad[i].name} (${squad[i].nameEn}) No. ${squad[i].backNumber} </h4>
      
      <p>포지션 : ${squad[i].position.name} ${squad[i].position.nameKo}<p>
      <p>키 : ${squad[i].height} / 몸무게 : ${squad[i].weight} </p> 
      <p>Stats</p>
      <p>
        ${stats}
      </p>
      
      </li>
    `);
  }

  playerList.push("</ul>");

  container.innerHTML = playerList.join("");
}
window.addEventListener("hashchange", teamInfo);

container.appendChild(content);
container.appendChild(ul);

router();
