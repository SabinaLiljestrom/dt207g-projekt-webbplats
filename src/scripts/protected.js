document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html'; // Om ingen token finns, omdirigera till inloggningssidan
    } else {
        fetch('http://localhost:3001/api/protected', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Skicka med token som en del av headers
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Åtkomst nekad');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('protected-data').textContent = data.message;
        })
        .catch(error => {
            console.error('Fel vid hämtning av skyddade data:', error.message);
            window.location.href = 'login.html'; // Omdirigera om åtkomst nekas
        });
    }

    // Logga ut och ta bort token från localStorage
    document.getElementById('logout').addEventListener('click', () => {
        sessionStorage.removeItem('token');
        window.location.href = 'login.html'; // Omdirigera till inloggningssidan
    });
});
