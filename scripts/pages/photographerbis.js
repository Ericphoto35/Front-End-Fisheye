async function getMedia() {
    const url = new URL(window.location.href);
    const id = parseInt(url.searchParams.get("id"), 10); // Specify radix 10
  
    try {
        const response = await fetch("data/photographers.json");
        const data = await response.json();
        const media = data.media.filter((mediaItem) => mediaItem.photographerId === id);
  
        console.log("Médias récupérés :", media);
        return media;
    } catch (error) {
        console.error("Erreur lors de la récupération des médias :", error);
        return []; 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const customSelect = document.querySelector('.custom-select');
    const dropbtn = customSelect.querySelector('.dropbtn');
    const dropdownList = customSelect.querySelector('ul');
    const chevron = customSelect.querySelector('.chevron');
    const listItems = customSelect.querySelectorAll('li');
  
  
    dropbtn.addEventListener('click', function(e) {
        dropdownList.classList.toggle('show');
        chevron.classList.toggle('rotate');
        e.stopPropagation();
    });
  
    listItems.forEach(item => {
        item.addEventListener('click', function(e) {
            
            dropbtn.firstChild.textContent = this.textContent ;
            
         
            customSelect.dataset.value = this.dataset.value;
  
            dropdownList.classList.remove('show');
            chevron.classList.remove('rotate');
            console.log("Selected value:", this.dataset.value); 
        });
        
    });
    document.addEventListener('click', function() {
        dropdownList.classList.remove('show');
        chevron.classList.remove('rotate');
    });
  });
  

class ImageMedia {
    constructor(data) {
        this.id = data.id;
        this.photographerId = data.photographerId;
        this.title = data.title;
        this.image = data.image;
        this.likes = data.likes;
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

    
}

function factoryMedia(data) {
    if (data.image) {
        return new ImageMedia(data);
    } else if (data.video) {
        return new VideoMedia(data);
    }
    throw new Error('Invalid media type');
}


async function renderMedia() {
    
    try {
        const media = await getMedia();
        
        media.sort((a, b) => b.likes - a.likes); 
        
       /* media.forEach((mediaItem) => {
            try {
                const mediaElement = factoryMedia(mediaItem)
                console.log('Média créé avec succès :', mediaElement);
            } catch (error) {
                console.error('Erreur lors de la création de l\'élément média :', error);
            }
        });*/
    } catch (error) {
        console.error('Erreur lors du rendu des médias :', error);
    }
}
// Call the render function
renderMedia();

// Fonction pour mettre à jour le compteur total de likes
// Modifier la fonction setupLikesCounter
function setupLikesCounter(mediaObjects) {
    // Cette fonction sera appelée après que les médias sont affichés
    setTimeout(() => {
      const likeButtons = document.querySelectorAll(".likes-container");
      
      likeButtons.forEach((button) => {
        // Récupérer l'article parent (la carte média)
        const mediaCard = button.closest('.media-card');
        // Récupérer le titre du média
        const title = mediaCard.querySelector('h3').textContent;
        // Trouver l'objet média correspondant
        const mediaItem = mediaObjects.find(media => media.title === title);
        
        // Ajouter un attribut pour suivre si déjà liké (si pas encore défini)
        if (mediaItem && typeof mediaItem.isLiked === 'undefined') {
          mediaItem.isLiked = false;
        }
        
        // Si déjà liké, ajouter la classe visuelle
        if (mediaItem && mediaItem.isLiked) {
          button.classList.add('liked');
        }
        
        button.addEventListener("click", function() {
          if (mediaItem && !mediaItem.isLiked) {
            // Marquer comme liké
            mediaItem.isLiked = true;
            
            // Incrémenter le compteur
            mediaItem.likes += 1;
            
            // Mettre à jour l'affichage
            const likesCount = button.querySelector(".likes-count");
            likesCount.textContent = mediaItem.likes;
            
            // Ajouter la classe visuelle
            button.classList.add('liked');
            
            // Mettre à jour le total des likes
            updateTotalLikes(mediaObjects);
          }
        });
      });
    }, 100);
  }
  function updateTotalLikes(mediaObjects) {
  
    const totalLikesCount = document.querySelector(".total-likes-count");
  
    if (totalLikesCount) {
  
      const sum = mediaObjects.reduce((total, media) => total + media.likes, 0);
  
      totalLikesCount.textContent = sum;
  
    }
  
  }