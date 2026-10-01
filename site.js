/* ============================================================
   David Gonzùlez ù utilidades comunes
   ù Lightbox compartido (inyectado, con pie de foto y Esc)
   ù Estado "pùgina actual" en la navegaciùn
   ù Marca <html class="touch"> en dispositivos tùctiles
   ============================================================ */
(function () {
    'use strict';

    var DG = window.DG = window.DG || {};

    /* ---------- Lightbox ---------- */
    var box, img, cap, closeBtn, lastFocus;

    function ensure() {
        if (box) return;
        box = document.createElement('div');
        box.className = 'lightbox';
        box.id = 'lightbox';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.setAttribute('aria-label', 'Imagen ampliada');
        box.innerHTML =
            '<button type="button" class="lightbox-close" aria-label="Cerrar">Cerrar<kbd>Esc</kbd></button>' +
            '<figure><img alt=""><figcaption></figcaption></figure>';
        document.body.appendChild(box);

        img = box.querySelector('img');
        cap = box.querySelector('figcaption');
        closeBtn = box.querySelector('.lightbox-close');

        box.addEventListener('click', function (e) {
            if (e.target !== img) close();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && box.classList.contains('active')) close();
        });
    }

    function open(src, caption) {
        if (!src) return;
        ensure();
        lastFocus = document.activeElement;
        img.src = src;
        img.alt = caption || '';
        cap.textContent = caption || '';
        box.classList.add('active');
        document.body.classList.add('lightbox-open');
        closeBtn.focus({ preventScroll: true });
        document.dispatchEvent(new CustomEvent('dg:lightbox-open'));
    }

    function close() {
        if (!box || !box.classList.contains('active')) return;
        box.classList.remove('active');
        document.body.classList.remove('lightbox-open');
        document.dispatchEvent(new CustomEvent('dg:lightbox-close'));
        setTimeout(function () {
            if (!box.classList.contains('active')) img.removeAttribute('src');
        }, 350);
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    DG.lightbox = { open: open, close: close };

    /* Enlace automùtico: cualquier elemento con data-lightbox o data-lightbox-src */
    document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-lightbox], [data-lightbox-src]');
        if (!t || t.closest('a')) return;
        var im = t.tagName === 'IMG' ? t : t.querySelector('img');
        var src = t.getAttribute('data-lightbox-src') || (im ? (im.currentSrc || im.src) : '');
        if (!src) return;
        e.preventDefault();
        open(src, t.getAttribute('data-caption') || (im && im.alt) || '');
    });

    /* ---------- Pùgina actual en el menù ---------- */
    var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a, .hero-nav a').forEach(function (a) {
        var href = (a.getAttribute('href') || '').split(/[?#]/)[0].toLowerCase();
        if (href && href === current) a.setAttribute('aria-current', 'page');
    });

    /* ---------- Tùctil ---------- */
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
        document.documentElement.classList.add('touch');
    }
})();
