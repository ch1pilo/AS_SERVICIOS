// animacion.js - Versión corregida y optimizada

// Función para determinar cuántos ítems mostrar según el ancho de pantalla
function getItemsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

// Función para desplazamiento suave al hacer clic en enlaces del menú
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Script para el carrusel de proyectos
function initCarousel() {
    const carousel = document.querySelector('.carousel-container');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carousel || items.length === 0) return; // Si no existe el carrusel, salir
    
    let currentIndex = 0;
    let itemsPerView = getItemsPerView();
    let autoPlayInterval;
    
    // Crear puntos indicadores
    items.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Función para actualizar el carrusel
    function updateCarousel() {
        const itemWidth = items[0].offsetWidth + 40;
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Ir a slide específico
    function goToSlide(index) {
        if (index >= items.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = items.length - 1;
        } else {
            currentIndex = index;
        }
        updateCarousel();
    }
    
    // Navegación manual
    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
    });
    
    // Función para el autoplay
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 4000);
    }
    
    // Función para reiniciar el autoplay
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    // Pausar autoplay al pasar el ratón por encima
    const carouselElement = document.querySelector('.projects-carousel');
    carouselElement.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    carouselElement.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
    
    // Redimensionar ventana
    window.addEventListener('resize', () => {
        itemsPerView = getItemsPerView();
        updateCarousel();
    });
    
    // Iniciar carrusel y autoplay
    updateCarousel();
    startAutoPlay();
}

// Script mejorado para el preloader (una sola implementación)
function initPreloader() {
    let pageLoaded = false;
    let minTimeElapsed = false;
    
    // Marcar cuando la página termine de cargar
    window.addEventListener('load', () => {
        pageLoaded = true;
        hidePreloaderIfReady();
    });
    
    // Marcar después de 3 segundos mínimo
    setTimeout(() => {
        minTimeElapsed = true;
        hidePreloaderIfReady();
    }, 3000);
    
    function hidePreloaderIfReady() {
        if (pageLoaded && minTimeElapsed) {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.classList.add('hidden');
                
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.remove('loading');
                }, 500);
            }
        }
    }
}

// Script para el menú hamburguesa
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace (solo para móviles)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
}

// Script para el efecto de scroll en la navbar
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

// Inicializar todo cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Año en el footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Inicializar componentes
    initSmoothScrolling();
    initCarousel();
    initPreloader();
    initHamburgerMenu();
    initNavbarScroll();
    initWhatsAppForm(); // ← AÑADE ESTA LÍNEA

});

// Efecto de escritura opcional (descomenta si lo quieres usar)
/*
function initTypingEffect() {
    const typingTextElement = document.getElementById('typing-text');
    if (!typingTextElement) return;
    
    const textToType = "Impulsando tu Startup con Tecnología";
    let i = 0;
    
    function typeWriter() {
        if (i < textToType.length) {
            typingTextElement.innerHTML += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    typeWriter();
}
// Llamar a la función en DOMContentLoaded si la quieres usar
*/

// Función para enviar formulario a WhatsApp
// Función para enviar formulario a WhatsApp (VERSIÓN CORREGIDA Y SEGURA)
function initWhatsAppForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.log('Formulario no encontrado');
        return;
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario de forma segura
        const getName = () => {
            const element = document.getElementById('name');
            return element ? element.value.trim() : '';
        };
        
        const getMessage = () => {
            const element = document.getElementById('message');
            return element ? element.value.trim() : '';
        };
        
        const getPhone = () => {
            const element = document.getElementById('phone');
            return element ? element.value.trim() : '';
        };
        
        const name = getName();
        const message = getMessage();
        const phone = getPhone();
        
        // Validaciones básicas
        if (!name || !message) {
            alert('Por favor, completa los campos obligatorios: Nombre, Email y Mensaje');
            return;
        }
           
        // Crear mensaje para WhatsApp
        let whatsappMessage = `*Nuevo mensaje desde AS.Desarrolladores:*%0A%0A`;
        whatsappMessage += `*Nombre:* ${name}%0A`;
        if (phone) whatsappMessage += `*Teléfono:* ${phone}%0A`;
        whatsappMessage += `*Mensaje:*%0A${message}`;
        
        // Número de WhatsApp - REEMPLAZA CON TU NÚMERO
        const whatsappNumber = '584246018457'; // Ejemplo: número de Venezuela
        
        // Crear URL de WhatsApp
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
        
        // Abrir en nueva pestaña
        window.location.href = whatsappURL;
        
        // Mostrar mensaje de confirmación
        alert('¡Gracias por tu mensaje! Serás redirigido a WhatsApp para completar el envío.');
        
        // Limpiar formulario
        contactForm.reset();
    });
}