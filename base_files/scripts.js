document.addEventListener('DOMContentLoaded', () => {
    const placeId = getPlaceIdFromURL();
    const token = getCookie('token');
    const isAuthenticated = !!token; // Booleano que indica si el usuario está autenticado

    // Verifica la autenticación y muestra u oculta el formulario de reseñas
    checkAuthentication(isAuthenticated);

    // Obtiene los detalles del lugar desde la API
    fetchPlaceDetails(token, placeId);
});

/**
 * Obtiene el ID del lugar desde los parámetros de la URL.
 * @returns {string} El ID del lugar.
 */
function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('placeId'); // Suponiendo que el ID del lugar está en un parámetro llamado 'placeId'
}

/**
 * Obtiene el valor de una cookie por nombre.
 * @param {string} name - El nombre de la cookie.
 * @returns {string} El valor de la cookie.
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Asegura que se devuelva null si la cookie no se encuentra
}

/**
 * Muestra u oculta el formulario de reseñas basado en la autenticación.
 * @param {boolean} isAuthenticated - Booleano que indica si el usuario está autenticado.
 */
function checkAuthentication(isAuthenticated) {
    const addReviewButton = document.getElementById('add-review-button');
    const addReviewForm = document.getElementById('add-review-form');
    
    if (isAuthenticated) {
        addReviewButton.style.display = 'none';
        addReviewForm.style.display = 'block';
    } else {
        addReviewButton.style.display = 'block';
        addReviewForm.style.display = 'none';
    }
}

/**
 * Obtiene los detalles del lugar desde la API y los muestra.
 * @param {string} token - El token de autenticación del usuario.
 * @param {string} placeId - El ID del lugar.
 */
async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`https://api.example.com/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }

        const place = await response.json();
        displayPlaceDetails(place);

        if (place.reviews) {
            displayReviews(place.reviews);
        }
    } catch (error) {
        console.error('Error al obtener los detalles del lugar:', error);
    }
}

/**
 * Muestra los detalles del lugar en la interfaz.
 * @param {object} place - El objeto que contiene los detalles del lugar.
 */
function displayPlaceDetails(place) {
    document.getElementById('place-image-large').src = place.imageUrl;
    document.getElementById('place-name').textContent = place.name;
    document.getElementById('place-description').textContent = place.description;
    document.getElementById('place-location').textContent = `Ubicación: ${place.location}`;
    document.getElementById('place-price').textContent = `Precio: ${place.price}`;
    
    const amenitiesList = document.getElementById('place-amenities');
    amenitiesList.innerHTML = '';
    place.amenities.forEach(amenity => {
        const listItem = document.createElement('li');
        listItem.textContent = amenity;
        amenitiesList.appendChild(listItem);
    });
}

/**
 * Muestra las reseñas del lugar en la interfaz.
 * @param {Array} reviews - El array de reseñas.
 */
function displayReviews(reviews) {
    const reviewsSection = document.getElementById('reviews-section');
    reviewsSection.innerHTML = '';
    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <h3>${review.userName}</h3>
            <p>${review.comment}</p>
            <p>Calificación: ${'⭐'.repeat(review.rating)}</p>
        `;
        reviewsSection.appendChild(reviewCard);
    });
}
