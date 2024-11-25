document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content');

    navItems.forEach((navItem, index) => {
        navItem.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = navItem.getAttribute('data-target');

            contentSections.forEach((contentSection) => contentSection.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });
});