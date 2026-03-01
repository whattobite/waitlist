// --- REGISTER GSAP PLUGINS ---
gsap.registerPlugin(ScrollTrigger);

// --- LENIS SMOOTH SCROLL INIT ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: true,
    touchMultiplier: 2,
    wheelMultiplier: 1,
    infinite: false,
});

// Update ScrollTrigger on Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);


// --- INITIAL LOAD TIMELINE ---
window.addEventListener('load', () => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to(".hero-headline", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: 0.2
    })
        .to(".hero-subheadline", {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
        }, "-=1")
        .to(".mini-countdown", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "back.out(1.5)"
        }, "-=0.8")
        .to(".scroll-indicator", {
            opacity: 1,
            duration: 1
       }, "-=0.5")
        .to(".sticky-socials", {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, "-=0.8");

    // Set initial state for sticky socials
    gsap.set(".sticky-socials", { y: 20 });
});


// --- CONTINUOUS FLOATING BACKGROUND SHAPES ---
const bgShapes = document.querySelectorAll('.bg-shape');
bgShapes.forEach((shape, i) => {
    // Unique duration and stagger for organic sine-wave floating
    const duration = 12 + i * 4;

    gsap.to(shape, {
        y: () => (Math.random() * 80 - 40),
        x: () => (Math.random() * 80 - 40),
        rotation: () => (Math.random() * 90 - 45),
        scale: () => (0.9 + Math.random() * 0.3),
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });
});


// --- PARALLAX EFFECT ON SCROLL ---
// Moving background shapes at different speeds compared to foreground
const bgParallaxConfig = [
    { target: ".bg-shape-1", y: 40, scrub: 1 },
    { target: ".bg-shape-2", y: -60, scrub: 1.5 },
    { target: ".bg-shape-3", y: 20, x: -20, scrub: 0.8 },
    { target: ".parallax-layer-1", y: 150, rot: 180, scrub: 0.5 },
    { target: ".parallax-layer-2", y: -120, rot: -90, scrub: 1.2 },
    { target: ".parallax-layer-3", y: 80, x: 50, scrub: 0.9 },
    { target: ".parallax-layer-4", y: -180, rot: 120, scrub: 1.8 }
];

bgParallaxConfig.forEach(config => {
    gsap.to(config.target, {
        yPercent: config.y,
        xPercent: config.x || 0,
        rotation: config.rot || 0,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: config.scrub
        }
    });
});


// --- SCROLLYTELLING LOGIC ---
const storyTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".story-section",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrub
    }
});

// Fade in the background center graphic
storyTl.to(".story-graphic", {
    opacity: 0.8,
    scale: 1.2,
    duration: 1
}, 0);

// Step 1
storyTl.to(".story-step-1", { opacity: 1, y: "-50%", duration: 2 })
    .to(".story-step-1", { opacity: 0, y: "-100%", duration: 2, delay: 1 })
    // Step 2
    .to(".story-step-2", { opacity: 1, y: "-50%", duration: 2 })
    .to(".story-step-2", { opacity: 0, y: "-100%", duration: 2, delay: 1 })
    // Step 3
    .to(".story-step-3", { opacity: 1, y: "-50%", duration: 2 })
    .to(".story-step-3", { opacity: 0, scale: 0.9, duration: 2, delay: 1 });

// Fade out graphic at end of story section
storyTl.to(".story-graphic", {
    opacity: 0,
    scale: 1.5,
    duration: 2
}, "-=2");


// --- SCROLL REVEAL ANIMATIONS ---
gsap.to(".timer-container", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".countdown-section",
        start: "top 75%",
    }
});

gsap.to(".form-container", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".countdown-section",
        start: "top 80%",
    }
});
gsap.to("#local-time-display", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.5,
    scrollTrigger: {
        trigger: ".countdown-section",
        start: "top 80%",
    }
});

// --- COUNTDOWN TIMER LOGIC ---
const launchTarget = new Date('April 19, 2026 12:15:00 GMT+0530'); // Explicitly set to IST (+5:30)
const launchDate = launchTarget.getTime();

// Format the localized string for the user's IP
const localLaunchEl = document.getElementById('local-time-display');
if (localLaunchEl) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    const localizedString = new Intl.DateTimeFormat(navigator.language, options).format(launchTarget);
    localLaunchEl.innerText = `YOUR DIET EVOLVES ON: ${localizedString}`;
}

const flipUpdate = (elId, newValue) => {
    const clock = document.getElementById(elId);
    if (!clock) return;

    const currentVal = clock.getAttribute('data-val');
    if (currentVal === newValue) return;

    clock.setAttribute('data-val', newValue);

    const topSpan = clock.querySelector('.top .flip-num');
    const bottomSpan = clock.querySelector('.bottom .flip-num');

    const spanClasses = topSpan.className; // dynamically inherit text sizing

    // Create Temporary Flaps
    const flipTop = document.createElement('div');
    flipTop.className = 'flip-half flip-top';
    flipTop.innerHTML = `<span class="${spanClasses}">${currentVal}</span>`;

    const flipBottom = document.createElement('div');
    flipBottom.className = 'flip-half flip-bottom';
    flipBottom.innerHTML = `<span class="${spanClasses}">${newValue}</span>`;

    clock.appendChild(flipTop);
    clock.appendChild(flipBottom);

    // Initial Reset
    gsap.set(flipTop, { rotationX: 0 });
    gsap.set(flipBottom, { rotationX: 90 });

    // GSAP Flip Sequence
    const tl = gsap.timeline({
        onComplete: () => {
            bottomSpan.innerText = newValue;
            if (clock.contains(flipTop)) flipTop.remove();
            if (clock.contains(flipBottom)) flipBottom.remove();
        }
    });

    tl.to(flipTop, {
        rotationX: -90,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
            // Update the static background top while flip is half-way down
            topSpan.innerText = newValue;
        }
    })
        .to(flipBottom, {
            rotationX: 0,
            duration: 0.4,
            ease: "bounce.out"
        });
};

function updateTimer() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) {
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM with 3D flip animation for Main Timer
    flipUpdate('clock-days', days.toString().padStart(2, '0'));
    flipUpdate('clock-hours', hours.toString().padStart(2, '0'));
    flipUpdate('clock-minutes', minutes.toString().padStart(2, '0'));
    flipUpdate('clock-seconds', seconds.toString().padStart(2, '0'));

    // Update typical DOM text for Mini Timer
    document.getElementById('mini-clock-days').innerText = days.toString().padStart(2, '0');
    document.getElementById('mini-clock-hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('mini-clock-minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('mini-clock-seconds').innerText = seconds.toString().padStart(2, '0');
}

updateTimer(); // Initial call
setInterval(updateTimer, 1000);

// --- HYPE TYPING EFFECT ---
const hypeLines = [
    "Plating up your cravings in...",
    "Your appetite peaks in...",
    "Serving the beta fresh in...",
    "We're cooking something addictive...",
    "Get your perfect personalised diet in..."
];
const hypeElement = document.getElementById('hype-text');

let lineIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeHype() {
    const currentLine = hypeLines[lineIndex];

    if (isDeleting) {
        hypeElement.innerText = currentLine.substring(0, charIndex - 1);
        charIndex--;
    } else {
        hypeElement.innerText = currentLine.substring(0, charIndex + 1);
        charIndex++;
    }

    // Determine typing speed (Apple smooth style)
    let typeSpeed = isDeleting ? 30 : 60;

    // Pause at end of sentence
    if (!isDeleting && charIndex === currentLine.length) {
        typeSpeed = 2500; // Pause before deleting
        isDeleting = true;
    }
    // Moving to next word after delete
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        lineIndex = (lineIndex + 1) % hypeLines.length;
        typeSpeed = 500; // Pause before typing next word
    }

    // Add slight randomisation to typing speed for human feel
    if (!isDeleting) {
        typeSpeed += Math.random() * 30;
    }

    setTimeout(typeHype, typeSpeed);
}

// Start typing effect slightly after load
setTimeout(typeHype, 1000);

// --- 3D TILT EFFECT FOR TIMER CARDS ---
const timerCards = document.querySelectorAll('.timer-card');
timerCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg
        const rotateY = ((x - centerX) / centerX) * 15;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: "power2.out",
            duration: 0.4
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            ease: "elastic.out(1, 0.3)",
            duration: 1
        });
    });
});


// --- MAGNETIC BUTTON EFFECT ---
const magneticBtn = document.querySelector('.magnetic-btn');

if (magneticBtn) {
    // Desktop interaction
    magneticBtn.addEventListener('mousemove', (e) => {
        const rect = magneticBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Adjust pull strength (lower is softer)
        const pullStrength = 0.3;

        gsap.to(magneticBtn, {
            x: x * pullStrength,
            y: y * pullStrength,
            duration: 0.4,
            ease: "power3.out"
        });

        // Optional: Move text/inner element slightly more for 3D feel
        const btnText = magneticBtn.querySelector('span');
        gsap.to(btnText, {
            x: x * (pullStrength * 0.5),
            y: y * (pullStrength * 0.5),
            duration: 0.4,
            ease: "power3.out"
        });
    });

    magneticBtn.addEventListener('mouseleave', () => {
        gsap.to(magneticBtn, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });

        const btnText = magneticBtn.querySelector('span');
        gsap.to(btnText, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
    });
}

// --- RANDOM FOOTER QUOTE ---
const footerQuotes = [
    "Cooked up with ❤️ by the whattoBite team.",
    "Built for cravings. Designed for overthinkers.",
    "Please don’t lick the screen.",
    "Powered by AI. Seasoned with taste."
];

const footerQuoteEl = document.getElementById('footer-quote');
let footerQuoteIndex = 0;
let footerCharIndex = 0;
let footerIsDeleting = false;

// Randomize starting quote
footerQuoteIndex = Math.floor(Math.random() * footerQuotes.length);

function typeFooter() {
    if (!footerQuoteEl) return;

    const currentFooterLine = footerQuotes[footerQuoteIndex];

    if (footerIsDeleting) {
        footerQuoteEl.innerText = currentFooterLine.substring(0, footerCharIndex - 1);
        footerCharIndex--;
    } else {
        footerQuoteEl.innerText = currentFooterLine.substring(0, footerCharIndex + 1);
        footerCharIndex++;
    }

    let typeSpeed = footerIsDeleting ? 30 : 60;

    if (!footerIsDeleting && footerCharIndex === currentFooterLine.length) {
        typeSpeed = 4000; // Pause longer on footer quote
        footerIsDeleting = true;
    }
    else if (footerIsDeleting && footerCharIndex === 0) {
        footerIsDeleting = false;
        footerQuoteIndex = (footerQuoteIndex + 1) % footerQuotes.length;
        typeSpeed = 500;
    }

    if (!footerIsDeleting) {
        typeSpeed += Math.random() * 30;
    }

    setTimeout(typeFooter, typeSpeed);
}

// Start footer typing
setTimeout(typeFooter, 1500);


// --- FORM SUBMISSION (Visual feedback & Validation & Random Copy) ---
const waitlistForm = document.getElementById('waitlist-form');
const successMsg = document.getElementById('success-msg');
const successMsgText = successMsg ? successMsg.querySelector('span') : null;
const errorMsg = document.getElementById('error-msg');

if (waitlistForm && successMsg && errorMsg) {
    const input = waitlistForm.querySelector('input');
    const buttonText = waitlistForm.querySelector('button span');
    const button = waitlistForm.querySelector('button');

    // Randomize Waitlist Copy
    const placeholders = [
        "Enter your email (no spam, just flavor)...",
        "Where should we send your cravings?",
        "your@email.com (we’ll handle the hunger)",
        "Drop your email. We’ll handle the rest."
    ];

    const buttonOptions = [
        "Save My Seat at the List",
        "Let Me Taste Early",
        "I’m Hungry for Access",
        "Claim My First Bite",
        "Add Me to the Guestlist",
        "Reserve My Craving"
    ];

    const errorOptions = [
        "Oops… that email looks half-baked. Try again?",
        "That crumb doesn’t look right. Double-check the email.",
        "Even our AI can’t read that one.",
        "Hmm... that email is missing some seasoning.",
        "No email? We can't serve a plate to an empty seat!",
        "Something's burnt. That email address doesn't seem right.",
        "Hold up, chef. Your email format is a little undercooked.",
        "We need a real email to send your cravings to!"
    ];

    const successOptions = [
        "Reservation confirmed. 🍽️",
        "You’re officially on the menu.",
        "Welcome to the table. The first bite is coming soon.",
        "You're in. We saved you the best seat."
    ];

    // Apply Random Copy on Load
    input.placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    buttonText.innerText = buttonOptions[Math.floor(Math.random() * buttonOptions.length)];
    errorMsg.innerText = errorOptions[Math.floor(Math.random() * errorOptions.length)];

    // Automatically cycle Placeholder and Button Text every 3.5 seconds
    setInterval(() => {
        // Change placeholder
        const newPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
        if (input.placeholder !== newPlaceholder) {
            input.placeholder = newPlaceholder;
        }

        // Change button text with slight fade
        const newBtnText = buttonOptions[Math.floor(Math.random() * buttonOptions.length)];
        if (buttonText.innerText !== newBtnText) {
            gsap.to(buttonText, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    buttonText.innerText = newBtnText;
                    gsap.to(buttonText, { opacity: 1, duration: 0.3 });
                }
            });
        }
    }, 3500);

    // Stricter Email Validation Regex (ensures standard format like name@domain.com, prevents basic keyboard mashes)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    input.addEventListener('input', () => {
        // Hide error when user starts typing again
        gsap.to(errorMsg, { opacity: 0, duration: 0.2 });
        input.classList.remove('border-rose-500');
    });

    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Custom validation check before success
        if (!emailRegex.test(input.value)) {
            // Randomize error message on every new error to keep it fresh
            errorMsg.innerText = errorOptions[Math.floor(Math.random() * errorOptions.length)];

            // Playful Shake Animation
            gsap.to(input, { x: 5, duration: 0.05, yoyo: true, repeat: 5 });
            gsap.to(errorMsg, { opacity: 1, duration: 0.3 });
            input.classList.add('border-rose-500');
            return;
        }

        // --- INSTANT SUCCESS UI & BACKGROUND SUPABASE ---
        const originalBtnText = buttonText.innerText;

        // Randomize success message instantly
        const successMsgText = document.getElementById('success-text-span');
        const successIcon = document.getElementById('success-icon');
        if (successMsgText) {
            successMsgText.innerText = successOptions[Math.floor(Math.random() * successOptions.length)];
        }

        // Fire and Forget Supabase Insert
        const submitToSupabase = async (emailToSave) => {
            try {
                const supabaseUrl = 'https://pblfwbmxeupqqtqfkver.supabase.co';
                const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBibGZ3Ym14ZXVwcXF0cWZrdmVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNDYwMDUsImV4cCI6MjA4NzkyMjAwNX0.XwefhMPN9VWsXLT2C1yfglFa15gygOWRCXhgzX_cpis';
                const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

                await supabase.from('waitlist').insert([{ email: emailToSave }]);
            } catch (err) {
                console.error("Supabase Background Error:", err);
            }
        };

        submitToSupabase(input.value);

        // Instant Button click feedback & Beautiful Success Overlay
        gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                input.value = '';
                successMsg.style.pointerEvents = 'auto'; // Block interaction with form

                // Animate overlay in
                gsap.to(successMsg, {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });

                // Pop the icon
                if (successIcon) {
                    gsap.to(successIcon, {
                        scale: 1,
                        duration: 0.6,
                        delay: 0.1,
                        ease: "back.out(2)"
                    });
                }

                // Hide success message after 4 seconds
                setTimeout(() => {
                    gsap.to(successMsg, {
                        opacity: 0,
                        duration: 0.4,
                        ease: "power3.in",
                        onComplete: () => {
                            successMsg.style.pointerEvents = 'none';
                            if (successIcon) gsap.set(successIcon, { scale: 0 }); // reset icon
                        }
                    });
                }, 4000);
            }
        });

    });
}
