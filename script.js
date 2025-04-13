document.addEventListener('DOMContentLoaded', () => {

    const heroSection = document.querySelector('.dynamic-hero');

    // --- 1. Tipografia Cinética ---
    const kineticTitle = document.querySelector('.kinetic-title');
    if (kineticTitle) {
        const text = kineticTitle.textContent.trim();
        kineticTitle.textContent = '';
        kineticTitle.style.opacity = '1';

        let delay = 0;
        text.split('').forEach((char) => {
            const span = document.createElement('span');
            span.innerHTML = char === ' ' ? '&nbsp;' : char;

            // Não animar espaços em branco, mas manter o delay
            if (char !== ' ') {
                span.style.animationDelay = `${delay}s`;
                delay += 0.04; // Ajuste a velocidade do escalonamento aqui
            } else {
                 // Adiciona um pequeno delay extra para espaços, se desejar, ou mantém o fluxo
                 delay += 0.02;
            }

            kineticTitle.appendChild(span);
        });
    }

    // --- 2. Ativar Animações de Fade/Pop Iniciais (Hero) ---
    // Usaremos Intersection Observer aqui também para consistência
    const heroContent = document.querySelector('.dynamic-hero .content');
    const initialObserverOptions = { threshold: 0.1 }; // Pouco visível já ativa

    const initialObserverCallback = (entries, observer) => {
         entries.forEach(entry => {
            if (entry.isIntersecting) {
                 // Seleciona apenas os elementos fade/pop DENTRO do hero content
                const elementsToAnimate = entry.target.querySelectorAll('.fade-in, .pop-in');
                 elementsToAnimate.forEach(el => el.classList.add('is-visible'));
                 observer.unobserve(entry.target); // Anima só uma vez
            }
        });
    };

    const initialObserver = new IntersectionObserver(initialObserverCallback, initialObserverOptions);
    if (heroContent) {
        initialObserver.observe(heroContent);
    }


    // --- 3. Interação com Mouse (Hero Section) ---
    const reactiveElements = document.querySelectorAll('.mouse-reactive');
    const handleMouseMove = (event) => {
        if (!heroSection) return;
        const rect = heroSection.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const normalizedX = (mouseX - centerX) / centerX;
        const normalizedY = (mouseY - centerY) / centerY;

        reactiveElements.forEach(el => {
            const strength = parseFloat(el.dataset.mouseStrength || '10');
            const moveX = normalizedX * strength;
            const moveY = normalizedY * strength;
            el.style.transform = `translate(${moveX}px, ${moveY}px) translateZ(0)`;
        });
    };
    if (heroSection) {
        // Otimização: Apenas adiciona se não for touch device (melhora performance mobile)
        if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
            heroSection.addEventListener('mousemove', handleMouseMove);
        }
    }


    // --- 4. Elementos que Rolam com Scroll ---
    const scrollRollers = document.querySelectorAll('.scroll-roller');
    const handleScroll = () => {
        const scrollY = window.scrollY;

        scrollRollers.forEach(el => {
            const speed = parseFloat(el.dataset.scrollSpeed || '0');
            const rotationFactor = parseFloat(el.dataset.scrollRotate || '0');
            const moveY = -(scrollY * speed * 0.8);
            const rotation = scrollY * rotationFactor;
            el.style.transform = `translateY(${moveY}px) rotate(${rotation}deg) translateZ(0)`;
        });
    };

    // Otimização com requestAnimationFrame para o scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    handleScroll(); // Posição inicial


    // --- 5. Animação de Revelar Seções ao Rolar ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserverOptions = {
        root: null, // Viewport
        rootMargin: '0px',
        threshold: 0.15 // 15% visível para ativar
    };

    const revealObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Opcional: parar de observar após animar uma vez
                observer.unobserve(entry.target);
            }
            // Se quiser que anime toda vez que entra/sai, remova o unobserve e adicione:
            // else {
            //     entry.target.classList.remove('is-visible');
            // }
        });
    };

    const revealObserver = new IntersectionObserver(revealObserverCallback, revealObserverOptions);
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});

