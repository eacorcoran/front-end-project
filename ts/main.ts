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
  gamedate: string;
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

interface TeamLookup {
  fullname: string;
  abbrev: string;
}

interface Statistics {
  gamedate: string;
  gameid: string;
  awayteamcode: string;
  awayteamlogo: string;
  awayteamscore: number;
  hometeamcode: string;
  hometeamlogo: string;
  hometeamscore: number;
  venuename: string;
  awayteamSOG: number;
  hometeamSOG: number;
  awayteamFaceOff: number;
  hometeamFaceOff: number;
  awayteamPP: string;
  hometeamPP: string;
  awayteamPIM: number;
  hometeamPIM: number;
  awayteamHits: number;
  hometeamHits: number;
  awayteamBlocked: number;
  hometeamBlocked: number;
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

//Get statistics from API
async function fetchStatistics(gameid: string) {
  const gameidStats = gameid;
  const URLSchedule = `https://api-web.nhle.com/v1/gamecenter/${gameidStats}/boxscore`;

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

    const arrayStatistics = await responseSchedule.json();

    return arrayStatistics;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Initialize the teams list on page load
document.addEventListener('DOMContentLoaded', () => {
  const selectedseason = readSeason();
  const currentview = readDataView();
  const stisticsGameId = readStatisticsGameId();
  const schedulefullname = getFullName(scheduleteam);
  populateTeamsDropdown(scheduleteam);
  updateSchedule(schedulefullname, scheduleteam, selectedseason);
  updateTeams();
  const rosterFullName = getFullName(rosterteam);
  updateRoster(rosterFullName, rosterteam, selectedseason);
  updateStatistics(stisticsGameId);

  // Get reference to the season dropdown
  const selectElement = document.getElementById(
    'scheduleSeason',
  ) as HTMLSelectElement;
  const displayElement = document.getElementById(
    'selectedSeason',
  ) as HTMLParagraphElement;

  const handleSelectChange = () => {
    selectedSeason = selectElement.value;
    writeSeason(selectedSeason);
  };

  // Add event listener to the select element
  selectElement.addEventListener('change', handleSelectChange);

  viewSwap(currentview);
});

//Populates team data from the API and populates the team table
async function updateTeams() {
  const teams: Teams[] = await fetchTeams();
  const favorites: string[] = readFavorites();
  const favoriteTeams: Teams[] = [];
  const otherTeams: Teams[] = [];

  // Separate favorite teams from the rest
  for (let i = 0; i < favorites.length; i++) {
    for (let y = 0; y < teams.length; y++) {
      if (teams[y].triCode === favorites[i]) favoriteTeams.push(teams[y]);
    }
  }

  for (const team of teams) {
    if (nhlTeams.includes(team.triCode) && !favorites.includes(team.triCode)) {
      otherTeams.push(team);
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
  const sortedFaveTeamsByName = sortTeamsByProperty(favoriteTeams, 'fullName');
  const sortedOtherTeamsByName = sortTeamsByProperty(otherTeams, 'fullName');

  const sortTeamsByName = sortedFaveTeamsByName.concat(sortedOtherTeamsByName);

  updateDOMTeams(sortTeamsByName);
}

//Populate roster data from the API
async function updateRoster(
  fullteamname: string,
  abbreviation: string,
  season: string,
) {
  const roster = await fetchRoster(abbreviation, season);

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
      gamedate: schedulecount.gameDate,
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
  populateScheduleSeasonDropdown(selectedSeason);
  populateTeamsDropdown(abbreviation);
}

//Populate statistics data from the API
async function updateStatistics(gameid: string) {
  const gamestatistics = await fetchStatistics(gameid); // Wait for the promise to resolve

  const nhlgamestats: Statistics = {
    gamedate: gamestatistics.gameDate,
    gameid: gamestatistics.id,
    awayteamcode: gamestatistics.awayTeam.abbrev,
    awayteamlogo: gamestatistics.awayTeam.logo,
    awayteamscore: gamestatistics.awayTeam.score,
    hometeamcode: gamestatistics.homeTeam.abbrev,
    hometeamlogo: gamestatistics.homeTeam.logo,
    hometeamscore: gamestatistics.homeTeam.score,
    venuename: gamestatistics.venue.default,
    awayteamSOG: gamestatistics.awayTeam.sog,
    hometeamSOG: gamestatistics.homeTeam.sog,
    awayteamFaceOff: gamestatistics.summary.teamGameStats[1].awayValue,
    hometeamFaceOff: gamestatistics.summary.teamGameStats[1].homeValue,
    awayteamPP: gamestatistics.summary.teamGameStats[2].awayValue,
    hometeamPP: gamestatistics.summary.teamGameStats[2].homeValue,
    awayteamPIM: gamestatistics.summary.teamGameStats[4].awayValue,
    hometeamPIM: gamestatistics.summary.teamGameStats[4].homeValue,
    awayteamHits: gamestatistics.summary.teamGameStats[5].awayValue,
    hometeamHits: gamestatistics.summary.teamGameStats[5].homeValue,
    awayteamBlocked: gamestatistics.summary.teamGameStats[6].awayValue,
    hometeamBlocked: gamestatistics.summary.teamGameStats[6].homeValue,
  };

  updateDOMStatistics(nhlgamestats);
  writeStatisticsGameId(gameid);
}

//Add click event listener to close out the confirmation modal
const $cancelButton = document.querySelector('.remove-modal-cancel');
if (!$cancelButton) throw new Error('$cancelButton is not available');

$cancelButton.addEventListener('click', (event) => {
  const $dialog = document.querySelector('dialog');
  if (!$dialog) throw new Error('$dialog does not exist');

  pendingDeletion = '';

  $dialog.close();
});

//Add click event listener to remove team from favorites
const $confirmButton = document.querySelector('.remove-modal-confirm');
if (!$confirmButton) throw new Error('$confirmButton is not available');

$confirmButton.addEventListener('click', (event) => {
  const $dialog = document.querySelector('dialog');
  if (!$dialog) throw new Error('$dialog does not exist');

  //Remove team from favorites
  favorites = removeFavorites(pendingDeletion);

  //Update local storage
  writeFavorites();

  //Refresh the teams roster so that removed teams are no longer marked as a favorite
  updateTeams();

  $dialog.close();
});

// Add click event listener to the season and teams dropdown on the schedule page
const $scheduleDropdownSchedule = document.getElementById(
  'scheduleSeasonDropdown',
) as HTMLSelectElement;
if (!$scheduleDropdownSchedule)
  throw new Error('$scheduleDropdownSchedule is null');

const $teamDropdownSchedule = document.getElementById(
  'teamName',
) as HTMLSelectElement;
if (!$teamDropdownSchedule)
  throw new Error('$scheduleDropdownSchedule is null');

$scheduleDropdownSchedule.addEventListener('change', (event) => {
  event.preventDefault();
  const season = $scheduleDropdownSchedule.value;
  const abbreviation = $teamDropdownSchedule.value;
  const fullteamname = $teamDropdownSchedule.textContent ?? '';
  selectedSeason = season;
  writeSeason(selectedSeason);
  updateSchedule(fullteamname, abbreviation, season);
});

$teamDropdownSchedule.addEventListener('change', (event) => {
  event.preventDefault();
  const season = $scheduleDropdownSchedule.value;
  const abbreviation = $teamDropdownSchedule.value;
  const fullteamname = $teamDropdownSchedule.textContent ?? '';
  selectedSeason = season;
  scheduleteam = abbreviation;
  writeSeason(selectedSeason);
  writeScheduleTeam(abbreviation);
  updateSchedule(fullteamname, abbreviation, season);
});

// Add click event listener to the schedule link in the header
const $scheduleHeaderlink = document.querySelector('.schedule-header-link');
if (!$scheduleHeaderlink) throw new Error('$scheduleHeaderlink is null');

$scheduleHeaderlink.addEventListener('click', (event) => {
  event.preventDefault();
  let team: string = '';
  clearSchedule();
  if (readRoster() === '') {
    team = readScheduleTeam();
  } else if (!readRoster()) {
    team = readScheduleTeam();
  } else {
    team = readRoster();
  }
  writeScheduleTeam(team);
  populateTeamsDropdown(team);
  populateScheduleSeasonDropdown(selectedSeason);
  const schedulefullname = getFullName(team);
  updateSchedule(schedulefullname, team, selectedSeason);
  viewSwap('schedule');
  writeRoster('');
});

// Add click event listener to the team link in the header
const $teamHeaderlink = document.querySelector('.teams-header-link');
if (!$teamHeaderlink) throw new Error('$teamHeaderlink is null');

$teamHeaderlink.addEventListener('click', (event) => {
  event.preventDefault();
  populateSeasonDropdown(selectedSeason);
  updateTeams();
  writeRoster('');
  writeScheduleTeam('');
  viewSwap('teams');
});

// Add click event listener to the 'back-to-teams' link on the roster
const $backtoTeamslink = document.querySelector('.back-to-teams');
if (!$backtoTeamslink) throw new Error('$backtoTeamslink is null');

$backtoTeamslink.addEventListener('click', (event) => {
  event.preventDefault();
  populateSeasonDropdown(selectedSeason);
  updateTeams();
  writeRoster('');
  writeScheduleTeam('');
  viewSwap('teams');
});

// Add click event listener to the 'back-to-teams' link on the schedule
const $backtoTeamsSchedulelink = document.querySelector(
  '.back-to-teams-schedule',
);
if (!$backtoTeamsSchedulelink)
  throw new Error('$backtoTeamsSchedulelink is null');

$backtoTeamsSchedulelink.addEventListener('click', (event) => {
  event.preventDefault();
  populateSeasonDropdown(selectedSeason);
  updateTeams();
  writeRoster('');
  writeScheduleTeam('');
  viewSwap('teams');
});

// Add click event listener to the 'back-to-schedule' link on the statistics page
const $backtoSchedulelink = document.querySelector('.back-to-schedule');
if (!$backtoSchedulelink) throw new Error('$backtoSchedulelink is null');

$backtoSchedulelink.addEventListener('click', (event) => {
  event.preventDefault();
  let team: string = '';
  clearSchedule();
  if (readRoster() === '') {
    team = readScheduleTeam();
  } else if (!readRoster()) {
    team = readScheduleTeam();
  } else {
    team = readRoster();
  }
  writeScheduleTeam(team);
  populateTeamsDropdown(team);
  populateScheduleSeasonDropdown(selectedSeason);
  const schedulefullname = getFullName(team);
  updateSchedule(schedulefullname, team, selectedSeason);
  viewSwap('schedule');
  writeRoster('');
});
