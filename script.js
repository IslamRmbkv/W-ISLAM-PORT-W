document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Приветствие и кнопка "Introduce yourself" ---
    const greetingElement = document.getElementById('greeting');
    const askNameBtn = document.getElementById('askName');

    function showGreeting(name) {
        if (!greetingElement) return; 
        
        greetingElement.textContent = '';
        if (window.greetingTypewriterTimeouts) {
            window.greetingTypewriterTimeouts.forEach(clearTimeout);
        }
        window.greetingTypewriterTimeouts = [];

        const text = name ? `Hello, ${name}!` : 'Welcome!';
        
        function typeWriter(str, i) {
            if (i <= str.length) {
                greetingElement.textContent = str.slice(0, i);
                const timeout = setTimeout(() => typeWriter(str, i + 1), 60);
                window.greetingTypewriterTimeouts.push(timeout);
            }
        }
        typeWriter(text, 0);
    }
    
    showGreeting(localStorage.getItem('visitorName'));

    if (askNameBtn) {
        askNameBtn.addEventListener('click', () => {
            const name = prompt('What is your name?');
            if (name) {
                localStorage.setItem('visitorName', name);
            } else {
                localStorage.removeItem('visitorName');
            }
            showGreeting(localStorage.getItem('visitorName'));
        });
    }

    // --- 2. Бургер-меню ---
    const burger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');

    if (burger && menu) {
        burger.addEventListener('click', () => {
            menu.classList.toggle('open');
            burger.classList.toggle('active');

            const isExpanded = menu.classList.contains('open');
            burger.setAttribute('aria-expanded', String(isExpanded));
        });

        const links = menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                burger.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- 3. Кнопка "Наверх" и Плавная прокрутка ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        const SHOW_AFTER = 300; 

        window.addEventListener('scroll', () => {
            if (window.scrollY > SHOW_AFTER) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // --- 4. Кастомный курсор (только для устройств с мышью) ---
    if (window.matchMedia && window.matchMedia('(pointer: fine) and (hover: hover)').matches) {
        const cursor = document.getElementById('customCursor');
        if (cursor) {
            let mouseX = 0, mouseY = 0;
            let rafId;

            const update = () => {
                cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
                rafId = requestAnimationFrame(update);
            };

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                if (!rafId) update();
            });

            const interactive = 'a, button, .btn, input, textarea, label';
            document.querySelectorAll(interactive).forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('cursor-large'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-large'));
                el.addEventListener('mousedown', () => cursor.classList.add('cursor-action'));
                el.addEventListener('mouseup', () => cursor.classList.remove('cursor-action'));
            });

            document.addEventListener('mouseenter', () => cursor.classList.remove('cursor-hidden'));
            document.addEventListener('mouseleave', () => cursor.classList.add('cursor-hidden'));
        }
    }

    // --- 5. Обработка формы обратной связи (Formspree) ---
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            
            const data = {
                name: form.querySelector('input[name="name"]').value,
                email: form.querySelector('input[name="email"]').value,
                message: form.querySelector('textarea[name="message"]').value
            };

            if (!data.name || !data.email || !data.message) {
                alert('Пожалуйста, заполните все обязательные поля.');
                return; 
            }

            fetch('https://formspree.io/f/xnngwrwq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Ошибка сети или сервера.');
            })
            .then(result => {
                alert('Спасибо! Ваше сообщение отправлено.');
                form.reset(); 
            })
            .catch(error => {
                console.error('Ошибка при отправке:', error);
                alert('К сожалению, произошла ошибка. Пожалуйста, попробуйте снова.');
            });
        });
    }
});