/* exported data */

let data = {
  view: readDataView(),
};

let favorites: string[] = readFavorites();

let pendingDeletion: string = '';

let selectedSeason: string = readSeason();

let rosterteam: string = readRoster();

let scheduleteam: string = readScheduleTeam();

//List of current NHL teams used to filter out old teams from the data returned from the API
const nhlTeams: string[] = [
  'DET',
  'BOS',
  'PIT',
  'TBL',
  'PHI',
  'CGY',
  'WSH',
  'VAN',
  'COL',
  'NSH',
  'VGK',
  'DAL',
  'NYR',
  'FLA',
  'EDM',
  'MIN',
  'STL',
  'NYI',
  'LAK',
  'BUF',
  'OTT',
  'TOR',
  'NJD',
  'WPG',
  'SEA',
  'SJS',
  'UTA',
  'CBJ',
  'CHI',
  'ANA',
  'CAR',
  'MTL',
];

const nhlTeamFullName: TeamLookup[] = [
  { fullname: 'Anaheim Ducks', abbrev: 'ANA' },
  { fullname: 'Boston Bruins', abbrev: 'BOS' },
  { fullname: 'Buffalo Sabres', abbrev: 'BUF' },
  { fullname: 'Carolina Hurricanes', abbrev: 'CAR' },
  { fullname: 'Calgary Flames', abbrev: 'CGY' },
  { fullname: 'Chicago Blackhawks', abbrev: 'CHI' },
  { fullname: 'Colorado Avalanche', abbrev: 'COL' },
  { fullname: 'Columbus Blue Jackets', abbrev: 'CBJ' },
  { fullname: 'Dallas Stars', abbrev: 'DAL' },
  { fullname: 'Detroit Red Wings', abbrev: 'DET' },
  { fullname: 'Edmonton Oilers', abbrev: 'EDM' },
  { fullname: 'Florida Panthers', abbrev: 'FLA' },
  { fullname: 'Los Angeles Kings', abbrev: 'LAK' },
  { fullname: 'Minnesota Wild', abbrev: 'MIN' },
  { fullname: 'Montréal Canadiens', abbrev: 'MTL' },
  { fullname: 'Nashville Predators', abbrev: 'NSH' },
  { fullname: 'New Jersey Devils', abbrev: 'NJD' },
  { fullname: 'New York Islanders', abbrev: 'NYI' },
  { fullname: 'New York Rangers', abbrev: 'NYR' },
  { fullname: 'Ottawa Senators', abbrev: 'OTT' },
  { fullname: 'Philadelphia Flyers', abbrev: 'PHI' },
  { fullname: 'Pittsburgh Penguins', abbrev: 'PIT' },
  { fullname: 'San Jose Sharks', abbrev: 'SJS' },
  { fullname: 'Seattle Kraken', abbrev: 'SEA' },
  { fullname: 'St. Louis Blues', abbrev: 'STL' },
  { fullname: 'Tampa Bay Lightning', abbrev: 'TBL' },
  { fullname: 'Toronto Maple Leafs', abbrev: 'TOR' },
  { fullname: 'Utah Hockey Club', abbrev: 'UTA' },
  { fullname: 'Vancouver Canucks', abbrev: 'VAN' },
  { fullname: 'Vegas Golden Knights', abbrev: 'VGK' },
  { fullname: 'Washington Capitals', abbrev: 'WSH' },
  { fullname: 'Winnipeg Jets', abbrev: 'WPG' },
  { fullname: '', abbrev: '' },
];

// Function to update the DOM with team data
function updateDOMTeams(teams: Teams[]): void {
  const $table = document.querySelector('.teams-table');
  if (!$table) throw new Error('The $table query failed');

  // Find the tbody element within the table
  const $tbody = $table.querySelector('tbody');
  if (!$tbody) throw new Error('The tbody query failed');

  // Clear existing rows in the tbody
  while ($tbody.rows.length > 0) {
    $tbody.deleteRow(0);
  }

  // Add new rows based on the teams data
  teams.forEach((team) => {
    // Create a new row
    const $row = $tbody.insertRow();

    // Create cells for each row
    const $teamNameCell = $row.insertCell();
    $teamNameCell.textContent = team.fullName;

    const $abbreviationCell = $row.insertCell();
    $abbreviationCell.textContent = team.triCode;

    const $rosterCell = $row.insertCell();
    const $rosterLink = document.createElement('a');
    $rosterLink.href = '#';
    $rosterLink.textContent = 'Roster';
    $rosterLink.className = 'roster-link';

    // Add click event listener to the roster link
    $rosterLink.addEventListener('click', (event) => {
      event.preventDefault();
      const abbreviation = $abbreviationCell.textContent ?? '';
      const fullteamname = $teamNameCell.textContent ?? '';
      updateRoster(fullteamname, abbreviation, selectedSeason);
      writeRoster(abbreviation);
      viewSwap('roster');
    });

    $rosterCell.appendChild($rosterLink);

    const $scheduleCell = $row.insertCell();
    const $scheduleLink = document.createElement('a');
    $scheduleLink.href = '#';
    $scheduleLink.textContent = 'Schedule';
    $scheduleLink.className = 'schedule-link';

    // Add click event listener to the schedule link
    $scheduleLink.addEventListener('click', (event) => {
      event.preventDefault();
      const abbreviation = $abbreviationCell.textContent ?? '';
      const fullteamname = $teamNameCell.textContent ?? '';
      scheduleteam = abbreviation;
      writeScheduleTeam(abbreviation);
      updateSchedule(fullteamname, abbreviation, selectedSeason);
      populateScheduleSeasonDropdown(selectedSeason);
      populateTeamsDropdown(abbreviation);
      viewSwap('schedule');
    });

    $scheduleCell.appendChild($scheduleLink);

    const $actionsCell = $row.insertCell();
    const $faveButton = document.createElement('a');
    $faveButton.href = '#';
    $faveButton.className = 'fa-regular fa-star';

    // Add click event listener to the favorite button
    $faveButton.addEventListener('click', (event) => {
      event.preventDefault();
      const abbreviation = $abbreviationCell.textContent ?? '';
      if ($faveButton.className === 'fa-regular fa-star') {
        $faveButton.className = 'fa-solid fa-star';
        addfavorites(abbreviation);
        updateTeams();
      } else {
        showconfirmation(abbreviation);
        pendingdelete(abbreviation);
      }
    });

    $actionsCell.appendChild($faveButton);
  });

  updateFavoriteIcons();
}

// Function to update the DOM with roster data
function updateDOMRoster(nhlteamRoster: Roster[]): void {
  const $table = document.querySelector('.roster-table');
  if (!$table) throw new Error('The $table query failed');

  // Find the tbody element within the table
  const $tbody = $table.querySelector('tbody');
  if (!$tbody) throw new Error('The tbody query failed');

  // Clear existing rows in the tbody
  while ($tbody.rows.length > 0) {
    $tbody.deleteRow(0);
  }

  // Add new rows based on the teams data
  for (let i = 0; i < nhlteamRoster.length; i++) {
    // Create a new row
    const $row = $tbody.insertRow();

    // Create cells for each row
    const $seasonCell = $row.insertCell();
    $seasonCell.textContent =
      nhlteamRoster[i].season.slice(0, 4) +
      '-' +
      nhlteamRoster[i].season.slice(4);

    const $teamCell = $row.insertCell();
    $teamCell.textContent = nhlteamRoster[i].team;

    const $playerimageCell = $row.insertCell();
    const $playerimage = document.createElement('img');
    $playerimage.src = nhlteamRoster[i].image;
    $playerimageCell.appendChild($playerimage);

    const $jerseyCell = $row.insertCell();
    $jerseyCell.textContent = '#' + nhlteamRoster[i].jersey;

    const $fullNameCell = $row.insertCell();
    $fullNameCell.textContent = nhlteamRoster[i].fullname;

    const $positionCell = $row.insertCell();
    $positionCell.textContent = nhlteamRoster[i].position;

    const $hometownCell = $row.insertCell();
    $hometownCell.textContent = nhlteamRoster[i].hometown;
  }

  const $rosterHeader = document.querySelector('.roster-section');
  if (!$rosterHeader) throw new Error('The $rosterHeader query failed');

  $rosterHeader.textContent =
    nhlteamRoster[0].fullteamname +
    ' Roster (' +
    nhlteamRoster[0].season.slice(0, 4) +
    '-' +
    nhlteamRoster[0].season.slice(4) +
    ')';
}

// Function to update the DOM with roster data
function updateDOMSchedule(nhlteamSchedule: Schedule[]): void {
  const $table = document.querySelector('.schedule-table');
  if (!$table) throw new Error('The $table query failed');

  // Find the tbody element within the table
  const $tbody = $table.querySelector('tbody');
  if (!$tbody) throw new Error('The tbody query failed');

  // Clear existing rows in the tbody
  while ($tbody.rows.length > 0) {
    $tbody.deleteRow(0);
  }

  // Add new rows based on the teams data
  for (let i = 0; i < nhlteamSchedule.length; i++) {
    // Create a new row
    const $row = $tbody.insertRow();

    // Create cells for each row
    const $gameidCell = $row.insertCell();
    $gameidCell.textContent = (i + 1).toString();

    const $awayTeamCell = $row.insertCell();
    $awayTeamCell.innerHTML = getFullName(nhlteamSchedule[i].awayteamcode)+'<br>';
    const $awayteamimage = document.createElement('img');
    $awayteamimage.src = nhlteamSchedule[i].awayteamlogo;
    $awayTeamCell.appendChild($awayteamimage);

    const $homeTeamCell = $row.insertCell();
    $homeTeamCell.innerHTML =
      '@ ' + getFullName(nhlteamSchedule[i].hometeamcode) + '<br>';
    const $hometeamimage = document.createElement('img');
    $hometeamimage.src = nhlteamSchedule[i].hometeamlogo;
    $homeTeamCell.appendChild($hometeamimage);

    const formatdate: string =
      nhlteamSchedule[i].gamedate.slice(5, 7) +
      '/' +
      nhlteamSchedule[i].gamedate.slice(8, 10) +
      '/' +
      nhlteamSchedule[i].gamedate.slice(0, 4);

    const offsetVenue = Number(nhlteamSchedule[i].venuetime.slice(0, 3));
    const utchours = Number(nhlteamSchedule[i].starttime.slice(11, 13));

    let localhours = '';

    if (utchours + offsetVenue > 0) {
      localhours = (utchours + offsetVenue - 12).toString();
    } else {
      localhours = (utchours + 24 + offsetVenue - 12).toString();
    }

    const $dateCell = $row.insertCell();
    $dateCell.innerHTML =
      formatdate +
      ' <br>' +
      localhours +
      ':' +
      nhlteamSchedule[i].starttime.slice(14, 16) +
      ' PM';

    let score = '';

    if (nhlteamSchedule[i].awayteamscore > nhlteamSchedule[i].hometeamscore) {
      score =
        nhlteamSchedule[i].awayteamcode +
        ' (W): ' +
        nhlteamSchedule[i].awayteamscore +
        '<br><br>' +
        nhlteamSchedule[i].hometeamcode +
        ' (L): ' +
        nhlteamSchedule[i].hometeamscore;
    } else if (
      nhlteamSchedule[i].awayteamscore < nhlteamSchedule[i].hometeamscore
    ) {
      score =
        nhlteamSchedule[i].awayteamcode +
        ' (L): ' +
        nhlteamSchedule[i].awayteamscore +
        '<br><br>' +
        nhlteamSchedule[i].hometeamcode +
        ' (W): ' +
        nhlteamSchedule[i].hometeamscore;
    } else if (
      nhlteamSchedule[i].awayteamscore === nhlteamSchedule[i].hometeamscore &&
      nhlteamSchedule[i].awayteamscore > 0
    ) {
      score =
        nhlteamSchedule[i].awayteamcode +
        ' (Tie): ' +
        nhlteamSchedule[i].awayteamscore +
        '<br><br>' +
        nhlteamSchedule[i].hometeamcode +
        ' (Tie): ' +
        nhlteamSchedule[i].hometeamscore;
    }

    const $scoreCell = $row.insertCell();
    $scoreCell.innerHTML = score;

    const $venueCell = $row.insertCell();
    $venueCell.textContent = nhlteamSchedule[i].venuename;

    const $keyStatsCell = $row.insertCell();
    const $keyStatsLink = document.createElement('a');
    $keyStatsLink.href = '#';
    $keyStatsLink.textContent = 'Key Statistics';
    $keyStatsLink.className = 'key-stats-link';
    $keyStatsCell.appendChild($keyStatsLink);
  }
}

// function to swap views between schedule, teams, roster, and statistics
function viewSwap(viewName: string) {
  const $teams = document.querySelector("div[data-view='teams']");
  const $roster = document.querySelector("div[data-view='roster']");
  const $schedule = document.querySelector("div[data-view='schedule']");

  const $scheduleNoUnderline = document.querySelector('.header-links-schedule');
  const $scheduleUnderline = document.querySelector(
    '.header-links-schedule-underlined',
  );

  const $teamNoUnderline = document.querySelector('.header-links-team');
  const $teamUnderline = document.querySelector(
    '.header-links-team-underlined',
  );

  if (!$teams) throw new Error('$teams is null');
  if (!$roster) throw new Error('$roster is null');
  if (!$schedule) throw new Error('$schedule is null');

  if (viewName === 'teams') {
    $roster.setAttribute('class', 'hidden');
    $schedule.setAttribute('class', 'hidden');
    $teams.setAttribute('class', '');
    data.view = 'teams';
    localStorage.setItem('data-view', data.view);
    $scheduleUnderline?.setAttribute('class', 'header-links-schedule');
    $teamNoUnderline?.setAttribute('class', 'header-links-team-underlined');
  } else if (viewName === 'roster') {
    $teams.setAttribute('class', 'hidden');
    $schedule.setAttribute('class', 'hidden');
    $roster.setAttribute('class', '');
    data.view = 'roster';
    localStorage.setItem('data-view', data.view);
    $teamUnderline?.setAttribute('class', 'header-links-team');
    $scheduleUnderline?.setAttribute('class', 'header-links-schedule');
  } else if (viewName === 'schedule') {
    $teams.setAttribute('class', 'hidden');
    $roster.setAttribute('class', 'hidden');
    $schedule.setAttribute('class', '');
    data.view = 'schedule';
    localStorage.setItem('data-view', data.view);
    $scheduleNoUnderline?.setAttribute(
      'class',
      'header-links-schedule-underlined',
    );
    $teamUnderline?.setAttribute('class', 'header-links-team');
  }
}

//show favorites modal confirmation
function showconfirmation(abbreviation: string) {
  const $dialog = document.querySelector('dialog');
  if (!$dialog) throw new Error('$dialog does not exist');

  $dialog.showModal();
}

//add team to favorites after clicking on the star
function addfavorites(abbreviation: string) {
  favorites.push(abbreviation);
  writeFavorites();
}

//write favorites to local storage so that they are retained on page refresh
function writeFavorites(): void {
  const favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem('favorites', favoritesJSON);
}

//read favorites from local storage so that they utilized after a page refresh
function readFavorites(): string[] {
  let newFavorites: string[] = [];
  const readJSON = localStorage.getItem('favorites');
  if (readJSON === null) {
    newFavorites = [];
  } else {
    newFavorites = JSON.parse(readJSON);
  }
  return newFavorites;
}

//Keep favorited teams with correct icon indicating them as favorite
function updateFavoriteIcons() {
  const favorites: string[] = readFavorites();

  // Ensure the tableBody is selected correctly
  const tableBody = document.querySelector(
    '.teams-table tbody',
  ) as HTMLTableSectionElement;

  // Check if tableBody exists
  if (!tableBody) {
    console.error('Table body not found.');
    return;
  }

  for (const row of tableBody.rows) {
    // Get the abbreviation cell
    const abbrevCell = row.cells[1];

    // Check if the cell's text content matches a favorite
    if (favorites.includes(abbrevCell.textContent?.trim() || '')) {
      // Get the favorite icon cell
      const favoriteCell = row.cells[4].children[0] as HTMLElement;

      if (favoriteCell) {
        // Update the favorite star to indicate it is a favorite
        favoriteCell.className = 'fa-solid fa-star';
      }
    }
  }
}

//Store team that is pending deletion from favorites
function pendingdelete(abbreviation: string) {
  pendingDeletion = abbreviation;
}

//Removed team from favorites
function removeFavorites(pendingDeletion: string) {
  const currentFavorites: string[] = readFavorites();

  for (let i = 0; i < currentFavorites.length; i++) {
    if (currentFavorites[i] === pendingDeletion) {
      currentFavorites.splice(i, 1);
    }
  }

  return currentFavorites;
}

//Populate team's dropdown on the schedules page with teams
function populateTeamsDropdown(teamabbrev: string) {
  const $teamdropdown = document.getElementById(
    'teamName',
  ) as HTMLSelectElement;
  if (!$teamdropdown) throw new Error('$teamdropdown is null');

  // Clear existing options from dropdown
  $teamdropdown.innerHTML = '';

  // Create and append options based on nhlTeamFullName list
  for (let i = 0; i < nhlTeamFullName.length; i++) {
    const optionElement = document.createElement('option');
    optionElement.value = nhlTeamFullName[i].abbrev;
    optionElement.textContent = nhlTeamFullName[i].fullname;
    $teamdropdown.appendChild(optionElement);
  }

  $teamdropdown.value = teamabbrev;
}

function populateScheduleSeasonDropdown(season: string) {
  const $seasonScheduledropdown = document.getElementById(
    'scheduleSeasonDropdown',
  ) as HTMLSelectElement;
  if (!$seasonScheduledropdown)
    throw new Error('$seasonScheduledropdown is null');

  $seasonScheduledropdown.value = season;
  selectedSeason = season;
  writeSeason(selectedSeason);
}

function populateSeasonDropdown(season: string) {
  const $SeasonDropdown = document.getElementById(
    'scheduleSeason',
  ) as HTMLSelectElement;
  if (!$SeasonDropdown) throw new Error('$SeasonDropdown is null');

  $SeasonDropdown.value = season;
}

//read data-view from local storage so that it is utilized after a page refresh
function readDataView(): string {
  let newdataview: string = '';
  const readJSON = localStorage.getItem('data-view');
  if (readJSON === null) {
    newdataview = 'teams';
  } else {
    newdataview = readJSON;
  }
  return newdataview;
}

//write season to local storage so that it can be used
function writeSeason(selectedSeason: string): void {
  localStorage.setItem('season', selectedSeason);
}

//read data-view from local storage so that it is utilized after a page refresh
function readSeason(): string {
  let newseason: string = '';
  const readJSON = localStorage.getItem('season');
  if (readJSON === null) {
    newseason = '20242025';
  } else {
    newseason = readJSON;
  }
  return newseason;
}

//write season to local storage so that it can be used
function writeRoster(abbrev: string): void {
  localStorage.setItem('roster-team', abbrev);
}

//read data-view from local storage so that it is utilized after a page refresh
function readRoster(): string {
  let roster: string = '';
  const readJSON = localStorage.getItem('roster-team');
  if (readJSON === null) {
    roster = '';
  } else {
    roster = readJSON;
  }
  return roster;
}

function getFullName(abbrev: string): string {
  let fullTeamName: string = '';
  for (let i = 0; i < nhlTeamFullName.length; i++) {
    if (nhlTeamFullName[i].abbrev === abbrev) {
      fullTeamName = nhlTeamFullName[i].fullname;
    }
  }
  return fullTeamName;
}

//write season to local storage so that it can be used
function writeScheduleTeam(abbrev: string): void {
  localStorage.setItem('schedule-team', abbrev);
}

//read data-view from local storage so that it is utilized after a page refresh
function readScheduleTeam(): string {
  let scheduleteam: string = '';
  const readJSON = localStorage.getItem('schedule-team');
  if (readJSON === null) {
    scheduleteam = '';
  } else {
    scheduleteam = readJSON;
  }
  return scheduleteam;
}

function clearSchedule() {
  const $table = document.querySelector('.schedule-table');
  if (!$table) throw new Error('The $table query failed');

  // Find the tbody element within the table
  const $tbody = $table.querySelector('tbody');
  if (!$tbody) throw new Error('The tbody query failed');

  // Clear existing rows in the tbody
  while ($tbody.rows.length > 0) {
    $tbody.deleteRow(0);
  }
}

//Convert UTC with offset
function convertUTCDateWithOffset(utcDate: Date, offsetHours: number): string {
  const utcTime = utcDate.getTime();
  const offsetMilliseconds = offsetHours * 60 * 60 * 1000;
  const venueTime = utcTime + offsetMilliseconds;
  const venuetimedate = new Date(venueTime);

  return venuetimedate.toLocaleString();
}
