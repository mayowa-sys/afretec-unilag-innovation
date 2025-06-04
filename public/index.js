document.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Close Navbar on Link Click
document.addEventListener("DOMContentLoaded", function () {
    const navbarLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    // Close navbar when a link is clicked
    navbarLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (navbarCollapse.classList.contains("show")) {
                navbarToggler.click(); // Simulate a click on the toggler to close the navbar
            }
        });
    });

    // Close navbar when clicking outside the navbar
    document.addEventListener("click", function (event) {
        const isClickInsideNavbar = navbarCollapse.contains(event.target) || navbarToggler.contains(event.target);
        if (!isClickInsideNavbar && navbarCollapse.classList.contains("show")) {
            navbarToggler.click(); // Simulate a click on the toggler to close the navbar
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".slide");
    const buttons = document.querySelectorAll(".nav-button");
    let currentSlide = 0;
    let autoSlideInterval;

    // Function to show a specific slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove("active", "prev");
            if (i < index) {
                slide.classList.add("prev");
            }
        });
        slides[index].classList.add("active");
        buttons.forEach((button, i) => {
            button.classList.toggle("active", i === index);
        });
    }

    // Function to go to the next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Start auto-sliding
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 6000);
    }

    // Stop auto-sliding
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Manual navigation
    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            stopAutoSlide();
            currentSlide = index;
            showSlide(currentSlide);
            startAutoSlide();
        });
    });

    // Initialize
    showSlide(currentSlide);
    startAutoSlide();
});

document.addEventListener("DOMContentLoaded", function () {
    const readMoreButtons = document.querySelectorAll(".read-more");

    readMoreButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const card = this.closest(".update-card");
            const description = card.querySelector(".update-description");

            // Toggle expanded class
            card.classList.toggle("expanded");

            // Update button text
            if (card.classList.contains("expanded")) {
                this.textContent = "Read Less";
                description.style.maxHeight = description.scrollHeight + "px";
            } else {
                this.textContent = "Read More";
                description.style.maxHeight = "100px";
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const updatesGrid = document.querySelector(".updates-grid");
    const modal = document.getElementById("update-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDetails = document.getElementById("modal-details");
    const closeModal = document.querySelector(".close-modal");

    // Dynamic backend URL
    const backendUrl = window.location.origin;

    // Fetch updates from the backend
    fetch(`${backendUrl}/api/updates`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Clear any existing content
            updatesGrid.innerHTML = "";

            // Loop through the updates and create cards
            data.forEach((update) => {
                const card = document.createElement("div");
                card.classList.add("update-card");

                card.innerHTML = `
                    <div class="update-date">${update.date}</div>
                    <h3 class="update-title">${update.title}</h3>
                    <p class="update-description">${update.description}</p>
                    <button class="read-more" data-title="${update.title}" data-full-details="${update.fullDetails}">Read More</button>
                `;

                updatesGrid.appendChild(card);
            });

            // Add event listeners for "Read More" buttons
            const readMoreButtons = document.querySelectorAll(".read-more");
            readMoreButtons.forEach((button) => {
                button.addEventListener("click", function () {
                    const title = this.getAttribute("data-title");
                    const fullDetails = this.getAttribute("data-full-details");

                    // Show modal with full details
                    modalTitle.textContent = title;
                    modalDetails.textContent = fullDetails;
                    modal.style.display = "flex";
                });
            });
        })
        .catch((error) => {
            console.error("Error fetching updates:", error);
            updatesGrid.innerHTML = "<p>Failed to load updates. Please try again later.</p>";
        });

    // Close modal when the close button is clicked
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the modal
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const teamsRow = document.querySelector(".row");
    const teamModal = document.getElementById("team-modal");
    const modalTeamName = document.getElementById("modal-team-name");
    const modalTeamDescription = document.getElementById("modal-team-description");
    const closeModal = document.querySelector("#team-modal .close-modal");

    // Dynamic backend URL
    const backendUrl = window.location.origin;

    // Fetch teams from the backend
    fetch(`${backendUrl}/api/teams`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            teamsRow.innerHTML = "";

            data.forEach((team, index) => {
                const colors = ["blue", "green", "yellow", "brown", "purple", "orange"];
                const color = colors[index % colors.length];

                const card = document.createElement("div");
                card.classList.add("col-md-4", "col-sm-6", "content-card");

                card.innerHTML = `
                    <div class="card-big-shadow">
                        <div class="card card-just-text" data-background="color" data-color="${color}" data-radius="none">
                            <div class="content">
                                <h6 class="category">Team ${index + 1}</h6>
                                <h4 class="title">${team.teamName}</h4>
                            </div>
                        </div>
                    </div>
                `;

                card.addEventListener("click", () => {
                    modalTeamName.textContent = team.teamName;
                    modalTeamDescription.textContent = team.fullDescription;
                    teamModal.style.display = "flex"; 
                });

                teamsRow.appendChild(card);
            });
        })
        .catch((error) => {
            console.error("Error fetching teams:", error);
            teamsRow.innerHTML = "<p>Failed to load teams. Please try again later.</p>";
        });

    closeModal.addEventListener("click", function () {
        teamModal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === teamModal) {
            teamModal.style.display = "none";
        }
    });
});

// Speaker Modal Functionality
document.addEventListener("DOMContentLoaded", function() {
    const speakerCards = document.querySelectorAll('.speaker-card');
    const speakerModal = document.getElementById('speaker-modal');
    const closeModal = speakerModal.querySelector('.close-modal');
    
    // Add click event to each speaker card
    speakerCards.forEach(card => {
        card.addEventListener('click', function() {
            const name = this.querySelector('.organizer-name').textContent;
            const role = this.querySelector('.organizer-role').textContent;
            const flyer = this.getAttribute('data-flyer');
            const bio = this.querySelector('.speaker-bio').innerHTML;
            
            // Populate modal
            document.getElementById('speaker-modal-name').textContent = name;
            document.getElementById('speaker-modal-role').textContent = role;
            document.getElementById('speaker-flyer').src = flyer;
            document.getElementById('speaker-flyer').alt = `${name} Event Flyer`;
            document.getElementById('speaker-modal-bio').innerHTML = bio;
            
            // Show modal
            speakerModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        speakerModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close when clicking outside modal
    window.addEventListener('click', function(e) {
        if (e.target === speakerModal) {
            speakerModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('videoModal');
    const youtubeContainer = document.getElementById('youtubeContainer');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const closeVideo = document.querySelector('.close-video-modal');
    
    // Open modal with YouTube video
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', function() {
            const videoId = this.getAttribute('data-ytid');
            const title = this.getAttribute('data-title');
            const desc = this.getAttribute('data-description');
            const start = this.getAttribute('data-start') || 0;
            const end = this.getAttribute('data-end');
            
            // Create YouTube embed URL with timestamps
            let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&start=${start}`;

            if (end) {
                embedUrl += `&end=${end}`;
            }
            
            // Set iframe source
            youtubeContainer.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            
            videoTitle.textContent = title;
            videoDescription.textContent = desc;
            
            // Show modal
            modal.style.display = 'flex';
        });
    });
    
    // Close modal
    closeVideo.addEventListener('click', () => {
        modal.style.display = 'none';
        youtubeContainer.innerHTML = ''; // This stops the video
    });
    
    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            youtubeContainer.innerHTML = '';
        }
    });
    
    // Seminar group toggle with animation and single-open behavior
    document.querySelectorAll('.seminar-header').forEach(header => {
        header.addEventListener('click', function() {
            const group = this.parentElement;
            const videoGrid = this.nextElementSibling;
            
            // If this group is already active, close it
            if (group.classList.contains('active')) {
                slideUp(videoGrid, () => {
                    group.classList.remove('active');
                });
                return;
            }
            
            // Close all other open groups first
            document.querySelectorAll('.seminar-group.active').forEach(activeGroup => {
                if (activeGroup !== group) {
                    const activeVideoGrid = activeGroup.querySelector('.video-grid');
                    activeGroup.classList.remove('active');
                    slideUp(activeVideoGrid);
                }
            });
            
            // Open this group
            group.classList.add('active');
            slideDown(videoGrid);
        });
    });
    
    // Animation functions
    function slideDown(element, callback) {
        element.style.display = 'grid';
        element.style.overflow = 'hidden';
        element.style.maxHeight = '0';
        element.style.transition = 'max-height 0.4s ease, opacity 0.3s ease';
        element.style.opacity = '0';
        
        // Trigger reflow to apply initial styles
        void element.offsetHeight;
        
        element.style.maxHeight = element.scrollHeight + 'px';
        element.style.opacity = '1';
        
        const onTransitionEnd = () => {
            element.removeEventListener('transitionend', onTransitionEnd);
            element.style.maxHeight = '';
            element.style.overflow = '';
            if (callback) callback();
        };
        
        element.addEventListener('transitionend', onTransitionEnd);
    }
    
    function slideUp(element, callback) {
        element.style.overflow = 'hidden';
        element.style.maxHeight = element.scrollHeight + 'px';
        element.style.transition = 'max-height 0.4s ease, opacity 0.3s ease';
        
        // Trigger reflow to apply initial styles
        void element.offsetHeight;
        
        element.style.maxHeight = '0';
        element.style.opacity = '0';
        
        const onTransitionEnd = () => {
            element.removeEventListener('transitionend', onTransitionEnd);
            element.style.display = 'none';
            element.style.maxHeight = '';
            element.style.overflow = '';
            element.style.opacity = '';
            if (callback) callback();
        };
        
        element.addEventListener('transitionend', onTransitionEnd);
    }
});


