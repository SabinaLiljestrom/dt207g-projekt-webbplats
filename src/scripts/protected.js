document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');  // Hämta token från sessionStorage
    const menuDataDiv = document.getElementById('menuData');
    const menuForm = document.getElementById('menuForm');

    if (!token) {
        // Om ingen token finns, omdirigera till inloggningssidan
        window.location.href = 'login.html';
    }

    fetchMenuItems(); // Hämta och visa menyn

    // Funktion för att hämta och visa alla rätter
    function fetchMenuItems() {
        fetch('http://localhost:3001/api/menu', {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fel vid hämtning av menyn: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            displayMenu(data);  
        })
        .catch(error => {
            console.error('Fel vid hämtning av menyn:', error.message);
        });
    }

    // Funktion för att visa menyn och göra maträtter redigerbara
 // Funktion för att visa menyn och lägga till redigera/borttag-knappar
function displayMenu(menuItems) {
    menuDataDiv.innerHTML = ''; // Rensa tidigare innehåll
    if (menuItems.length === 0) {
        menuDataDiv.textContent = 'Inga rätter tillagda ännu.';
    } else {
        menuItems.forEach(item => {
            // Skapa ett nytt element för varje maträtt
            const dishElement = document.createElement('div');
            dishElement.classList.add('menu-item');
            dishElement.innerHTML = `
                <input type="text" class="dish-name" value="${item.name}" data-id="${item._id}" />
                <input type="text" class="dish-description" value="${item.description}" />
                <input type="number" class="dish-price" value="${item.price}" />
                <button class="edit-btn" data-id="${item._id}">Spara</button>
                <button class="delete-btn" data-id="${item._id}">Ta bort</button>
            `;
            menuDataDiv.appendChild(dishElement);
        });

        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const dishId = e.target.getAttribute('data-id');
                deleteDish(dishId);
            });
        });

        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const dishId = e.target.getAttribute('data-id');
                const nameInput = e.target.parentElement.querySelector('.dish-name');
                const descriptionInput = e.target.parentElement.querySelector('.dish-description');
                const priceInput = e.target.parentElement.querySelector('.dish-price');

                // Anropa updateDish-funktionen med de nya värdena
                updateDish(dishId, nameInput.value, descriptionInput.value, priceInput.value);
            });
        });
    }
}

// Funktion för att uppdatera en maträtt
function updateDish(dishId, name, description, price) {
    fetch(`http://localhost:3001/api/menu/${dishId}`, {
        method: 'PUT',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, price })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Fel vid uppdatering av rätten');
        }
        return response.json();
    })
    .then(updatedDish => {
        alert('Rätten har uppdaterats!');
        fetchMenuItems(); // Hämta menyn igen för att uppdatera vyn
    })
    .catch(error => {
        console.error('Fel vid uppdatering av rätt:', error.message);
    });
}


    // Funktion för att ta bort en rätt
    function deleteDish(dishId) {
        fetch(`http://localhost:3001/api/menu/${dishId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Rätten har tagits bort');
                fetchMenuItems(); // Uppdatera menyn efter borttagningen
            } else {
                throw new Error('Fel vid borttagning av rätt');
            }
        })
        .catch(error => {
            console.error('Fel vid borttagning av rätt:', error.message);
        });
    }

    // Logga ut och ta bort token
    document.getElementById('logout')?.addEventListener('click', () => {
        sessionStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});
