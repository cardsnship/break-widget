const teamContainer = document.getElementById('teams');
const queryParams = new URLSearchParams(window.location.search);
const sport = queryParams.get('sport') || 'nfl';

let prevSoldState = {};

async function loadTeams() {
  const teamRes = await fetch('data/teams_' + sport + '.json');
  const soldRes = await fetch('https://cardsnship-sold-spots-vercel.vercel.app/api/sold_spots?sport=' + sport);
  const teams = await teamRes.json();
  const sold = await soldRes.json();

  teamContainer.innerHTML = '';

  teams.forEach(team => {
    const div = document.createElement('div');
    div.className = 'team-card';
    div.style.borderColor = team.colors[0];

    const img = document.createElement('img');
    img.src = team.logo;

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = team.name;

    div.appendChild(img);
    div.appendChild(name);

    if (sold[team.id]) {
      if (!prevSoldState[team.id]) {
        div.classList.add('flip');
        setTimeout(() => {
          div.classList.remove('flip');
          div.classList.add('sold');
        }, 800);
      } else {
        div.classList.add('sold');
      }

      const buyer = document.createElement('div');
      buyer.className = 'buyer';
      buyer.style.color = team.colors[1];
      buyer.textContent = sold[team.id];
      div.appendChild(buyer);
    }

    teamContainer.appendChild(div);
  });

  prevSoldState = { ...sold };
}

function clearTeams() {
  const existingCards = document.querySelectorAll('.team-card');
  existingCards.forEach(card => card.remove());
}

function refreshTeams() {
  clearTeams();
  loadTeams();
}

loadTeams();
setInterval(refreshTeams, 5000);

