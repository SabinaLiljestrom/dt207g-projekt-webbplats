document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');  // Hämta token från sessionStorage
    const menuDataDiv = document.getElementById('menuData');
    const menuForm = document.getElementById('menuForm');

    if (!token) {
        // Om ingen token finns, omdirigera till inloggningssidan
        window.location.href = 'login.html';
    }

    fetchMenuItems(); // Hämta och visa menyn

    // Hantera formulärinmatning och skicka POST-förfrågan till servern
    menuForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Förhindra standardformulärets beteende

        // Hämta värdena från formuläret
        const name = document.getElementById('dishName').value;  // Ändra 'name' till 'dishName'
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;

        // Skicka POST-begäran till servern för att skapa ny maträtt
        fetch('http://localhost:3001/api/menu', {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: price
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fel vid skapande av rätt');
            }
            return response.json();
        })
        .then(newDish => {
            alert('Ny rätt har lagts till!');
            menuForm.reset(); // Rensa formuläret
            fetchMenuItems(); // Uppdatera menyn
        })
        .catch(error => {
            console.error('Fel vid skapande av rätt:', error.message);
        });
    });

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
    function displayMenu(menuItems) {
        menuDataDiv.innerHTML = ''; 
        if (menuItems.length === 0) {
            menuDataDiv.textContent = 'Inga rätter tillagda ännu.';
        } else {
            menuItems.forEach(item => {
                const dishElement = document.createElement('div');
                dishElement.classList.add('menu-item');
                dishElement.innerHTML = `
                    <div>
                        <input type="text" value="${item.name}" class="dishName" data-id="${item._id}" />
                        <input type="text" value="${item.description}" class="description" data-id="${item._id}" />
                        <input type="number" value="${item.price}" class="price" data-id="${item._id}" />
                        <button class="save-btn" data-id="${item._id}">Spara</button>
                        <button class="delete-btn" data-id="${item._id}">Ta bort</button>
                    </div>
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

            const saveButtons = document.querySelectorAll('.save-btn');
            saveButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const dishElement = e.target.closest('.menu-item');
                    const dishId = e.target.getAttribute('data-id');
                    const dishName = dishElement.querySelector('.dishName').value;
                    const description = dishElement.querySelector('.description').value;
                    const price = dishElement.querySelector('.price').value;

                    updateDish(dishId, { name: dishName, description, price });
                });
            });
        }
    }

    // Funktion för att uppdatera en maträtt
    function updateDish(dishId, updatedData) {
        fetch(`http://localhost:3001/api/menu/${dishId}`, {
            method: 'PUT',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fel vid uppdatering av rätt');
            }
            return response.json();
        })
        .then(updatedDish => {
            alert('Rätten har uppdaterats!');
            fetchMenuItems(); // Uppdatera menyn efter uppdateringen
        })
        .catch(error => {
            console.error('Fel vid uppdatering av rätt:', error.message);
            alert('Fel vid uppdatering av rätt: ' + error.message);
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
