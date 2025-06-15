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

async function updateSoldStatus() {
  try {
    const res = await fetch(endpoint);
    const soldSpots = await res.json();

    for (const [teamId, buyer] of Object.entries(soldSpots)) {
      const card = document.getElementById(teamId);
      if (!card) continue;

      const wasSold = teamStates[teamId].sold;
      const isSold = !!buyer;

      if (isSold && !wasSold) {
        card.classList.add('sold', 'flip');

        const buyerDiv = document.createElement('div');
        buyerDiv.className = 'buyer';
        buyerDiv.textContent = buyer;
        card.appendChild(buyerDiv);
      }

      teamStates[teamId].sold = isSold;
    }
  } catch (err) {
    console.error('Error updating sold teams:', err);
  }
}

initTeams().then(() => {
  updateSoldStatus();
  setInterval(updateSoldStatus, 5000);
});
