
async function getPhotographer() {
  const url = new URL(window.location.href);
  const id = parseInt(url.searchParams.get("id")); 

  try {
    const response = await fetch("data/photographers.json");
    const data = await response.json();
    return data.photographers.find(
        (photographer) => photographer.id === id
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du photographe :", error);
    return null; 
  }
}


async function getMedia() {
  const url = new URL(window.location.href);
  const id = parseInt(url.searchParams.get("id")); 

  try {
    const response = await fetch("data/photographers.json");
    const data = await response.json();
    return data.media.filter(
        (mediaItem) => mediaItem.photographerId === id
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des médias :", error);
    return [];
  }
}



async function displayData(photographer) {
  const photographersHeader = document.querySelector(".photographer-header");

  const photographerModel = photographerTemplateId(photographer);
  const userCardDOM = photographerModel.getUserCardDOM();

  photographersHeader.appendChild(userCardDOM);
}



document.addEventListener("DOMContentLoaded", function () {
  const customSelect = document.querySelector(".custom-select");
  const dropbtn = customSelect.querySelector(".dropbtn");
  const dropdownList = customSelect.querySelector("ul");
  const chevron = customSelect.querySelector(".chevron");
  const listItems = customSelect.querySelectorAll("li");
  

  dropbtn.setAttribute("aria-haspopup", "listbox");
  dropbtn.setAttribute("aria-expanded", "false");
  dropdownList.setAttribute("role", "listbox");
  
  listItems.forEach((item) => {
    item.setAttribute("role", "option");
  });

  dropbtn.addEventListener("click", function (e) {
    const isExpanded = dropdownList.classList.toggle("show");
    chevron.classList.toggle("rotate");
    // Màj accessibilité
    dropbtn.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    e.stopPropagation();
  });

  listItems.forEach((item) => {
    item.addEventListener("click", function () { 
      dropbtn.firstChild.textContent = this.textContent + " ";
      
      customSelect.dataset.value = this.dataset.value;
      
      dropdownList.classList.remove("show");
      chevron.classList.remove("rotate");
      dropbtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", function () {
    if (dropdownList.classList.contains("show")) {
      dropdownList.classList.remove("show");
      chevron.classList.remove("rotate");
      dropbtn.setAttribute("aria-expanded", "false");
    }
  });
});




function sortMedia(mediaObjects, value) {
  switch (value) {
    case "popularity":
      return mediaObjects.sort((a, b) => b.likes - a.likes); 
    case "date":
      return mediaObjects.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "title":
      return mediaObjects.sort((a, b) => a.title.localeCompare(b.title)); 
    default:
      return mediaObjects;
  }
}


function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxVideo = document.querySelector(".lightbox-video");
  const closeButton = document.querySelector(".close-lightbox");
  const prevButton = document.querySelector(".prev-lightbox");
  const nextButton = document.querySelector(".next-lightbox");
  const lightboxTitle = document.querySelector(".lightbox-title");
  const mainwrapper = document.querySelector(".main-wrapper");


  let currentIndex = 0;
  let mediaElements = [];

  lightbox.setAttribute("aria-hidden", "false");
  mainwrapper.setAttribute("aria-hidden", "true");


  function updateMediaElements() {
    mediaElements = document.querySelectorAll(".media-card img, .media-card video");

    mediaElements.forEach((mediaElement) => {

      mediaElement.removeEventListener("click", handleMediaClick);
      mediaElement.addEventListener("click", handleMediaClick);


      mediaElement.setAttribute("tabindex", "0");
      mediaElement.removeEventListener("keydown", handleMediaKeydown);
      mediaElement.addEventListener("keydown", handleMediaKeydown);
    });
  }

  function handleMediaKeydown(event) {

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const clickedElement = event.currentTarget;
      const allElements = Array.from(mediaElements);
      currentIndex = allElements.indexOf(clickedElement);
      openLightbox(clickedElement);
    }
  }

  function handleMediaClick(event) {

    const clickedElement = event.currentTarget;
    const allElements = Array.from(mediaElements);
    currentIndex = allElements.indexOf(clickedElement);
    openLightbox(clickedElement);
  }

  function openLightbox(mediaElement) {

    if (mediaElement.tagName.toLowerCase() === "img") {
      lightboxImage.src = mediaElement.src;
      lightboxTitle.textContent = mediaElement.nextElementSibling.querySelector("h3").textContent;
      lightboxImage.style.display = "block";
      lightboxVideo.style.display = "none";
      lightboxVideo.pause();
    } else if (mediaElement.tagName.toLowerCase() === "video") {
      lightboxVideo.src = mediaElement.src;
      lightboxVideo.style.display = "block";
      lightboxImage.style.display = "none";
    }

    lightbox.style.display = "flex";
  }

  function closeLightbox() {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
    mainwrapper.setAttribute("aria-hidden", "false");
    if (lightboxVideo.src) {
      lightboxVideo.pause();
    }
  }

  function showPrevious() {
    currentIndex = (currentIndex - 1 + mediaElements.length) % mediaElements.length;
    openLightbox(mediaElements[currentIndex]);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % mediaElements.length;
    openLightbox(mediaElements[currentIndex]);
  }


  document.addEventListener("keydown", function(event) {
    if (lightbox.style.display === "flex") {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        showPrevious();
      } else if (event.key === "ArrowRight") {
        showNext();
      }
    }
  });

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", showPrevious);
  nextButton.addEventListener("click", showNext);

  return updateMediaElements;
}


async function displayModal() {
  const modal = document.getElementById("contact_modal");
  const body = document.querySelector("body");
  const photographer = await getPhotographer();
  const modalTitle = modal.querySelector(".modal-title");

  if (modalTitle && photographer) {
    modalTitle.innerHTML = `Contactez-moi<br>${photographer.name}`;
  }

  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");
  body.setAttribute("aria-hidden", "true");
}



function closeModal() {
  const modal = document.getElementById("contact_modal");
  const body = document.querySelector("body");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  body.setAttribute("aria-hidden", "false");
}


function validate() {
  const firstName = document.getElementById("first").value;
  const lastName = document.getElementById("last").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  let isValid = true;


  if (firstName.trim().length < 2) {
    createErrorMessage(
      "first",
      "Veuillez entrer un prénom valide (2 caractères minimum)."
    );
    isValid = false;
  } else {
    clearErrorMessage("first");
  }


  if (lastName.trim().length < 2) {
    createErrorMessage(
      "last",
      "Veuillez entrer un nom valide (2 caractères minimum)."
    );
    isValid = false;
  } else {
    clearErrorMessage("last");
  }


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


function createErrorMessage(id, message) {

  const existingError = document.getElementById(id + "-error");
  if (existingError) {
    existingError.textContent = message;
    return;
  }

  const errorDiv = document.createElement("div");
  errorDiv.id = id + "-error";
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "18px";
  errorDiv.style.marginTop = "5px";

  const field = document.getElementById(id);
  field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearErrorMessage(id) {
  const errorDiv = document.getElementById(id + "-error");
  if (errorDiv) {
    errorDiv.remove();
  }
}


document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();
  if (validate()) {
    alert("Votre message a été envoyé !");
    closeModal();

    const firstName = document.getElementById("first").value;
    const lastName = document.getElementById("last").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;


    console.log("Données du formulaire :", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      message: message,
    }); 
  }
});


async function displayMedia(mediaObjects) {
  const mediaContainer = document.querySelector(".media");
  mediaContainer.innerHTML = "";

  mediaObjects.forEach((media) => {
    if (media) {
      const mediaElement = media.createMediaElement();
      mediaContainer.appendChild(mediaElement);
    }
  });

  if (window.updateLightboxElements) {
    window.updateLightboxElements();
  }
  

  setupLikesCounter(mediaObjects);
}


function setupLikesCounter(mediaObjects) {
  setTimeout(() => {
    const likeButtons = document.querySelectorAll(".like-button");
    
    likeButtons.forEach((button) => {
      const mediaCard = button.closest('.media-card');
      const title = mediaCard.querySelector('h3').textContent;
      const mediaItem = mediaObjects.find(media => media.title === title);
      
   
      button.addEventListener("click", function() {
        if (mediaItem && !mediaItem.isLiked) {

          mediaItem.isLiked = true;
          

          mediaItem.likes += 1;
          

          const likesCount = button.querySelector(".likes-count");
          likesCount.textContent = mediaItem.likes;
          

          button.classList.add('liked');
          

          updateTotalLikes(mediaObjects);
        }
      });
    });
  }, 100);
}


function updateTotalLikes(mediaObjects) {

  const totalLikesCount = document.querySelector(".total-likes-count");

  if (totalLikesCount) {

    totalLikesCount.textContent = mediaObjects.reduce((total, media) => total + media.likes, 0);

  }
}




async function init() {

  window.updateLightboxElements = initLightbox();
  
  const photographer = await getPhotographer();
  const media = await getMedia();
  const mediaObjects = media.map(mediaFactory);

  if (photographer) {
    displayData(photographer);

    // Afficher les médias avec le tri par défaut
    const defaultSortedMedia = sortMedia([...mediaObjects], "title");
    await displayMedia(defaultSortedMedia);
    
    // update lightbox elements after displaying media
    if (window.updateLightboxElements) {
      window.updateLightboxElements();
    }


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
    

    updateTotalLikes(mediaObjects);

    setupLikesCounter(mediaObjects);
  } else {
    console.error("Photographe non trouvé");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  init();
});



