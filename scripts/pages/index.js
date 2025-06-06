    async function getPhotographers() {
        const photographers = await fetch("data/photographers.json")
            .then((response) => response.json())
            .then((data) => data.photographers)
            .catch((error) => console.error(error));
        return ({
            photographers: [...photographers ]})
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        const { photographers } = await getPhotographers();
        displayData(photographers);
    }
    
    init();
    
