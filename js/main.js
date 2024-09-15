"use strict";
//Get teams from API
var targetUrlTeams = encodeURIComponent('https://api.nhle.com/stats/rest/en/team');
async function fetchTeams() {
    try {
        const responseTeams = await fetch('https://cors.learningfuze.com?url=' + targetUrlTeams, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });
        if (!responseTeams.ok) {
            throw new Error(`HTTP error! Status: ${responseTeams.status}`);
        }
        const arrayTeams = await responseTeams.json();
        return arrayTeams.data;
    }
    catch (error) {
        console.error('Error:', error);
    }
}
//Get roster from API
async function fetchRoster(abbreviation, season) {
    const teamRoster = abbreviation;
    const teamSeason = season;
    const URLRoster = `https://api-web.nhle.com/v1/roster/${teamRoster}/${teamSeason}`;
    var targetUrlRosters = encodeURIComponent(URLRoster);
    try {
        const responseRoster = await fetch('https://cors.learningfuze.com?url=' + targetUrlRosters, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });
        if (!responseRoster.ok) {
            throw new Error(`HTTP error! Status: ${responseRoster.status}`);
        }
        const arrayRoster = await responseRoster.json();
        return arrayRoster;
    }
    catch (error) {
        console.error('Error:', error);
    }
}
//Get schedule from API
async function fetchSchedule(abbreviation, season) {
    const teamRoster = abbreviation;
    const teamSeason = season;
    const URLSchedule = `https://api-web.nhle.com/v1/club-schedule-season/${teamRoster}/${teamSeason}`;
    var targetUrlSchedule = encodeURIComponent(URLSchedule);
    try {
        const responseSchedule = await fetch('https://cors.learningfuze.com?url=' + targetUrlSchedule, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });
        if (!responseSchedule.ok) {
            throw new Error(`HTTP error! Status: ${responseSchedule.status}`);
        }
        const arraySchedule = await responseSchedule.json();
        return arraySchedule;
    }
    catch (error) {
        console.error('Error:', error);
    }
}
// Initialize the teams list on page load
document.addEventListener('DOMContentLoaded', () => {
    updateTeams();
    // Get reference to the season dropdown
    const selectElement = document.getElementById('scheduleSeason');
    const displayElement = document.getElementById('selectedSeason');
    const handleSelectChange = () => {
        selectedSeason = selectElement.value;
    };
    // Add event listener to the select element
    selectElement.addEventListener('change', handleSelectChange);
});
//Populates team data from the API and populates the team table
async function updateTeams() {
    const teams = await fetchTeams();
    const favorites = readFavorites();
    const favoriteTeams = [];
    const otherTeams = [];
    // Separate favorite teams from the rest
    for (let i = 0; i < favorites.length; i++) {
        for (let y = 0; y < teams.length; y++) {
            if (teams[y].triCode === favorites[i])
                favoriteTeams.push(teams[y]);
        }
    }
    for (const team of teams) {
        if (nhlTeams.includes(team.triCode) && !favorites.includes(team.triCode)) {
            otherTeams.push(team);
        }
    }
    // Function to sort array of team objects by a specified property
    function sortTeamsByProperty(arr, property) {
        return arr.sort((a, b) => {
            if (a[property] < b[property])
                return -1;
            if (a[property] > b[property])
                return 1;
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
async function updateRoster(fullteamname, abbreviation, season) {
    const roster = await fetchRoster(abbreviation, season);
    const nhlteamRoster = [];
    if (Array.isArray(roster.defensemen)) {
        for (let i = 0; i < roster.defensemen.length; i++) {
            const defenseman = roster.defensemen[i];
            const fullName = defenseman.lastName.default + ', ' + defenseman.firstName.default;
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
    }
    else {
        console.error('roster.defensemen is not an array');
    }
    if (Array.isArray(roster.forwards)) {
        for (let i = 0; i < roster.forwards.length; i++) {
            const forwards = roster.forwards[i];
            const fullName = forwards.lastName.default + ', ' + forwards.firstName.default;
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
    }
    else {
        console.error('roster.defensemen is not an array');
    }
    if (Array.isArray(roster.goalies)) {
        for (let i = 0; i < roster.goalies.length; i++) {
            const goalies = roster.goalies[i];
            const fullName = goalies.lastName.default + ', ' + goalies.firstName.default;
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
    }
    else {
        console.error('roster.defensemen is not an array');
    }
    updateDOMRoster(nhlteamRoster);
}
//Populate schedule data from the API
async function updateSchedule(fullteamname, abbreviation, season) {
    const schedule = await fetchSchedule(abbreviation, season); // Wait for the promise to resolve
    const nhlteamSchedule = [];
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
    populateScheduleSeasonDropdown(selectedSeason);
    populateTeamsDropdown(abbreviation);
}
//Add click event listener to close out the confirmation modal
const $cancelButton = document.querySelector('.remove-modal-cancel');
if (!$cancelButton)
    throw new Error('$cancelButton is not available');
$cancelButton.addEventListener('click', (event) => {
    const $dialog = document.querySelector('dialog');
    if (!$dialog)
        throw new Error('$dialog does not exist');
    pendingDeletion = '';
    $dialog.close();
});
//Add click event listener to remove team from favorites
const $confirmButton = document.querySelector('.remove-modal-confirm');
if (!$confirmButton)
    throw new Error('$confirmButton is not available');
$confirmButton.addEventListener('click', (event) => {
    const $dialog = document.querySelector('dialog');
    if (!$dialog)
        throw new Error('$dialog does not exist');
    //Remove team from favorites
    favorites = removeFavorites(pendingDeletion);
    //Update local storage
    writeFavorites();
    //Refresh the teams roster so that removed teams are no longer marked as a favorite
    updateTeams();
    $dialog.close();
});
// Add click event listener to the season and teams dropdown on the schedule page
const $scheduleDropdownSchedule = document.getElementById('scheduleSeasonDropdown');
if (!$scheduleDropdownSchedule)
    throw new Error('$scheduleDropdownSchedule is null');
const $teamDropdownSchedule = document.getElementById('teamName');
if (!$teamDropdownSchedule)
    throw new Error('$scheduleDropdownSchedule is null');
$scheduleDropdownSchedule.addEventListener('change', (event) => {
    event.preventDefault();
    const season = $scheduleDropdownSchedule.value;
    const abbreviation = $teamDropdownSchedule.value;
    const fullteamname = $teamDropdownSchedule.textContent ?? '';
    selectedSeason = season;
    updateSchedule(fullteamname, abbreviation, season);
});
$teamDropdownSchedule.addEventListener('change', (event) => {
    event.preventDefault();
    const season = $scheduleDropdownSchedule.value;
    const abbreviation = $teamDropdownSchedule.value;
    const fullteamname = $teamDropdownSchedule.textContent ?? '';
    selectedSeason = season;
    updateSchedule(fullteamname, abbreviation, season);
});
