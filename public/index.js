document.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) { // Change background after 50px scroll
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".slide");
    const buttons = document.querySelectorAll(".nav-button");
    let currentSlide = 0;
    let autoSlideInterval;

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach((slide, i) => {
            slide.classList.remove("active", "prev");
            if (i < index) {
                slide.classList.add("prev"); // Mark previous slides
            }
        });

        // Show the current slide
        slides[index].classList.add("active");

        // Update button states
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
        autoSlideInterval = setInterval(nextSlide, 6000); // Change slide every 5 seconds
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
                description.style.maxHeight = description.scrollHeight + "px"; // Expand description
            } else {
                this.textContent = "Read More";
                description.style.maxHeight = "100px"; // Collapse description
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

    // Fetch updates from the backend
    fetch("http://localhost:3000/api/updates")
        .then((response) => response.json())
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
        });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

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
    const modalTeamVideo = document.getElementById("modal-team-video");
    const modalTeamMembers = document.getElementById("modal-team-members");
    const modalProjectStatus = document.getElementById("modal-project-status");
    const closeModal = document.querySelector(".close-modal");

    // Fetch teams from the backend
    fetch("http://localhost:3000/api/teams")
        .then((response) => response.json())
        .then((data) => {
            // Clear any existing content
            teamsRow.innerHTML = "";

            // Loop through the teams and create cards
            data.forEach((team, index) => {
                const colors = ["blue", "green", "yellow", "brown", "purple", "orange"];
                const color = colors[index % colors.length]; // Cycle through colors

                const card = document.createElement("div");
                card.classList.add("col-md-4", "col-sm-6", "content-card");

                card.innerHTML = `
                    <div class="card-big-shadow">
                        <div class="card card-just-text" data-background="color" data-color="${color}" data-radius="none">
                            <div class="content">
                                <h6 class="category">Team ${index + 1}</h6>
                                <h4 class="title">${team.teamName}</h4>
                                <p class="description">${team.shortDescription}</p>
                            </div>
                        </div>
                    </div>
                `;

                // Add click event to open modal
                card.addEventListener("click", () => {
                    modalTeamName.textContent = team.teamName;
                    modalTeamDescription.textContent = team.fullDescription;
                    modalTeamVideo.src = team.videoUrl;
                    modalTeamMembers.innerHTML = team.members
                        .map((member) => `<li>${member.name} - ${member.role}</li>`)
                        .join("");
                    modalProjectStatus.textContent = team.projectStatus;
                    teamModal.style.display = "flex";
                });

                teamsRow.appendChild(card);
            });
        })
        .catch((error) => {
            console.error("Error fetching teams:", error);
        });

    // Close modal when the close button is clicked
    closeModal.addEventListener("click", function () {
        teamModal.style.display = "none";
    });

    // Close modal when clicking outside the modal
    window.addEventListener("click", function (event) {
        if (event.target === teamModal) {
            teamModal.style.display = "none";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const managementGrid = document.querySelector("#members .members-group:nth-child(1) .members-grid");
    const projectGrid = document.querySelector("#members .members-group:nth-child(2) .members-grid");
    const webinarGrid = document.querySelector("#members .members-group:nth-child(3) .members-grid");

    // Dummy Data
    const managementTeam = [
        { name: "Prof. Folasade Ogunsola", role: "Vice Chancellor", photo: "https://via.placeholder.com/120" },
        { name: "Dr. John Doe", role: "Provost, College of Medicine", photo: "https://via.placeholder.com/120" }
    ];

    const projectTeam = [
        { name: "Alice Johnson", role: "Project Lead", photo: "https://via.placeholder.com/120" },
        { name: "Michael Brown", role: "Data Analyst", photo: "https://via.placeholder.com/120" },
        { name: "Sarah Lee", role: "UI/UX Designer", photo: "https://via.placeholder.com/120" },
        { name: "David Kim", role: "Backend Developer", photo: "https://via.placeholder.com/120" },
        { name: "Emily Davis", role: "Frontend Developer", photo: "https://via.placeholder.com/120" },
        { name: "James White", role: "QA Engineer", photo: "https://via.placeholder.com/120" }
    ];

    const webinarSpeakers = [
        { name: "Dr. Jane Smith", role: "Health Tech Expert", photo: "https://via.placeholder.com/120" },
        { name: "Dr. Robert Green", role: "AI in Healthcare", photo: "https://via.placeholder.com/120" },
        { name: "Dr. Laura Martinez", role: "Telemedicine Specialist", photo: "https://via.placeholder.com/120" },
        { name: "Dr. Daniel Brown", role: "Mental Health Advocate", photo: "https://via.placeholder.com/120" },
        { name: "Dr. Sophia Lee", role: "Public Health Consultant", photo: "https://via.placeholder.com/120" }
    ];

    // Function to create a member card
    function createMemberCard(member) {
        const card = document.createElement("div");
        card.classList.add("member-card");

        card.innerHTML = `
            <img src="${member.photo}" alt="${member.name}" class="member-photo">
            <h3 class="member-name">${member.name}</h3>
            <p class="member-role">${member.role}</p>
        `;

        return card;
    }

    // Populate Management Team
    managementTeam.forEach((member) => {
        managementGrid.appendChild(createMemberCard(member));
    });

    // Populate Project Team
    projectTeam.forEach((member) => {
        projectGrid.appendChild(createMemberCard(member));
    });

    // Populate Webinar Speakers
    webinarSpeakers.forEach((member) => {
        webinarGrid.appendChild(createMemberCard(member));
    });
});