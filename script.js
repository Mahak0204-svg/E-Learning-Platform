document.addEventListener('DOMContentLoaded', () => {
    // --- Course Detail Page Tab Functionality ---
    const tabButtons = document.querySelectorAll('.course-tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        // Ensure the correct tab is active on load (default to 'about')
        const initialActiveTab = document.querySelector('.course-tab-button.active');
        if (initialActiveTab) {
            const targetId = initialActiveTab.dataset.tab;
            document.getElementById(targetId).style.display = 'block';
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and hide all content
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.style.display = 'none');

                // Add active class to clicked button
                button.classList.add('active');

                // Show the corresponding content
                const targetTabId = button.dataset.tab;
                document.getElementById(targetTabId).style.display = 'block';
            });
        });
    }

    // --- Course Listing Page Filter Functionality ---
    const filterForm = document.querySelector('.sidebar-filters');
    const courseGrid = document.getElementById('coursesGrid');
    // Get all initial course cards. We'll clone them to have a pristine copy for re-sorting.
    const allCourseCards = courseGrid ? Array.from(courseGrid.querySelectorAll('.course-card')) : [];
    const courseCountSpan = document.getElementById('courseCount');


    if (filterForm && courseGrid) {
        filterForm.addEventListener('change', applyFilters);
        document.querySelector('.course-grid-header select').addEventListener('change', applyFilters);

        function applyFilters() {
            const selectedCategories = Array.from(filterForm.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
            const selectedLevel = filterForm.querySelector('input[name="level"]:checked').value;
            const selectedPrices = Array.from(filterForm.querySelectorAll('input[name="price"]:checked')).map(cb => cb.value);
            // Get the minimum rating from radio buttons
            const selectedRatingMin = parseFloat(filterForm.querySelector('input[name="rating"]:checked')?.value || '0');

            const sortBy = document.querySelector('.course-grid-header select').value;

            let visibleCoursesCount = 0;
            const filteredCards = [];

            // Iterate over the pristine copy of all cards
            allCourseCards.forEach(card => {
                const category = card.dataset.category;
                const level = card.dataset.level;
                const price = card.dataset.price;
                const rating = parseFloat(card.dataset.rating);

                let isCategoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
                let isLevelMatch = selectedLevel === 'all' || selectedLevel === level;
                let isPriceMatch = selectedPrices.length === 0 || selectedPrices.includes(price);
                let isRatingMatch = rating >= selectedRatingMin;

                if (isCategoryMatch && isLevelMatch && isPriceMatch && isRatingMatch) {
                    filteredCards.push(card); // Add to our list of filtered cards
                }
            });

            // Sort the filtered cards
            if (sortBy === 'newest') {
                // For 'newest', you'd ideally have a data-date="YYYY-MM-DD" attribute on each card.
                // For this example, we'll assume the original order of the `allCourseCards` array is 'newest'.
                // If you add data-date, uncomment this:
                // filteredCards.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
                // Otherwise, 'newest' here just means maintaining the order they were filtered in.
            } else if (sortBy === 'popularity') {
                // Assuming rating can imply popularity
                filteredCards.sort((a, b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
            } else if (sortBy === 'price-low-high') {
                filteredCards.sort((a, b) => {
                    const priceA = (a.dataset.price === 'free') ? 0 : parseFloat(a.dataset.price.replace('$', ''));
                    const priceB = (b.dataset.price === 'free') ? 0 : parseFloat(b.dataset.price.replace('$', ''));
                    return priceA - priceB;
                });
            } else if (sortBy === 'price-high-low') {
                filteredCards.sort((a, b) => {
                    const priceA = (a.dataset.price === 'free') ? 0 : parseFloat(a.dataset.price.replace('$', ''));
                    const priceB = (b.dataset.price === 'free') ? 0 : parseFloat(b.dataset.price.replace('$', ''));
                    return priceB - priceA;
                });
            }

            // Clear the current grid and append the (filtered and sorted) cards
            courseGrid.innerHTML = '';
            filteredCards.forEach(card => {
                // We need to re-append the actual DOM nodes, not clones,
                // or their listeners/states won't persist if they had any.
                card.style.display = 'block'; // Ensure it's visible
                courseGrid.appendChild(card);
            });

            // Update the "Showing X Courses" text
            if (courseCountSpan) {
                courseCountSpan.textContent = filteredCards.length;
            }
        }

        // Initial filter application on page load (to account for default checked filters)
        applyFilters();
    }

    // You can add more JavaScript here for:
    // - Search bar functionality (e.g., live search, redirection)
    // - User profile dropdown menu (simple show/hide)
    // - Hamburger menu for mobile navigation
    // - More complex interactive elements as needed.
});