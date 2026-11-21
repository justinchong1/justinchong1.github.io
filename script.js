function initRecognitionCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = track ? track.querySelectorAll('.recognition-card') : [];
    const previous = document.querySelector('.carousel-prev');
    const next = document.querySelector('.carousel-next');
    const status = document.querySelector('.carousel-status');

    if (!track || cards.length === 0 || !previous || !next || !status) {
        return;
    }

    let currentIndex = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    status.textContent = `1 / ${cards.length}`;
    previous.disabled = true;
    next.disabled = cards.length === 1;

    function showCard(index) {
        currentIndex = Math.max(0, Math.min(index, cards.length - 1));
        track.scrollTo({
            left: cards[currentIndex].offsetLeft - track.offsetLeft,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
        status.textContent = `${currentIndex + 1} / ${cards.length}`;
        previous.disabled = currentIndex === 0;
        next.disabled = currentIndex === cards.length - 1;
    }

    previous.addEventListener('click', () => showCard(currentIndex - 1));
    next.addEventListener('click', () => showCard(currentIndex + 1));
}

function initMobileNavigation() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('#primary-navigation');

    if (!toggle || !menu) {
        return;
    }

    function setMenuOpen(isOpen, restoreFocus = false) {
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        menu.classList.toggle('is-open', isOpen);

        if (restoreFocus) {
            toggle.focus();
        }
    }

    toggle.addEventListener('click', () => {
        setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', event => {
        const target = event.target;
        if (!(target instanceof HTMLAnchorElement)) {
            return;
        }

        const wasKeyboardFocused = document.activeElement === target;
        const section = document.getElementById(target.hash.slice(1));
        const heading = section ? section.querySelector('h2') : null;
        setMenuOpen(false);

        if (wasKeyboardFocused && heading) {
            window.requestAnimationFrame(() => heading.focus({ preventScroll: true }));
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false, true);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 600 && toggle.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initRecognitionCarousel();
    initMobileNavigation();
});
