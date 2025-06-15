const teamContainer = document.getElementById('teams');
const queryParams = new URLSearchParams(window.location.search);
const sport = queryParams.get('sport') || 'nfl';
const endpoint = `https://cardsnship-sold-spots-vercel.vercel.app/api/sold_spots?sport=${sport}`;

const teamStates = {}; // Keeps track of sold state per team

async function initTeams() {
  const teamRes = await fetch(`data/teams_${sport}.json`);
  const teams = await teamRes.json();

  teams.forEach(team => {
    const div = document.createElement('div');
    div.className = 'team-card';
    div.id = team.id;
    div.style.borderColor = team.colors[0];

    const img = document.createElement('img');
    img.src = team.logo;
    div.appendChild(img);

    teamContainer.appendChild(div);
    teamStates[team.id] = { sold: false }; // Initialize state
  });
}

function showMessage(buyer, teamName) {
  const messageBox = document.getElementById('message-box');
  messageBox.textContent = `${buyer} has received ${teamName}!`;
  messageBox.style.opacity = 1;

  setTimeout(() => {
    messageBox.style.opacity = 0;
  }, 3000);
}

async function updateSoldStatus() {
  try {
    const res = await fetch(endpoint);
    const soldSpots = await res.json();

    for (const [teamId, buyer] of Object.entries(soldSpots)) {
      const card = document.getElementById(teamId);
      if (!card) continue;

      const previouslySold = teamStates[teamId]?.sold;
      const newSold = !!buyer;

      if (newSold && !previouslySold) {
        card.classList.add('flip');
        setTimeout(() => {
          card.classList.add('sold');
          card.classList.remove('flip');
        }, 800);

        const teamName = card.dataset.name;
        showMessage(buyer, teamName);
      }
    }
    
      teamStates[teamId] = { sold: newSold };
  } catch (err) {
    console.error('Error loading teams:', err);
  }
}

initTeams().then(() => {
  updateSoldStatus();
  setInterval(updateSoldStatus, 5000);
});
