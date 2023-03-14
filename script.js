const cardList = document.querySelector(".card-list");

let personData = [];
let numberOfInvitations = 0;

//inital function call
getPersonData(8);
getStoredNumberOfInvitations();
renderPendingInvitations(numberOfInvitations);

//fetch person data from API > push to personData[] > call function for creating person-cards
function getPersonData(personCount) {
  fetch(
    "https://dummy-apis.netlify.app/api/contact-suggestions?count=" +
      personCount
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => (personData = data))
    .then(() => personData.forEach((element) => createPersonCard(element)));
}

//creates person-card with data from API, uses helper functions
function createPersonCard(personData) {
  const personCard = document.createElement("li");
  personCard.setAttribute("class", "person-card");

  const personPicture = getPersonPicture(personData);
  const personName = getPersonName(personData);
  const personTitle = getPersonTitle(personData);
  const mutualConnections = getMutualConnections(personData);
  const connectButton = addConnectButton();
  const removeButton = addRemoveButton();

  personCard.style.backgroundImage = `url("${personData.backgroundImage}"), url("./images/profile_bg_image_default.png")`;

  personCard.append(
    personPicture,
    personName,
    personTitle,
    mutualConnections,
    connectButton,
    removeButton
  );

  cardList.appendChild(personCard);
}

//helper function to set multiple attributes
function setAttributes(element, attributes) {
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

//creates image element for person-card
function getPersonPicture(personData) {
  const personPicture = document.createElement("img");
  setAttributes(personPicture, {
    src: personData.picture,
    class: "person__picture",
    alt: "profile picture",
  });
  return personPicture;
}

//creates name element for person-card
function getPersonName(personData) {
  const personName = document.createElement("h3");
  personName.innerText = personData.name.first + "  " + personData.name.last;
  personName.classList.add("person__name");
  return personName;
}

//creates title for person-card
function getPersonTitle(personData) {
  const personTitle = document.createElement("h4");
  personTitle.innerText = personData.title;
  personTitle.classList.add("person__title");
  return personTitle;
}

//creates text for mutual connections
function getMutualConnections(personData) {
  const mutualConnections = document.createElement("p");
  mutualConnections.innerText = ` ${personData.mutualConnections} mutual connections`;
  mutualConnections.classList.add("person__mutual-connections");
  return mutualConnections;
}

//creates connect button witch can call connectWithPerson()
function addConnectButton() {
  const connectButton = document.createElement("button");
  connectButton.classList.add("connect-button");
  connectButton.innerText = "Connect";
  connectButton.addEventListener("click", connectWithPerson);
  return connectButton;
}

//creates remove button which can call removeCard()
function addRemoveButton() {
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.innerText = "";
  removeButton.addEventListener("click", removeCard);
  return removeButton;
}

//removes card that got targeted
function removeCard(event) {
  cardList.removeChild(event.target.parentElement);
  getPersonData(1);
}

//toggles text of connect-button and in- / decrements numberOfInvitations-Counter
function connectWithPerson(event) {
  const button = event.target;
  if (button.innerText === "Connect") {
    button.innerText = "Pending";
    numberOfInvitations++;
    renderPendingInvitations(numberOfInvitations);
  } else if (button.innerText === "Pending") {
    button.innerText = "Connect";
    numberOfInvitations--;
    renderPendingInvitations(numberOfInvitations);
  }
  renderPendingInvitations(numberOfInvitations);
}

//stores the number of invitations in local storage
function storeNumberOfInvitations(numberOfInvitations) {
  localStorage.setItem(
    "numberOfInvitations",
    JSON.stringify(numberOfInvitations)
  );
}

//gets the number of invitations from local storage
function getStoredNumberOfInvitations() {
  const inivitationsNumber = JSON.parse(
    localStorage.getItem("numberOfInvitations")
  );
  if (inivitationsNumber === null) {
    numberOfInvitations = 0;
  } else {
    numberOfInvitations = inivitationsNumber;
  }
}

//renders text with number of pending invitations
function renderPendingInvitations(numberOfInvitations) {
  const pendingInvitationsText = document.querySelector(
    "#pending-invitations__text"
  );
  if (numberOfInvitations === 0) {
    pendingInvitationsText.innerText = "No pending invitations";
  } else if (numberOfInvitations > 0) {
    pendingInvitationsText.innerText = `${numberOfInvitations} pending Invitations`;
  }
  storeNumberOfInvitations(numberOfInvitations);
}
/*const API_URl = "https://dummy-apis.netlify.app/api/contact-suggestions?count="
const contactLsitElement = document.querySelector(".contact-list")


// store

let contacts =[];

async function getDataFromApi(){
    const response = await fetch(API_URL + 8);
    contacts = await response.json()
}

function render (){
   
    let output = "";
for (let contact of contacts){
  
    output += `<li>
      <button>x</button>
      <img src="" alt="Bild von Name der Person">
      <h2> Name Person</h2>
      <p> Jobbeschreibung</p>
      <p>Firma</p>
      <p> mutual connections</p>
      <button> Connect / Pending </button>
    </li>`
}
    contactListElement.innerHTML = output 

}

async function initApp () {
    await getDataFromApi(); 
    render ();

}

/*const API_URL = "https://dummy-apis.netlify.app/api/contact-suggestions?count="
const contactListElement = document.querySelector(".contact-list")

// store
let contacts = []

async function getDataFromApi () {
  const response = await fetch(API_URL + 8);
  contacts = await response.json()
}

function generateName (nameData) {
  let output = "";

  if (nameData?.title) {
    output += nameData.title
  }

  if (nameData?.first) {
    output += " " + nameData.first
  }

  if (nameData?.last) {
    output += " " + nameData.last
  }

  return output
}

async function addNewPersonFromApi () {
  const response = await fetch(API_URL + 1);
  return await response.json()
}

async function removePerson (index) {  
  contacts = contacts.filter((item, i) => i !== index)

  const newPerson = await addNewPersonFromApi()
  contacts.push(newPerson[0])
  render()
}

function generatePersonHtml (index, { picture, name, title, mutualConnections, backgroundImage}) {
  console.log()
  return `<li class="contact-person" style="background-image: url(${backgroundImage}?i=${index})">
      <button class="btn-remove-person">x</button>
      <img src="${picture}" alt="Bild von Name der Person">
      <h2>${generateName(name)}</h2>
      <p>${title}</p>
      <p>${mutualConnections} Mutual connect</p>
      <button>Connect / Pending</button>
    </li>`
}

function render () {
  contactListElement.innerHTML = ""

  let output = "";
  let index = 0;


  for(let contact of contacts) {
    output += generatePersonHtml(index, contact)
    index++
  }

  document.querySelector(".contact-list").innerHTML = output
  
  document.querySelectorAll(".btn-remove-person").forEach((button, index) => {
    button.addEventListener("click", () => removePerson(index))
  })
}

async function initApp () {
  await getDataFromApi();
  render()
}

initApp() */
