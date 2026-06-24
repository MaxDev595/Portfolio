tsParticles.load("tsparticles", {
    background: {
        color: "#0d0d0d"
    },
    particles: {
        number: { value: 80 },
        color: { value: "#ffffff" },
        links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4
        },
        move: {
            enable: true,
            speed: 2
        }
    },
    interactivity: {
        detectsOn: "window",
        events: {
            onHover: {
                enable: true,
                mode: "grab"
            }
        },
        modes: {
            grab: {
                distance: 200,
                links: { opacity: 1 }
            }
        }
    }
}).then(container => {
    const hero = document.querySelector('#home');
    const canvas = document.querySelector('#tsparticles canvas');

    // Реакция на курсор только внутри hero
    document.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const insideHero = (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        );

        if (!insideHero) {
            container.interactivity.mouse.position = undefined;
            container.interactivity.status = "mouseleave";
        }
    });

    // Когда hero скрылся — замедляем, уменьшаем количество и затемняем
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            canvas.style.transition = "opacity 0.8s ease";
            if (entry.isIntersecting) {
                canvas.style.opacity = "1";
                container.options.particles.number.value = 80;
                container.options.particles.move.speed = 2;
            } else {
                canvas.style.opacity = "0";
                container.options.particles.number.value = 25;
                container.options.particles.move.speed = 0.4;
            }
        });
    }, { threshold: 0.05 });

    heroObserver.observe(hero);
});


//NAVIGATION//

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.ul-nav a');

const observer = new IntersectionObserver((entries) => {
    const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries.length > 0) {
        navLinks.forEach(link => link.classList.remove('active'));
        const id = visibleEntries[0].target.getAttribute('id');
        const activeLink = document.querySelector(`.ul-nav a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
}, {
    threshold: [0.25, 0.5, 0.75]
});

sections.forEach(section => observer.observe(section));