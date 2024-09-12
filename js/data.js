"use strict";
/* exported data */
let data = {
    view: 'teams',
};
//List of current NHL teams used to filter out old teams from the data returned from the API
const nhlTeams = [
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
// Function to update the DOM with team data
function updateDOMTeams(teams) {
    const $table = document.querySelector('.teams-table');
    if (!$table)
        throw new Error('The $table query failed');
    // Find the tbody element within the table
    const $tbody = $table.querySelector('tbody');
    if (!$tbody)
        throw new Error('The tbody query failed');
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
            updateRoster(fullteamname, abbreviation, '20232024');
            viewSwap("roster");
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
            updateSchedule(fullteamname, abbreviation, '20232024');
            viewSwap('schedule');
        });
        $scheduleCell.appendChild($scheduleLink);
        const $actionsCell = $row.insertCell();
        const $faveButton = document.createElement('a');
        $faveButton.href = '#';
        $faveButton.className = 'fa-regular fa-star';
        $actionsCell.appendChild($faveButton);
    });
}
// Function to update the DOM with roster data
function updateDOMRoster(nhlteamRoster) {
    const $table = document.querySelector('.roster-table');
    if (!$table)
        throw new Error('The $table query failed');
    // Find the tbody element within the table
    const $tbody = $table.querySelector('tbody');
    if (!$tbody)
        throw new Error('The tbody query failed');
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
    if (!$rosterHeader)
        throw new Error('The $rosterHeader query failed');
    $rosterHeader.textContent =
        nhlteamRoster[0].fullteamname +
            ' Roster (' +
            nhlteamRoster[0].season.slice(0, 4) +
            '-' +
            nhlteamRoster[0].season.slice(4) +
            ')';
}
// Function to update the DOM with roster data
function updateDOMSchedule(nhlteamSchedule) {
    const $table = document.querySelector('.schedule-table');
    if (!$table)
        throw new Error('The $table query failed');
    // Find the tbody element within the table
    const $tbody = $table.querySelector('tbody');
    if (!$tbody)
        throw new Error('The tbody query failed');
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
    if (!$scheduleHeader)
        throw new Error('The $scheduleHeader query failed');
    $scheduleHeader.textContent =
        'Full Season Schedule (' + nhlteamSchedule[0].season + ')';
}
/* function to swap views between schedule, teams, roster, and statistics */
function viewSwap(viewName) {
    const $teams = document.querySelector("div[data-view='teams']");
    const $roster = document.querySelector("div[data-view='roster']");
    const $schedule = document.querySelector("div[data-view='schedule']");
    if (!$teams)
        throw new Error('$teams is null');
    if (!$roster)
        throw new Error('$roster is null');
    if (!$schedule)
        throw new Error('$schedule is null');
    if (viewName === 'teams') {
        $roster.setAttribute('class', 'hidden');
        $schedule.setAttribute('class', 'hidden');
        $teams.setAttribute('class', '');
        data.view = 'teams';
        localStorage.setItem('data-view', data.view);
    }
    else if (viewName === 'roster') {
        $teams.setAttribute('class', 'hidden');
        $schedule.setAttribute('class', 'hidden');
        $roster.setAttribute('class', '');
        data.view = 'roster';
        localStorage.setItem('data-view', data.view);
    }
    else if (viewName === 'schedule') {
        $teams.setAttribute('class', 'hidden');
        $roster.setAttribute('class', 'hidden');
        $schedule.setAttribute('class', '');
        data.view = 'schedule';
        localStorage.setItem('data-view', data.view);
    }
}
