interface Teams {
  id: number;
  franchiseId: number;
  fullName: string;
  leagueId: number;
  rawTricode: string;
  triCode: string;
}

interface FavoriteTeams {
  id: number;
  fullName: string;
  triCode: string;
}

interface Roster {
  fullteamname: string;
  team: string;
  season: string;
  image: string;
  jersey: string;
  fullname: string;
  position: string;
  hometown: string;
}

interface Schedule {
  season: string;
  gameid: string;
  awayteamcode: string;
  awayteamlogo: string;
  awayteamscore: number;
  hometeamcode: string;
  hometeamlogo: string;
  hometeamscore: number;
  venuename: string;
  venuetime: string;
  starttime: string;
}

//Get teams from API
var targetUrlTeams = encodeURIComponent(
  'https://api.nhle.com/stats/rest/en/team',
);

async function fetchTeams() {
  try {
    const responseTeams = await fetch(
      'https://cors.learningfuze.com?url=' + targetUrlTeams,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      },
    );

    if (!responseTeams.ok) {
      throw new Error(`HTTP error! Status: ${responseTeams.status}`);
    }

    const arrayTeams = await responseTeams.json();

    return arrayTeams.data;
  } catch (error) {
    console.error('Error:', error);
  }
}

//Get roster from API
async function fetchRoster(abbreviation: string, season: string) {
  const teamRoster = abbreviation;
  const teamSeason = season;
  const URLRoster = `https://api-web.nhle.com/v1/roster/${teamRoster}/${teamSeason}`;

  var targetUrlRosters = encodeURIComponent(URLRoster);

  try {
    const responseRoster = await fetch(
      'https://cors.learningfuze.com?url=' + targetUrlRosters,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      },
    );

    if (!responseRoster.ok) {
      throw new Error(`HTTP error! Status: ${responseRoster.status}`);
    }

    const arrayRoster = await responseRoster.json();

    return arrayRoster;
  } catch (error) {
    console.error('Error:', error);
  }
}

//Get schedule from API
async function fetchSchedule(abbreviation: string, season: string) {
  const teamRoster = abbreviation;
  const teamSeason = season;
  const URLSchedule = `https://api-web.nhle.com/v1/club-schedule-season/${teamRoster}/${teamSeason}`;

  var targetUrlSchedule = encodeURIComponent(URLSchedule);

  try {
    const responseSchedule = await fetch(
      'https://cors.learningfuze.com?url=' + targetUrlSchedule,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      },
    );

    if (!responseSchedule.ok) {
      throw new Error(`HTTP error! Status: ${responseSchedule.status}`);
    }

    const arraySchedule = await responseSchedule.json();

    return arraySchedule;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Initialize the list on page load
document.addEventListener('DOMContentLoaded', () => {
  updateTeams();
});

// // Initialize the list on page load
// document.addEventListener('DOMContentLoaded', () => {
//   updateRoster();
// });

//Populates team data from the API and populates the team table
async function updateTeams() {
  const teams: Teams[] = await fetchTeams(); // Wait for the promise to resolve
  const nhlteamlist: Teams[] = [];

  for (let i = 0; i < teams.length; i++) {
    for (let x = 0; x < nhlTeams.length; x++) {
      if (teams[i].triCode === nhlTeams[x]) {
        nhlteamlist.push(teams[i]);
      }
    }
  }

  // Function to sort array of team objects by a specified property
  function sortTeamsByProperty(arr: Teams[], property: keyof Teams): Teams[] {
    return arr.sort((a, b) => {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
      return 0;
    });
  }

  // Update the array with sorted entries by team name
  const sortedTeamsByName = sortTeamsByProperty(nhlteamlist, 'fullName');

  updateDOMTeams(sortedTeamsByName);
}

//Populate roster data from the API
async function updateRoster(
  fullteamname: string,
  abbreviation: string,
  season: string,
) {
  const roster = await fetchRoster(abbreviation, season); // Wait for the promise to resolve

  const nhlteamRoster: Roster[] = [];

  if (Array.isArray(roster.defensemen)) {
    for (let i = 0; i < roster.defensemen.length; i++) {
      const defenseman = roster.defensemen[i];

      const fullName =
        defenseman.lastName.default + ', ' + defenseman.firstName.default;

      nhlteamRoster.push({
        fullteamname: fullteamname,
        team: abbreviation,
        season: season,
        image: defenseman.headshot,
        jersey: defenseman.sweaterNumber,
        fullname: fullName,
        position: 'Defense',
        hometown: defenseman.birthCountry,
      });
    }
  } else {
    console.error('roster.defensemen is not an array');
  }

  if (Array.isArray(roster.forwards)) {
    for (let i = 0; i < roster.forwards.length; i++) {
      const forwards = roster.forwards[i];

      const fullName =
        forwards.lastName.default + ', ' + forwards.firstName.default;

      nhlteamRoster.push({
        fullteamname: fullteamname,
        team: abbreviation,
        season: season,
        image: forwards.headshot,
        jersey: forwards.sweaterNumber,
        fullname: fullName,
        position: 'Forward',
        hometown: forwards.birthCountry,
      });
    }
  } else {
    console.error('roster.defensemen is not an array');
  }

  if (Array.isArray(roster.goalies)) {
    for (let i = 0; i < roster.goalies.length; i++) {
      const goalies = roster.goalies[i];

      const fullName =
        goalies.lastName.default + ', ' + goalies.firstName.default;

      nhlteamRoster.push({
        fullteamname: fullteamname,
        team: abbreviation,
        season: season,
        image: goalies.headshot,
        jersey: goalies.sweaterNumber,
        fullname: fullName,
        position: 'Goalie',
        hometown: goalies.birthCountry,
      });
    }
  } else {
    console.error('roster.defensemen is not an array');
  }

  updateDOMRoster(nhlteamRoster);
}

//Populate schedule data from the API
async function updateSchedule(
  fullteamname: string,
  abbreviation: string,
  season: string,
) {
  const schedule = await fetchSchedule(abbreviation, season); // Wait for the promise to resolve

  const nhlteamSchedule: Schedule[] = [];

  for (let i = 0; i < schedule.games.length; i++) {
    const schedulecount = schedule.games[i];

    nhlteamSchedule.push({
      season: schedulecount.season,
      gameid: schedulecount.id,
      awayteamcode: schedulecount.awayTeam.abbrev,
      awayteamlogo: schedulecount.awayTeam.logo,
      awayteamscore: schedulecount.awayTeam.score,
      hometeamcode: schedulecount.homeTeam.abbrev,
      hometeamlogo: schedulecount.homeTeam.logo,
      hometeamscore: schedulecount.homeTeam.score,
      venuename: schedulecount.venue.default,
      venuetime: schedulecount.venueUTCOffset,
      starttime: schedulecount.startTimeUTC,
    });
  }

  updateDOMSchedule(nhlteamSchedule);
}

// Ensure the DOM is fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    // Get reference to the season dropdown
    const selectElement = document.getElementById('scheduleSeason') as HTMLSelectElement;
    const displayElement = document.getElementById('selectedSeason') as HTMLParagraphElement;

    const handleSelectChange = () => {
        selectedSeason = selectElement.value;
        console.log(selectedSeason);
    };

    // Add event listener to the select element
    selectElement.addEventListener(
      'change',
      handleSelectChange,
    );
});
