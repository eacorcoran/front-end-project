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
    const $table = document.querySelector('table');
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
        $rosterCell.appendChild($rosterLink);
        const $scheduleCell = $row.insertCell();
        const $scheduleLink = document.createElement('a');
        $scheduleLink.href = '#';
        $scheduleLink.textContent = 'Schedule';
        $scheduleCell.appendChild($scheduleLink);
        const $actionsCell = $row.insertCell();
        const $faveButton = document.createElement('a');
        $faveButton.href = '#';
        $faveButton.className = 'fa-regular fa-star';
        $actionsCell.appendChild($faveButton);
    });
}
