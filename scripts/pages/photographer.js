// Mettre le code JavaScript lié à la page photographer.html
async function getPhotographer() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    
    const photographer = await fetch("data/photographers.json")
        .then((response) => response.json())
        .then((data) => data.photographers.find((photographer) => photographer.id == id))
        .catch((error) => console.error(error));
    
    console.log("Photographe récupéré :", photographer);
    return photographer;
}

async function displayData(photographer) {
    const photographersHeader = document.querySelector(".photographer-header");
    
    // Pas besoin de boucle ici car nous n'avons qu'un seul photographe
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersHeader.appendChild(userCardDOM);
}
function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price, id } = data; // Ajout de l'id
    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('div');
        const img = document.createElement('img');
        const cityElement = document.createElement('p');
        const taglineElement = document.createElement('p');
        const h2 = document.createElement('h2');
        const button = document.createElement('button');
        

        img.setAttribute("src", picture);
        img.setAttribute("alt", name);
        article.classList.add("photographer-card");
        cityElement.textContent = city + ", " + country;
        taglineElement.textContent = tagline;
        button.textContent = "Contactez-moi";
        h2.textContent = name;
        button.classList.add("contact_button");
        
        
        // Création des divs pour les groupes d'éléments
        const firstGroup = document.createElement('div');
        firstGroup.classList.add('photographer-name');
        

        // Ajout des éléments au premier groupe (h2, cityElement, taglineElement)
        firstGroup.appendChild(h2);
        firstGroup.appendChild(cityElement);
        firstGroup.appendChild(taglineElement);


        // Ajout des groupes à l'article
        article.appendChild(firstGroup)
        article.appendChild(button);
        article.appendChild(img);

        cityElement.classList.add('photographer-location');
        taglineElement.classList.add('photographer-tagline');

        return article;
    }

    return { name, picture, getUserCardDOM };
}
async function init() {
    // Récupère les données du photographe
    const photographer = await getPhotographer();
    
    // Vérifier que le photographe a bien été trouvé
    if (photographer) {
        displayData(photographer);
    } else {
        console.error("Photographe non trouvé");
    }
}

init();