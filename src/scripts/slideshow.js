let slideIndex = 0; // Definiera slideIndex globalt

function showSlides() {
    const slides = document.getElementsByClassName("mySlides");

    // Döljer alla bilder först
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
        slides[i].classList.remove("fade"); // Ta bort fade-klassen från alla bilder
    }

    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1; // Om vi har passerat sista bilden, gå tillbaka till den första
    }

    // Visa nästa bild och lägg till fade-effekten
    slides[slideIndex - 1].style.display = "block";  
    slides[slideIndex - 1].classList.add("fade");

    // Byt bild var 3:e sekund
    setTimeout(showSlides, 3000); 
}

// Kör showSlides när sidan laddas
window.onload = function() {
    showSlides();
};
