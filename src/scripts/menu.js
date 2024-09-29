
document.addEventListener('DOMContentLoaded', () => {
    const menuDataDiv = document.getElementById('menuData'); // Elementet där menyobjekten ska visas

    // Anropa funktionen för att hämta menyobjekten när sidan har laddats
    fetchMenuItems();

    // Hämta och visa menyn utan att kräva inloggning
    function fetchMenuItems() {
        fetch('http://localhost:3001/api/menu') // Anropa API-rutten för att hämta menyobjekt
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fel vid hämtning av menyn: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                displayMenu(data); // Anropa funktionen för att visa menyn
            })
            .catch(error => {
                console.error('Fel vid hämtning av menyn:', error.message);
                menuDataDiv.textContent = 'Det gick inte att hämta menyn.';
            });
    }

    // Funktion för att visa menyn
    function displayMenu(menuItems) {
        menuDataDiv.innerHTML = ''; // Rensa tidigare menyobjekt
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
                `;
                menuDataDiv.appendChild(dishElement);
            });
        }
    }
});
