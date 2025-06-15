const teamContainer = document.getElementById('teams');
const marquee = document.getElementById('marquee');
const marqueeText = marquee.querySelector('span');
const messageBox = document.getElementById('message-box');

const sport = new URLSearchParams(window.location.search).get('sport') || 'nfl';
const teamStates = {};

async function loadTeams() {
  try {
    const [teamRes, soldRes] = await Promise.all([
      fetch('data/teams_' + sport + '.json'),
      fetch('https://cardsnship-sold-spots-vercel.vercel.app/api/sold_spots?sport=' + sport)
    ]);
    const teams = await teamRes.json();
    const sold = await soldRes.json();

    if (!teamContainer.hasChildNodes()) {
      teams.forEach(team => {
        const card = document.createElement('div');
        card.className = 'team-card';
        card.id = team.id;
        card.style.borderColor = team.colors[0];

        const img = document.createElement('img');
        img.src = team.logo;
        card.appendChild(img);

        teamContainer.appendChild(card);
        teamStates[team.id] = { sold: false };
      });
    }

    for (const [teamId, buyer] of Object.entries(sold)) {
      const card = document.getElementById(teamId);
      if (!card) continue;
      const alreadySold = teamStates[teamId].sold;

      if (!alreadySold) {
        teamStates[teamId].sold = true;
        card.classList.add('flip');
        setTimeout(() => {
          card.classList.add('sold');
          card.classList.remove('flip');
          showMessage(`${buyer} has received ${teamId}!`);
        }, 800);
      }
    }
  } catch (err) {
    console.error('Error loading teams:', err);
  }
}

function showMessage(text) {
  messageBox.textContent = text;
  messageBox.style.display = 'block';
  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 4000);
}

loadTeams();
setInterval(loadTeams, 5000);

// Fake sports news
const newsItems = [
  "BREAKING: All 32 teams join Cards n Ship break!",
  "Hot take: Frost > Fanatics",
  "Shipcoin surges after midnight filler win!",
  "Customer pulls 1/1!"
];

function cycleNews() {
  let i = 0;
  setInterval(() => {
    marqueeText.textContent = newsItems[i % newsItems.length];
    i++;
  }, 12000);
}

cycleNews();
