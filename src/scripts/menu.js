document.addEventListener('DOMContentLoaded', () => {
    const menuDataDiv = document.getElementById('menuData'); // Elementet där menyobjekten ska visas
    const orderListDiv = document.getElementById('orderList'); // Element för att visa varukorgen
    let cart = []; // Varukorg för att lagra valda menyobjekt

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
                populateDropdown(data); // Fyll dropdown-menyn med menyobjekt
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

    // Funktion för att fylla dropdown-menyn med menyobjekt
    function populateDropdown(menuItems) {
        const menuDropdown = document.getElementById('menuDropdown');
        menuDropdown.innerHTML = ''; // Rensa tidigare alternativ

        menuItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.name;
            option.textContent = `${item.name} - ${item.price} kr`;
            menuDropdown.appendChild(option);
        });
    }

    // Funktion för att lägga till valda objekt till varukorgen
    document.getElementById("addToCart").addEventListener("click", function(event) {
        event.preventDefault();
        
        let menuItem = document.getElementById("menuDropdown").value;
        let quantity = document.getElementById("quantity").value;

        if (menuItem && quantity > 0) {
            // Lägg till objekt i korgen
            cart.push({
                menuItem: menuItem,
                quantity: quantity
            });

            // Uppdatera varukorgslistan
            updateOrderList();
        } else {
            alert('Välj ett menyobjekt och ett giltigt antal.');
        }
    });

    // Funktion för att visa varukorgen
    function updateOrderList() {
        orderListDiv.innerHTML = ''; // Rensa tidigare lista
        cart.forEach((item, index) => {
            const listItem = document.createElement('div');
            listItem.classList.add('order-item');
            listItem.innerHTML = `
                <p>${item.quantity}x ${item.menuItem}</p>
                <button class="remove-item" data-index="${index}">Ta bort</button>
            `;
            orderListDiv.appendChild(listItem);
        });

        // Lägg till funktion för att ta bort objekt från korgen
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                cart.splice(index, 1); // Ta bort objekt från korgen
                updateOrderList(); // Uppdatera listan
            });
        });
    }

    // Hantera beställningsformulär
    document.getElementById("orderForm").addEventListener("submit", function(event){
        event.preventDefault();

        if (cart.length === 0) {
            alert('Din varukorg är tom. Lägg till varor innan du skickar beställningen.');
            return;
        }

        let name = document.getElementById("name").value;
        let phone = document.getElementById("phone").value;
        let pickupTime = document.getElementById("pickupTime").value;

        // Skapa en översikt över varukorgen
        let orderDetails = cart.map(item => `${item.quantity}x ${item.menuItem}`).join(', ');

        // Visa bekräftelsemeddelande
        alert(`Tack, ${name}! Din beställning på ${orderDetails} är mottagen. Var god hämta din beställning kl ${pickupTime}.`);

        // Töm formuläret och varukorgen
        document.getElementById("orderForm").reset();
        cart = [];
        updateOrderList();
    });
});
