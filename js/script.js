document.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggler) {
        navbarToggler.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });
    }

    // Language toggle functionality (basic example)
    const langEn = document.getElementById('lang-en');
    const langHi = document.getElementById('lang-hi');

    if (langEn && langHi) {
        langEn.addEventListener('click', () => {
            setLanguage('en');
        });

        langHi.addEventListener('click', () => {
            setLanguage('hi');
        });
    }

    function setLanguage(lang) {
        // In a real application, you would use a library like i18next
        // to handle translations. This is a simplified example.
        if (lang === 'hi') {
            document.documentElement.lang = 'hi';
            langHi.classList.add('active');
            langEn.classList.remove('active');
            // You would then update the text content of elements
            document.querySelector('.hero-title').textContent = 'एक बेहतर भविष्य का निर्माण, एक साथ';
            document.querySelector('.hero-subtitle').textContent = 'समुदायों को सशक्त बनाने और स्थायी परिवर्तन लाने के हमारे मिशन में नव युग निर्माण फाउंडेशन से जुड़ें।';
        } else {
            document.documentElement.lang = 'en';
            langEn.classList.add('active');
            langHi.classList.remove('active');
            document.querySelector('.hero-title').textContent = 'Building a Better Future, Together';
            document.querySelector('.hero-subtitle').textContent = 'Join the Nav Yug Nirman Foundation in our mission to empower communities and create lasting change.';
        }
    }

    // Animated impact statistics
    const counters = document.querySelectorAll('.count');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;

                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };

            updateCount();
        });
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const impactSection = document.getElementById('impact');
    if (impactSection) {
        observer.observe(impactSection);
    }

    // Donation Page
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
        const amountButtons = document.querySelectorAll('.btn-amount');
        const customAmountInput = document.getElementById('custom-amount');
        const impactMessage = document.getElementById('impact-message');

        amountButtons.forEach(button => {
            button.addEventListener('click', () => {
                amountButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                customAmountInput.value = '';
                updateImpactMessage(button.dataset.amount);
            });
        });

        customAmountInput.addEventListener('input', () => {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            updateImpactMessage(customAmountInput.value);
        });

        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real application, you would integrate with a payment gateway here.
            showToast('Thank you for your generous donation!');
            donationForm.reset();
            amountButtons.forEach(btn => btn.classList.remove('active'));
            impactMessage.textContent = '';
        });

        function updateImpactMessage(amount) {
            let message = '';
            if (amount >= 5000) {
                message = 'This can provide a full month of educational supplies for a child.';
            } else if (amount >= 2000) {
                message = 'This can fund a health check-up for a family.';
            } else if (amount >= 1000) {
                message = 'This can provide a week of nutritious meals for a student.';
            } else if (amount >= 500) {
                message = 'This can provide essential school supplies for a child.';
            }
            impactMessage.textContent = message;
        }
    }

    // Membership Page
    const membershipForm = document.getElementById('membership-form');
    if (membershipForm) {
        membershipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real application, you would handle form submission, payment, and ID card generation here.
            showToast('Thank you for registering! We will contact you shortly.');
            membershipForm.reset();
        });
    }

    // Events Page
    const eventsPage = document.querySelector('#upcoming-events');
    if (eventsPage) {
        const upcomingEventsContainer = document.querySelector('#upcoming-events .event-list');
        const pastEventsContainer = document.querySelector('#past-events .event-gallery');
        const categoryFilter = document.getElementById('category-filter');
        const dateFilter = document.getElementById('date-filter');
        const modal = document.getElementById('register-modal');
        const closeButton = document.querySelector('.close-button');
        const registerForm = document.getElementById('register-form');
        const eventNameInput = document.getElementById('event-name');

        const events = [
            { name: 'Community Cleanup', date: '2025-09-15', category: 'environmental', description: 'Join us for a community cleanup event.', image: 'assets/images/event4.jpg', upcoming: true },
            { name: 'Free Health Check-up Camp', date: '2025-10-05', category: 'health', description: 'Free health check-ups for all.', image: 'assets/images/event1.jpg', upcoming: true },
            { name: 'Digital Literacy Workshop', date: '2025-08-20', category: 'educational', description: 'Learn basic computer skills.', image: 'assets/images/event2.jpg', upcoming: false },
            { name: 'Tree Plantation Drive', date: '2025-07-10', category: 'environmental', description: 'Planting trees for a greener future.', image: 'assets/images/event3.jpg', upcoming: false },
        ];

        function renderEvents() {
            upcomingEventsContainer.innerHTML = '';
            pastEventsContainer.innerHTML = '';

            const category = categoryFilter.value;
            const date = dateFilter.value;

            const filteredEvents = events.filter(event => {
                return (category === 'all' || event.category === category) &&
                       (!date || event.date === date);
            });

            filteredEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.classList.add('event');

                if (event.upcoming) {
                    eventElement.innerHTML = `
                        <h3>${event.name}</h3>
                        <p>Date: ${event.date}</p>
                        <p>${event.description}</p>
                        <button class="btn btn-primary register-btn" data-event="${event.name}">Register</button>
                        <div class="social-share">
                            <a href="#" class="share-facebook"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="share-twitter"><i class="fab fa-twitter"></i></a>
                        </div>
                    `;
                    upcomingEventsContainer.appendChild(eventElement);
                } else {
                    eventElement.innerHTML = `
                        <div class="card">
                            <img src="${event.image}" alt="${event.name}">
                            <div class="card-content">
                                <h3>${event.name}</h3>
                                <p>Date: ${event.date}</p>
                            </div>
                        </div>
                    `;
                    pastEventsContainer.appendChild(eventElement);
                }
            });

            addEventListeners();
        }

        function addEventListeners() {
            document.querySelectorAll('.register-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    eventNameInput.value = e.target.dataset.event;
                    modal.style.display = 'block';
                });
            });
        }

        categoryFilter.addEventListener('change', renderEvents);
        dateFilter.addEventListener('change', renderEvents);

        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = 'none';
            }
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for registering for the event!');
            modal.style.display = 'none';
            registerForm.reset();
        });

        renderEvents();
    }

    // Toast Notification
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
