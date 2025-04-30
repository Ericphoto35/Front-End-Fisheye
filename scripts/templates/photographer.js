//// photographer template ////


function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price, id } = data; // Ajout de l'id
    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        const link = document.createElement('a'); // Création du lien
        const img = document.createElement('img');
        const cityElement = document.createElement('p');
        const taglineElement = document.createElement('p');
        const priceElement = document.createElement('p');
        const h2 = document.createElement('h2');

        img.setAttribute("src", picture);
        img.setAttribute("alt", name);
        cityElement.textContent = city + ", " + country;
        taglineElement.textContent = tagline;
        priceElement.textContent = price + "€/jour";
        h2.textContent = name;

        // Configuration du lien
        link.href = `photographer.html?id=${id}`;
        link.appendChild(img); // Placement de l'image dans le lien

        article.appendChild(link); // Ajout du lien à l'article
        article.appendChild(h2);
        article.appendChild(cityElement);
        article.appendChild(taglineElement);
        article.appendChild(priceElement);

        cityElement.classList.add('photographer-location');
        taglineElement.classList.add('photographer-tagline');
        priceElement.classList.add('photographer-price');

        return article;
    }

    return { name, picture, getUserCardDOM };
}

//// phtographer ID template ////

function photographerTemplateId(data) {
    const { name, portrait, city, country, tagline } = data;
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
  
//// display media /////

class Media {
    constructor(data) {
      this.id = data.id;
      this.photographerId = data.photographerId;
      this.title = data.title;
      this.likes = data.likes;
    }
  
    createMediaElement() {
      const mediaCard = document.createElement("article");
      mediaCard.classList.add("media-card");
  
      // Cette méthode sera implémentée par les classes enfants
      const mediaElement = this.createSpecificMediaElement();
      mediaCard.appendChild(mediaElement);
  
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
  
      mediaCard.appendChild(mediaInfo);
  
      return mediaCard;
    }
  
    createSpecificMediaElement() {
      throw new Error("Cette méthode doit être implémentée par les classes enfants");
    }
  }
  
  class ImageMedia extends Media {
    constructor(data) {
      super(data);
      this.image = data.image;
    }
  
    createSpecificMediaElement() {
      const img = document.createElement("img");
      img.src = `assets/images/${this.image}`;
      img.alt = this.title;
      img.classList.add("media-image");
      return img;
    }
  }
  
  class VideoMedia extends Media {
    constructor(data) {
      super(data);
      this.video = data.video;
    }
  
    createSpecificMediaElement() {
      const video = document.createElement("video");
      video.src = `assets/images/${this.video}`;
      video.controls = false;
      return video;
    }
  }
  
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