document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    const menuDataDiv = document.getElementById('menuData');

    if (!token) {
        window.location.href = 'login.html';
    } else {
        // Hämta och visa alla rätter från databasen
        fetch('http://localhost:3001/api/menu', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            displayMenu(data);
        })
        .catch(error => {
            console.error('Fel vid hämtning av menyn:', error.message);
        });
    }

    // Funktion för att visa menyn och lägga till "ta bort"-knappar
    function displayMenu(menuItems) {
        menuDataDiv.innerHTML = ''; // Rensa gamla data
        if (menuItems.length === 0) {
            menuDataDiv.textContent = 'Inga rätter tillagda ännu.';
        } else {
            menuItems.forEach(item => {
                const dishElement = document.createElement('div');
                dishElement.classList.add('menu-item');
                dishElement.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>Pris: ${item.price} kr</p>
                    <button class="delete-btn" data-id="${item._id}">Ta bort</button>
                `;
                menuDataDiv.appendChild(dishElement);
            });

            // Lägg till event listeners för varje "ta bort"-knapp
            const deleteButtons = document.querySelectorAll('.delete-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const dishId = e.target.getAttribute('data-id');
                    deleteDish(dishId);
                });
            });
        }
    }

    // Funktion för att ta bort en rätt
    function deleteDish(dishId) {
        fetch(`http://localhost:3001/api/menu/${dishId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Rätten har tagits bort');
                // Hämta menyn på nytt efter att rätten tagits bort
                return fetch('http://localhost:3001/api/menu', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } else {
                throw new Error('Fel vid borttagning av rätt');
            }
        })
        .then(response => response.json())
        .then(data => {
            displayMenu(data); // Uppdatera menyn efter borttagningen
        })
        .catch(error => {
            console.error('Fel vid borttagning av rätt:', error.message);
        });
    }

    // Lägg till ny rätt via formuläret
    const menuForm = document.getElementById('menuForm');
    menuForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newDish = {
            name: document.getElementById('dishName').value,
            description: document.getElementById('description').value,
            price: document.getElementById('price').value
        };

        fetch('http://localhost:3001/api/menu', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDish)
        })
        .then(response => response.json())
        .then(addedDish => {
            displayMenu([...document.getElementById('menuData').children, addedDish]);
            menuForm.reset(); // Återställ formuläret
        })
        .catch(error => {
            console.error('Fel vid tillägg av rätt:', error.message);
        });
    });

    // Logga ut och ta bort token
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});
