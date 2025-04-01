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
        link.href = `photographer.html?id=${id}`; // Lien vers la page du photographe (exemple)
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

