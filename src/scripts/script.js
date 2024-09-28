const mobileMenu = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');

mobileMenu.addEventListener('click', () => {
    navList.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Handle login
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Kontrollera om fälten är ifyllda
        if (!username || !password) {
            alert('Please fill in both username and password');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            // Kontrollera om token finns
            if (data.token) {
                sessionStorage.setItem('token', data.token);
                window.location.replace('protected.html'); // byter till skyddade sidan
            } else if (data.error) {
                alert(data.error); // Om fel finns, visa det
            } else {
                alert('Unknown response from server');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
