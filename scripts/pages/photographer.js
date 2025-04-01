//// recuperer le photographe
async function getPhotographer() {
  const url = new URL(window.location.href);
  const id = parseInt(url.searchParams.get("id")); // Convertir en nombre entier

  try {
    const response = await fetch("data/photographers.json");
    const data = await response.json();
    const photographer = data.photographers.find(
      (photographer) => photographer.id === id
    );

    console.log("Photographe récupéré :", photographer);
    return photographer;
  } catch (error) {
    console.error("Erreur lors de la récupération du photographe :", error);
    return null; // ou gérer l'erreur autrement
  }
}

//// recuperer les medias
async function getMedia() {
  const url = new URL(window.location.href);
  const id = parseInt(url.searchParams.get("id")); // Convertir en nombre entier

  try {
    const response = await fetch("data/photographers.json");
    const data = await response.json();
    const media = data.media.filter(
      (mediaItem) => mediaItem.photographerId === id
    );

    console.log("Médias récupérés :", media);
    return media;
  } catch (error) {
    console.error("Erreur lors de la récupération des médias :", error);
    return []; // ou gérer l'erreur autrement
  }
}

////display media

class ImageMedia {
  constructor(data) {
    this.id = data.id;
    this.photographerId = data.photographerId;
    this.title = data.title;
    this.image = data.image;
    this.likes = data.likes;
  }

  createMediaElement() {
    const mediaCard = document.createElement("article");
    mediaCard.classList.add("media-card");

    const img = document.createElement("img");
    img.src = `assets/images/${this.image}`;
    img.alt = this.title;

    const mediaInfo = document.createElement("div");
    mediaInfo.classList.add("media-info");

    const title = document.createElement("h3");
    title.textContent = this.title;

    const likesContainer = document.createElement("div");
    likesContainer.classList.add("likes-container");

    const likesCount = document.createElement("span");
    likesCount.textContent = this.likes;
    likesCount.classList.add("likes-count");

    const likesIcon = document.createElement("i");
    likesIcon.classList.add("fa", "fa-heart");

    likesContainer.appendChild(likesCount);
    likesContainer.appendChild(likesIcon);

    mediaInfo.appendChild(title);
    mediaInfo.appendChild(likesContainer);

    mediaCard.appendChild(img);
    mediaCard.appendChild(mediaInfo);

    return mediaCard;
  }
}

class VideoMedia {
  constructor(data) {
    this.id = data.id;
    this.photographerId = data.photographerId;
    this.title = data.title;
    this.video = data.video;
    this.likes = data.likes;
  }

  createMediaElement() {
    const mediaCard = document.createElement("article");
    mediaCard.classList.add("media-card");

    const video = document.createElement("video");
    video.src = `assets/images/${this.video}`;
    video.controls = true;

    const mediaInfo = document.createElement("div");
    mediaInfo.classList.add("media-info");

    const title = document.createElement("h3");
    title.textContent = this.title;

    const likesContainer = document.createElement("div");
    likesContainer.classList.add("likes-container");

    const likesCount = document.createElement("span");
    likesCount.textContent = this.likes;
    likesCount.classList.add("likes-count");

    const likesIcon = document.createElement("i");
    likesIcon.classList.add("fas", "fa-heart");

    likesContainer.appendChild(likesCount);
    likesContainer.appendChild(likesIcon);

    mediaInfo.appendChild(title);
    mediaInfo.appendChild(likesContainer);

    mediaCard.appendChild(video);
    mediaCard.appendChild(mediaInfo);

    return mediaCard;
  }
}

// dropdown
document.addEventListener("DOMContentLoaded", function () {
  const customSelect = document.querySelector(".custom-select");
  const dropbtn = customSelect.querySelector(".dropbtn");
  const dropdownList = customSelect.querySelector("ul");
  const chevron = customSelect.querySelector(".chevron");
  const listItems = customSelect.querySelectorAll("li");

  dropbtn.addEventListener("click", function (e) {
    dropdownList.classList.toggle("show");
    chevron.classList.toggle("rotate");
    e.stopPropagation();
  });

  listItems.forEach((item) => {
    item.addEventListener("click", function () {
      dropbtn.firstChild.textContent = this.textContent + " ";

      customSelect.dataset.value = this.dataset.value;

      dropdownList.classList.remove("show");
      chevron.classList.remove("rotate");
    });
  });
  document.addEventListener("click", function () {
    dropdownList.classList.remove("show");
    chevron.classList.remove("rotate");
  });
});

function mediaFactory(data) {
  if (data.image) {
    return new ImageMedia(data);
  } else if (data.video) {
    return new VideoMedia(data);
  } else {
    console.error("Type de média inconnu:", data);
    return null;
  }
}

function sortMedia(mediaObjects, value) {
  switch (value) {
    case "popularity":
      return mediaObjects.sort((a, b) => b.likes - a.likes); // Inversé pour trier du plus grand au plus petit
    case "date":
      return mediaObjects.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "title":
      return mediaObjects.sort((a, b) => a.title.localeCompare(b.title)); // Utilisation de localeCompare pour le tri alphabétique
    default:
      return mediaObjects;
  }
}
//display header

async function displayData(photographer) {
  const photographersHeader = document.querySelector(".photographer-header");

  const photographerModel = photographerTemplate(photographer);
  const userCardDOM = photographerModel.getUserCardDOM();

  photographersHeader.appendChild(userCardDOM);
}

function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;
  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("div");
    const img = document.createElement("img");
    const cityElement = document.createElement("p");
    const taglineElement = document.createElement("p");
    const h2 = document.createElement("h2");

    const contactButton = document.createElement("button");
    contactButton.classList.add("contact_button");
    contactButton.textContent = "Contactez-moi";

    const firstGroup = document.createElement("div");
    firstGroup.classList.add("photographer-name");

    firstGroup.appendChild(h2);
    firstGroup.appendChild(cityElement);
    firstGroup.appendChild(taglineElement);

    img.setAttribute("src", picture);
    img.setAttribute("alt", name);
    article.classList.add("photographer-card");
    cityElement.textContent = city + ", " + country;
    taglineElement.textContent = tagline;
    h2.textContent = name;

    cityElement.classList.add("photographer-location");
    taglineElement.classList.add("photographer-tagline");

    article.appendChild(firstGroup);
    article.appendChild(contactButton);
    article.appendChild(img);

    return article;
  }

  return { name, picture, getUserCardDOM };
}

// Fonction pour afficher les médias

async function displayMedia(mediaObjects) {
  const mediaContainer = document.querySelector(".media");

  mediaContainer.innerHTML = "";

  mediaObjects.forEach((media) => {
    if (media) {
      const mediaElement = media.createMediaElement();
      mediaContainer.appendChild(mediaElement);
    }
  });
}

// Fonction pour afficher la modal de contact
async function displayModal() {
  const modal = document.getElementById("contact_modal");
  const photographer = await getPhotographer();
  const modalTitle = modal.querySelector(".modal-title");

  if (modalTitle && photographer) {
    modalTitle.innerHTML = `Contactez-moi<br>${photographer.name}`;
  }

  modal.style.display = "block";
}

// Fonction pour fermer la modal de contact

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
}

// initialisation
async function init() {
  const photographer = await getPhotographer();
  const media = await getMedia();
  const mediaObjects = media.map(mediaFactory);

  if (photographer) {
    displayData(photographer);

    // Ajoutez le tri par défaut
    const defaultSortedMedia = sortMedia([...mediaObjects], "title");
    displayMedia(defaultSortedMedia);

    // Gestion du dropdown de tri
    const customSelect = document.querySelector(".custom-select");
    const listItems = customSelect.querySelectorAll("li");

    listItems.forEach((item) => {
      item.addEventListener("click", function () {
        const sortValue = this.dataset.value;
        const sortedMedia = sortMedia([...mediaObjects], sortValue);

        displayMedia(sortedMedia);
      });
    });

    const contactButton = document.querySelector(".contact_button");
    if (contactButton) {
      contactButton.addEventListener("click", displayModal);
    }
    const closeModalButton = document.querySelector(".close-modal");
    if (closeModalButton) {
      closeModalButton.addEventListener("click", closeModal);
    }
  } else {
    console.error("Photographe non trouvé");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});

// MODAL

function validate() {
  // Récupération des valeurs des champs
  const firstName = document.getElementById("first").value;
  const lastName = document.getElementById("last").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Initialisation d'un statut de validation
  let isValid = true;

  // Validation du prénom (au moins 2 caractères)
  if (firstName.trim().length < 2) {
    createErrorMessage(
      "first",
      "Veuillez entrer un prénom valide (2 caractères minimum)."
    );
    isValid = false;
  } else {
    clearErrorMessage("first");
  }

  // Validation du nom (au moins 2 caractères)
  if (lastName.trim().length < 2) {
    createErrorMessage(
      "last",
      "Veuillez entrer un nom valide (2 caractères minimum)."
    );
    isValid = false;
  } else {
    clearErrorMessage("last");
  }

  // Validation de l'email avec une expression régulière
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    createErrorMessage("email", "Veuillez entrer une adresse email valide.");
    isValid = false;
  } else {
    clearErrorMessage("email");
  }

  if (message.trim().length < 2) {
    createErrorMessage("message", "Veuillez entrer un message.");
    isValid = false;
  } else {
    clearErrorMessage("message");
  }
  return isValid;
}

// Fonction pour ajouter des messages d'erreur sous chaque champ
function createErrorMessage(id, message) {
  // Vérifier si un message d'erreur existe déjà
  const existingError = document.getElementById(id + "-error");
  if (existingError) {
    existingError.textContent = message;
    return;
  }

  // Créer un nouvel élément pour le message d'erreur
  const errorDiv = document.createElement("div");
  errorDiv.id = id + "-error";
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "5px";

  // Ajouter le message après le champ
  const field = document.getElementById(id);
  field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

// Fonction pour effacer le message d'erreur
function clearErrorMessage(field) {
  const errorElement = document.getElementById(`${field}-error`);
  errorElement.textContent = "";
}
// Validation du formulaire lors de la soumission
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche la soumission du formulaire
  if (validate()) {
    alert("Votre message a été envoyé !");
    closeModal(); // Ferme la modal après validation
  }
});
