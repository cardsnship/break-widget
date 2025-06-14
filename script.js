const teamContainer = document.getElementById('teams');
const messageBox = document.getElementById('message-box');
const marqueeInner = document.getElementById('marquee-inner');
const buyerListContainer = document.getElementById('buyer-list');

const sport = new URLSearchParams(window.location.search).get('sport') || 'nfl';
const teamStates = {};
let actionHistory = [];

function logAction(action) {
  actionHistory.push(action);
}

async function loadTeams() {
  try {
    const teamRes = await fetch('data/teams_' + sport + '.json');
    const teams = await teamRes.json();

    if (!teamContainer.hasChildNodes()) {
      teams.forEach(team => {
        const card = document.createElement('div');
        card.className = 'team-card';
        card.id = team.id;
        card.style.borderColor = team.colors[0];

        const img = document.createElement('img');
        img.src = team.logo;
        card.appendChild(img);

        teamStates[team.id] = { sold: false, buyer: null };
        
        card.addEventListener('click', () => {
          if (!teamStates[team.id].sold) {
            const buyer = prompt('Enter buyer name for ${team.id}:');
            if (buyer) {
              teamStates[team.id].sold = true;
              teamStates[team.id].buyer = buyer;
              logAction({ type: 'sell', teamId: team.id, buyer });
              card.classList.add('flip');
              setTimeout(() => {
                card.classList.add('sold');
                card.classList.remove('flip');
                showMessage('${buyer} has received ${team.name}!');
                updateBuyerList();
              }, 800);
            }
          } else {
            const confirmUndo = confirm('Remove ${team.id} from the sold list?');
            if (confirmUndo) {
              logAction({ type: 'unsell', teamId: team.id, previousBuyer: teamStates[team.id].buyer });
              teamStates[team.id].sold = false;
              teamStates[team.id].buyer = null;
              card.classList.remove('sold');
              showMessage('${team.id} is back on the board!');
              updateBuyerList();
            }
          }
        });
        
        teamContainer.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Error loading teams:', err);
  }
}

function updateBuyerList() {
  buyerListContainer.innerHTML = '';

  const teamOrder = Object.keys(teamStates);
  teamOrder.forEach(teamId => {
    const row = document.createElement('div');
    row.className = 'buyer-row';

    const logo = document.createElement('img');
    logo.src = document.getElementById(teamId).querySelector('img').src;
    logo.className = 'buyer-logo';

    const name = document.createElement('div');
    name.className = 'buyer-name';
    name.textContent = teamStates[teamId].sold ? teamStates[teamId].buyer : '';

    row.appendChild(logo);
    row.appendChild(name);
    buyerListContainer.appendChild(row);
  });
}

function showMessage(text) {
  messageBox.textContent = text;
  messageBox.style.animation = 'none';
  void messageBox.offsetWidth;
  messageBox.style.display = 'block';
  messageBox.style.animation = 'popReveal 0.6s ease-out forwards';
  setTimeout(() => {
    messageBox.style.display = 'none';
    messageBox.style.transform = 'translateX(-50%) scale(0)';
    messageBox.style.opacity = '0';
  }, 4000);
}

function resetAllTeams() {
  Object.keys(teamStates).forEach(teamId => {
    teamStates[teamId].sold = false;
    teamStates[teamId].buyer = null;
    const card = document.getElementById(teamId);
    card.classList.remove('sold');
  });
  showMessage('All teams have been reset.');
  updateBuyerList();
}

function undoLastAction() {
  const last = actionHistory.pop();
  if (!last) return;
  const card = document.getElementById(last.teamId);

  if (last.type === 'sell') {
    teamStates[last.teamId].sold = false;
    teamStates[last.teamId].buyer = null;
    card.classList.remove('sold');
    showMessage('Undo: ${last.teamId} is now available.');
  } else if (last.type === 'unsell') {
    teamStates[last.teamId].sold = true;
    teamStates[last.teamId].buyer = last.previousBuyer;
    card.classList.add('sold');
    showMessage('Undo: ${last.teamId} re-assigned to ${last.previousBuyer}');
  }
  updateBuyerList();
}

function manualEditBuyer() {
  const teamId = prompt('Enter team ID to edit:');
  if (!teamId || !teamStates[teamId]) return;
  const newBuyer = prompt('Enter new buyer name for ${teamId}:');
  if (newBuyer) {
    teamStates[teamId].sold = true;
    teamStates[teamId].buyer = newBuyer;
    document.getElementById(teamId).classList.add('sold');
    showMessage('${teamId} now belongs to ${newBuyer}');
    updateBuyerList();
  }
}

function executeTrade() {
  const team1 = prompt('Enter first team ID to trade:');
  const team2 = prompt('Enter second team ID to trade:');
  if (team1 && team2 && teamStates[team1] && teamStates[team2]) {
    const tempBuyer = teamStates[team1].buyer;
    teamStates[team1].buyer = teamStates[team2].buyer;
    teamStates[team2].buyer = tempBuyer;
    showMessage('Trade executed: ${team1} ⇄ ${team2}');
    updateBuyerList();
  }
}

function toggleGrid() {
  teamContainer.style.display = teamContainer.style.display === 'none' ? 'grid' : 'none';
}

function toggleMarquee() {
  const marquee = document.getElementById('marquee');
  marquee.style.display = marquee.style.display === 'none' ? 'block' : 'none';
  if (marquee.style.display === 'block') {
    initMarquee();
  }
}

function toggleBuyerList() {
  const list = document.getElementById('buyer-list');
  list.style.display = list.style.display === 'none' ? 'grid' : 'none';
}

window.addEventListener('load', () => {
  loadTeams().then(updateBuyerList);
});

const speedPixelsPerSecond = 75;

const newsItems = [
  "Jets Install Emergency Darkness Retreat Room for Aaron Rodgers' Post-Sack Recovery",
  "Travis Kelce to Drop Surprise Christmas Album Featuring Taylor Swift and the Eagles D-Line",
  "Tyreek Hill Clocked at 30 MPH on Florida Jet Ski – Dolphins Say He’s Still WR1 Indoors Too",
  "Kirk Cousins Accidentally Signs Bible at Falcons Fan Event – Now Known as 'Saint Kirk'",
  "Patrick Mahomes Reportedly Sees Every NFL Defense in Slow Motion After 3rd Energy Drink",
  "Josh Allen Caught Practicing Handshakes with New WRs – Bills Declare It a Chemistry Drill",
  "Dak Prescott Declares This is 'Our Year' for 9th Straight Year – Scientists Investigating Loop",
  "George Kittle Challenges Entire NFC to Cage Match – Roger Goodell 'Strongly Considering'",
  "Brock Purdy Mistaken for Apple Store Employee Again – Still Throws Dimes Mid-Shift",
  "Micah Parsons’ Workout Routine Banned in 3 States – Too Intimidating for Civilians",
  "Russell Wilson Asked What Went Wrong in 2023 – Responds with 12-Minute Prayer and Subway Plug",
  "CJ Stroud Buys Texans Entire Block of Houston Real Estate – Names It ‘Stroud Town’",
  "Stefon Diggs Denies Rift With Teammates – Says He Just Prefers to Be Mad Alone",
  "Justin Jefferson Starts Side Hustle as Dance Instructor – First Class: Griddy for Beginners",
  "Trevor Lawrence Spotted at Salon – Sources Confirm Hair Flow Now 3% More Majestic",
  "NFL Implements New Rule: No One Can Tackle Christian McCaffrey Without Permission Slip",
  "Joe Burrow's Pre-Game Fits Declared Tax-Deductible Art – IRS Issues Apology",
  "Jared Goff Confuses Lions Fans By Throwing to Open Receiver on 4th Down",
  "Deshaun Watson Seen Practicing Handshakes with Massage Therapists – Browns Say 'He’s Learning'",
  "Derrick Henry Reportedly Trains by Dragging F-150s Uphill – Ravens Say It Was Voluntary",
  "Zach Wilson Now Training to Be Backup Quarterback… For Flag Football",
  "Brandon Aiyuk Demands WR1 Money – 49ers Offer Him 1 Target Per Game Instead",
  "Daniel Jones Seen Practicing Blindfolded – Colts Say It’s ‘An Improvement’",
  "Second‑Round Rookies Holding Teams Hostage — Every NFL GM Now Googling 'How to Avoid Salary Revolt'",
  "Caleb Williams Demands Creative Input on Bears Playbook – Adds 'TikTok Trick Play #2'",
  "Anthony Richardson’s Body is 100% Healthy – Colts Announce They’ll Sit Him Just to Be Safe",
  "Sources Confirm: Cards n Ship Has Pulled More Fire This Week Than the Jets Offense All Season",
  "Cards n Ship Adds Emotional Support Hotline for Skunked Buyers — Now with Live Hold Music from a Dak Prescott Interception",
  "BREAKING: Cards n Ship Pulls So Much Heat, PSA Called and Asked for a Restraining Order",
  "Rumor: Mahomes Watches Cards n Ship Before Games to Remember What a Winner Looks Like",
  "BREAKING: Cards n Ship Pulls So Many Golds, Panini Sent a Cease and Desist… Then Asked for a Spot",
  "BREAKING: Cards n Ship Pulls So Much Heat, USPS Now Delivers Packages Wearing Oven Mitts",
];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function initMarquee() {
  const highlightedNews = newsItems.map(item =>
    item.replace("BREAKING:", '<span class="breaking">BREAKING:</span>')
  );
  const shuffledNews = shuffle(highlightedNews);
  const loopedText = shuffledNews.join("  🔥🏈🔥  ");
  marqueeInner.innerHTML = `${loopedText}  🔥🏈🔥  ${loopedText}`;
  marqueeInner.style.transform = 'translateX(0)';

  requestAnimationFrame(() => {
    const textWidth = marqueeInner.scrollWidth;
    const duration = textWidth / speedPixelsPerSecond;
    marqueeInner.style.setProperty('--scroll-time', `${duration}s`);
    marqueeInner.style.animation = 'none';
    void marqueeInner.offsetWidth;
    marqueeInner.style.animation = '';
  });
}

initMarquee();

window.addEventListener('load', initMarquee);

document.addEventListener('mousemove', e => {
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (el) {
    document.querySelectorAll('.__hover_debug').forEach(el => el.classList.remove('__hover_debug'));
    el.classList.add('__hover_debug');
  }
});
