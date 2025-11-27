document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('main-nav');
    const contactForm = document.getElementById('contactForm');
    const aboutModal = document.getElementById('aboutModal');
    const statusModal = document.getElementById('statusModal');
    const viewAboutModalBtn = document.getElementById('viewAboutModalBtn');
    
    // Initial close status button (used for dynamic reassignment later)
    let closeStatusBtn = document.getElementById('closeStatusBtn');

    // --- 1. Robust Navigation (Intersection Observer) ---
    
    // Function to set the active link visually
    const setActiveLink = (pageId) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
    };

    // Intersection Observer Setup: detects which section is in the center of the viewport
    const observerOptions = {
        root: null, 
        rootMargin: '0px 0px -50% 0px', // Detect when section crosses the middle line
        threshold: 0 
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;
                setActiveLink(currentSectionId);
            }
        });
    }, observerOptions);

    // Start observing all page sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 2. Hamburger Menu Toggle ---
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    // Close the mobile menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
            }
        });
    });

    // --- 3. Modal Management (Generic Functions) ---
    
    const openModal = (modalElement) => {
        modalElement.style.display = 'block';
    };

    const closeModal = (modalElement) => {
        modalElement.style.display = 'none';
    };

    // --- 4. Modal Event Listeners ---

    // About Modal Listener
    viewAboutModalBtn.addEventListener('click', () => openModal(aboutModal));
    
    // Close button listeners for modals (X button)
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.closest('.modal')) {
                closeModal(e.target.closest('.modal'));
            }
        });
    });

    // Close modal on outside click (window)
    window.addEventListener('click', (event) => {
        if (event.target === aboutModal) {
            closeModal(aboutModal);
        }
        if (event.target === statusModal) {
            closeModal(statusModal);
        }
    });
    
    // Initial close listener for the status modal button
    closeStatusBtn.addEventListener('click', () => closeModal(statusModal));


    // --- 5. Contact Form Submission with Custom Confirmation Modal ---
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Setup modal for confirmation
        document.getElementById('statusModalTitle').textContent = "Confirm Submission";
        document.getElementById('statusModalMessage').textContent = "Are you sure you want to send this message to Allen?";
        
        // Get the current button and set it up as the confirmation button
        const currentButton = document.getElementById('closeStatusBtn');
        currentButton.textContent = "Yes, Send";
        currentButton.id = 'confirmSendBtn'; 
        
        openModal(statusModal);

        // 2. Define confirmation handler
        const handleConfirm = () => {
            // Simulate form submission success/delay
            setTimeout(() => {
                // Reset form fields
                contactForm.reset();
                
                // Change modal content back to success message
                document.getElementById('statusModalTitle').textContent = "Message Sent Successfully!";
                document.getElementById('statusModalMessage').textContent = "Thank you! Allen will review your message and get back to you shortly.";

                // 3. Reset button back to 'Close' and its original ID
                const confirmBtn = document.getElementById('confirmSendBtn');
                confirmBtn.textContent = "Close";
                confirmBtn.id = 'closeStatusBtn';
                
                // Remove temporary confirmation listener and re-add the closing listener
                confirmBtn.removeEventListener('click', handleConfirm);
                confirmBtn.addEventListener('click', () => closeModal(statusModal));

            }, 500);
        };

        // 4. Add the listener for the temporary confirmation button
        const confirmButton = document.getElementById('confirmSendBtn');
        confirmButton.addEventListener('click', handleConfirm, { once: true });
        
        // 5. Cleanup listener if modal is closed via the 'X' button or background click before confirmation
        document.querySelector('#statusModal .close').addEventListener('click', () => {
            const tempBtn = document.getElementById('confirmSendBtn');
            if(tempBtn){
                 tempBtn.removeEventListener('click', handleConfirm);
                 // Reset button state
                 tempBtn.textContent = "Close";
                 tempBtn.id = 'closeStatusBtn';
            }
        }, { once: true });
    });
});