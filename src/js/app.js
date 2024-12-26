
document.addEventListener("DOMContentLoaded", () => {
// Botones para el carrusel
  const miCarrusel = document.querySelector("#carrusel-api");
  const carousel = new bootstrap.Carousel(miCarrusel);

  const miCarruselMobile = document.querySelector("#carrusel-api-mobile");
  const carouselMobile = new bootstrap.Carousel(miCarruselMobile);

  document.querySelector(".mi-boton-prev").addEventListener("click", () => {
    carousel.prev();
  });

  document.querySelector(".mi-boton-next").addEventListener("click", () => {
    carousel.next();
  });

  document.querySelector(".mi-boton-prev-mobile").addEventListener("click", () => {
    carouselMobile.prev();
  });

  document.querySelector(".mi-boton-next-mobile").addEventListener("click", () => {
    carouselMobile.next();
  });
  

  async function cargarPersonajes() {
    try {
      let url = "https://swapi.py4e.com/api/people/?page=1";
      let totalPersonajes = [];

      // Recorre todas las páginas hasta que no haya 'next'
      while (url) {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Error al cargar datos: ${response.status}`);
        const data = await response.json();
        totalPersonajes = totalPersonajes.concat(data.results);
        url = data.next;
      }

      const chunkSize = 4; // Número de personajes por slide
      const slides = [];
      for (let i = 0; i < totalPersonajes.length; i += chunkSize) {
        slides.push(totalPersonajes.slice(i, i + chunkSize));
      }

      return [totalPersonajes, slides];
    } catch (error) {
      console.error("Error al cargar personajes:", error);
      // Opcional: Mostrar un mensaje de error en el DOM
    }
  }

  function IDpersonaje(url) {
    return url.split("/").filter(Boolean).pop();
  }

  // Recuperar slides y totalPersonajes
  cargarPersonajes()
    .then(([totalPersonajes, slides]) => {
      // Seleccionar los elementos del DOM
      const carouselInner = document.querySelector(
        "#carrusel-api .carousel-inner"
      );
      const carouselInnerMobile = document.querySelector(
        "#carrusel-api-mobile .carousel-inner"
      );

      // Limpiar el contenido existente
      carouselInner.innerHTML = "";
      carouselInnerMobile.innerHTML = "";

      // Cargar carrusel de escritorio
      slides.forEach((group, index) => {
        const cardsHTML = group
          .map(
            (char) => `
              <div class="card bg-dark text-white flex-grow-1 rounded-lg">   
                <img
                  class="imagen-card card-img img-fluid"
                  src="https://starwars-visualguide.com/assets/img/characters/${IDpersonaje(
                    char.url
                  )}.jpg"
                  alt="${char.name}">
                <div class="card-body p-0">
                  <h5 class="card-title text-center py-2 bg-primary text-dark">  ${char.name.toLowerCase()}</h5>
                  <div class="card-text p-3">
                    <p><strong>🎬 Películas:</strong> ${char.films.length}</p>
                    <p><strong>📏 Altura:</strong> ${char.height} cm</p>
                    <p><strong>⚖️ Peso:</strong> ${char.mass} kg</p>
                    <p><strong>👁️ Color de ojos:</strong> ${char.eye_color}</p>
                    <a href="#" class="card-link d-block text-decoration-none text-end">
                      <i class="bi bi-plus-circle-fill fs-2"></i>
                    </a>
                  </div>
                  
                </div>
              </div>`
          )
          .join("");

        carouselInner.innerHTML += `
            <div class="carousel-item py-4 px-1 ${index === 0 ? "active" : ""}">
              <div class="d-md-flex gap-4">${cardsHTML}</div>
            </div>`;
      });



      // Cargar carrusel móvil
      totalPersonajes.forEach((char, index) => {
        carouselInnerMobile.innerHTML += `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
              <div class="card-mobile-item mx-auto card bg-dark text-white flex-grow-1">   
                <img
                  class="imagen-card card-img"
                  src="https://starwars-visualguide.com/assets/img/characters/${IDpersonaje(
                    char.url
                  )}.jpg"
                  alt="${char.name}">
                <div class="card-body p-0">
                  <h5 class="card-title py-2 bg-primary text-dark text-center">${char.name.toLowerCase()}</h5>
                  <div class="card-text p-3">
                    <p><strong>🎬 Películas:</strong> ${char.films.length}</p>
                    <p><strong>📏 Altura:</strong> ${char.height} cm</p>
                    <p><strong>⚖️ Peso:</strong> ${char.mass} kg</p>
                    <p><strong>👁️ Color de ojos:</strong> ${char.eye_color}</p>
                                        <a href="#" class="card-link d-block text-decoration-none text-end">
                      <i class="bi bi-plus-circle-fill fs-2"></i>
                    </a>
                  </div>
                  
                </div>
              </div>
            </div>`;
      });
    })
    .catch((error) => {
      console.error("Error en la carga de personajes:", error);
    });
});
