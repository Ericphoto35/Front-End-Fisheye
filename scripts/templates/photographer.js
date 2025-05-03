function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price, id } = data;
    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        const link = document.createElement('a');
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


        link.href = `photographer.html?id=${id}`;
        link.appendChild(img);

        article.appendChild(link);
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

        const mediaElement = this.createSpecificMediaElement();
        // Rendre l'élément média focusable et ajouter les attributs d'accessibilité
        mediaElement.setAttribute("tabindex", "0");
        mediaElement.setAttribute("role", "img");
        mediaElement.setAttribute("aria-label", `${this.title}, cliquez pour ouvrir la lightbox`);

        // Si c'est une vidéo, ajoutez des contrôles
        if (mediaElement.tagName.toLowerCase() === 'video') {
            mediaElement.setAttribute("controls", "true");
        }

        mediaCard.appendChild(mediaElement);

        const mediaInfo = document.createElement("div");
        mediaInfo.classList.add("media-info");

        const title = document.createElement("h3");
        title.textContent = this.title;

        const likeButton = document.createElement("button");
        likeButton.classList.add("like-button");
        likeButton.setAttribute("aria-label", "Aimer cette photo");
        likeButton.setAttribute("tabindex", "0");

        const likesCount = document.createElement("span");
        likesCount.textContent = this.likes;
        likesCount.classList.add("likes-count");

        const likesIcon = document.createElement("i");
        likesIcon.classList.add("fas", "fa-heart");
        likesIcon.setAttribute("aria-hidden", "true");

        likeButton.appendChild(likesCount);
        likeButton.appendChild(likesIcon);

        mediaInfo.appendChild(title);
        mediaInfo.appendChild(likeButton);

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
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", `${this.title}, cliquez pour ouvrir la lightbox`);

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
      video.setAttribute("tabindex", "0");
      video.setAttribute("role", "button");
      video.setAttribute("aria-label", `${this.title}, cliquez pour ouvrir la lightbox`);


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