"use strict";
/* exported data */
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
            const abbreviation = $abbreviationCell.textContent;
            console.log('Abbreviation:', abbreviation);
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
    $rosterHeader.textContent = nhlteamRoster[0].fullteamname + ' Roster (' +
        nhlteamRoster[0].season.slice(0, 4) +
        '-' +
        nhlteamRoster[0].season.slice(4)
        + ")";
}
