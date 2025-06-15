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
  "Second‑Round Rookies Holding Teams Hostage—Every NFL G‑M Now Googling 'How to Avoid Salary Revolt'",
  "Caleb Williams Demands Creative Input on Bears Playbook – Adds 'TikTok Trick Play #2'",
  "Anthony Richardson’s Body is 100% Healthy – Colts Announce They’ll Sit Him Just to Be Safe"  
];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

const shuffledNews = shuffle(newsItems);
marqueeText.textContent = shuffledNews.join(" | ");
