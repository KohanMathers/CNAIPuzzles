const menuLinks = Array.from(document.querySelectorAll('#menu .menu-btn'));

menuLinks.forEach((link, index) => {
    link.style.animationDelay = `${index * 60}ms`;
    link.classList.add('menu-btn-enter');
});

document.addEventListener('keydown', (event) => {
    const index = parseInt(event.key, 10) - 1;
    if (index >= 0 && index < menuLinks.length) {
        menuLinks[index].click();
    }
});
