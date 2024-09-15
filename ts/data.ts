/* exported data */

let data = {
  view: 'teams',
};

let favorites: string[] = readFavorites();

let pendingDeletion: string = '';

let selectedSeason = '20242025';

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
    $jerseyCell.textContent = nhlteamRoster[i].jersey;

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
    $gameidCell.textContent = nhlteamSchedule[i].gameid;

    const $awayTeamCell = $row.insertCell();
    const $awayteamimage = document.createElement('img');
    $awayteamimage.src = nhlteamSchedule[i].awayteamlogo;
    $awayTeamCell.appendChild($awayteamimage);

    const $homeTeamCell = $row.insertCell();
    const $hometeamimage = document.createElement('img');
    $hometeamimage.src = nhlteamSchedule[i].hometeamlogo;
    $homeTeamCell.appendChild($hometeamimage);

    const $dateCell = $row.insertCell();
    $dateCell.textContent = nhlteamSchedule[i].starttime;

    const $scoreCell = $row.insertCell();
    $scoreCell.textContent =
      nhlteamSchedule[i].awayteamscore + '-' + nhlteamSchedule[i].hometeamscore;

    const $venueCell = $row.insertCell();
    $venueCell.textContent = nhlteamSchedule[i].venuename;

    const $linkCell = $row.insertCell();
  }

  const $scheduleHeader = document.querySelector('.schedule-section');
  if (!$scheduleHeader) throw new Error('The $scheduleHeader query failed');

  $scheduleHeader.textContent =
    'Full Season Schedule (' +
    selectedSeason.slice(0, 4) +
    ' - ' +
    selectedSeason.slice(4, 8) +
    ')';
}

// function to swap views between schedule, teams, roster, and statistics
function viewSwap(viewName: string) {
  const $teams = document.querySelector("div[data-view='teams']");
  const $roster = document.querySelector("div[data-view='roster']");
  const $schedule = document.querySelector("div[data-view='schedule']");

  if (!$teams) throw new Error('$teams is null');
  if (!$roster) throw new Error('$roster is null');
  if (!$schedule) throw new Error('$schedule is null');

  if (viewName === 'teams') {
    $roster.setAttribute('class', 'hidden');
    $schedule.setAttribute('class', 'hidden');
    $teams.setAttribute('class', '');
    data.view = 'teams';
    localStorage.setItem('data-view', data.view);
  } else if (viewName === 'roster') {
    $teams.setAttribute('class', 'hidden');
    $schedule.setAttribute('class', 'hidden');
    $roster.setAttribute('class', '');
    data.view = 'roster';
    localStorage.setItem('data-view', data.view);
  } else if (viewName === 'schedule') {
    $teams.setAttribute('class', 'hidden');
    $roster.setAttribute('class', 'hidden');
    $schedule.setAttribute('class', '');
    data.view = 'schedule';
    localStorage.setItem('data-view', data.view);
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
}
