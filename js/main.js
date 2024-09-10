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
;
//Get roster from API
const teamRoster = 'DET';
const teamSeason = '20232024';
const URLRoster = `https://api-web.nhle.com/v1/roster/${teamRoster}/${teamSeason}`;
var targetUrlRosters = encodeURIComponent(URLRoster);
async function fetchRoster() {
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
// Initialize the list on page load
document.addEventListener('DOMContentLoaded', () => {
    updateTeams();
});
// Initialize the list on page load
document.addEventListener('DOMContentLoaded', () => {
    updateRoster();
});
//Populates team data from the API and populates the team table
async function updateTeams() {
    const teams = await fetchTeams(); // Wait for the promise to resolve
    const nhlteamlist = [];
    for (let i = 0; i < teams.length; i++) {
        for (let x = 0; x < nhlTeams.length; x++) {
            if (teams[i].triCode === nhlTeams[x]) {
                nhlteamlist.push(teams[i]);
            }
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
    const sortedTeamsByName = sortTeamsByProperty(nhlteamlist, 'fullName');
    updateDOMTeams(sortedTeamsByName);
}
//Populate roster data from the API
async function updateRoster() {
    const roster = await fetchRoster(); // Wait for the promise to resolve
    console.log(roster); // Use the teams data
}
