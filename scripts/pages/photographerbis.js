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

