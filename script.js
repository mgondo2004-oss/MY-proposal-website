document.addEventListener('DOMContentLoaded', function() {
    initAccordions();
    initTabs();
    initModals();
    initGallery();
    initSearch();
    initFormValidation();
    initMap();
});

const searchData = {
    pages: [
        {
            title: "Home",
            url: "index.html",
            content: "Welcome to Learn and Grow Initiative. Empowering rural children with access to quality education, creativity and resources.",
            category: "page"
        },
        {
            title: "About Us",
            url: "about.html",
            content: "Learn about our background, mission, vision and team. Founded in 2019 to support rural children.",
            category: "page"
        },
        {
            title: "Programmes",
            url: "services.html",
            content: "Educational programmes including tutoring, after-school classes, textbook resources, sports and arts.",
            category: "page"
        },
        {
            title: "Enquiry",
            url: "enquiry.html",
            content: "Get involved by volunteering, sponsoring or supporting our initiative.",
            category: "page"
        },
        {
            title: "Contact Us",
            url: "contact.html",
            content: "Contact information including email, phone number and location in Eastern Cape.",
            category: "page"
        }
    ],
    services: [
        {
            title: "Tutoring & After-School Classes",
            url: "services.html",
            content: "Free lessons in all subjects for every learner to improve their academics.",
            category: "service"
        },
        {
            title: "Textbook & Resources",
            url: "services.html",
            content: "Educational resources including textbooks, stationery and digital learning tools.",
            category: "service"
        },
        {
            title: "Sports & Arts Development",
            url: "services.html",
            content: "Promoting creativity and physical growth through sports, arts and cultural activities.",
            category: "service"
        },
        {
            title: "Volunteer Opportunities",
            url: "enquiry.html",
            content: "Become a volunteer for tutoring, mentoring and community outreach programmes.",
            category: "service"
        },
        {
            title: "Sponsorship Programs",
            url: "enquiry.html",
            content: "Various sponsorship levels available to support our educational programmes.",
            category: "service"
        }
    ]
};

function initSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 2) {
                showSearchSuggestions(this.value);
            } else {
                hideSearchSuggestions();
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.value.trim()) {
                    performSearch(this.value.trim());
                }
            }
        });
    });

    const searchButtons = document.querySelectorAll('.search-button');
    searchButtons.forEach(button => {
        button.addEventListener('click', function() {
            const searchInput = this.previousElementSibling;
            if (searchInput && searchInput.value.trim()) {
                performSearch(searchInput.value.trim());
            }
        });
    });
}

function performSearch(query) {
    const results = searchAllContent(query);
    displaySearchResults(query, results);
}

function searchAllContent(query) {
    const lowerQuery = query.toLowerCase();
    const allResults = [];
    
    searchData.pages.forEach(item => {
        const relevance = calculateRelevance(item, lowerQuery);
        if (relevance > 0) {
            allResults.push({...item, relevance});
        }
    });
    
    searchData.services.forEach(item => {
        const relevance = calculateRelevance(item, lowerQuery);
        if (relevance > 0) {
            allResults.push({...item, relevance});
        }
    });
    
    return allResults.sort((a, b) => b.relevance - a.relevance);
}

function calculateRelevance(item, query) {
    let score = 0;
    
    if (item.title.toLowerCase().includes(query)) {
        score += 10;
    }
    
    if (item.content.toLowerCase().includes(query)) {
        score += 5;
    }
    
    const titleWords = item.title.toLowerCase().split(' ');
    const queryWords = query.split(' ');
    
    queryWords.forEach(word => {
        if (titleWords.includes(word)) {
            score += 3;
        }
        if (item.content.toLowerCase().includes(word)) {
            score += 1;
        }
    });
    
    return score;
}

function displaySearchResults(query, results) {
    let resultsContainer = document.getElementById('search-results');
    
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'search-results';
        resultsContainer.className = 'search-results-container';
        
        const main = document.querySelector('main');
        if (main) {
            main.appendChild(resultsContainer);
        } else {
            document.body.appendChild(resultsContainer);
        }
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No results found for "${query}"</h3>
                <p>Try searching with different keywords.</p>
            </div>
        `;
        return;
    }
    
    let html = `<div class="results-header">
                    <h3>Search Results for "${query}"</h3>
                    <button onclick="closeSearchResults()" class="close-results">×</button>
                </div>
                <div class="results-grid">`;
    
    results.forEach(result => {
        html += `
            <div class="search-result-item">
                <h4><a href="${result.url}">${result.title}</a></h4>
                <p>${result.content}</p>
                <span class="result-type ${result.category}">${result.category}</span>
            </div>
        `;
    });
    
    html += '</div>';
    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
}

function closeSearchResults() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

function showSearchSuggestions(query) {
    let suggestionsContainer = document.getElementById('search-suggestions');
    
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'search-suggestions';
        suggestionsContainer.className = 'search-suggestions';
        
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.parentNode.appendChild(suggestionsContainer);
        }
    }
    
    const suggestions = getSearchSuggestions(query);
    
    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    let html = '<div class="suggestions-list">';
    suggestions.forEach(suggestion => {
        html += `<div class="suggestion-item" onclick="selectSuggestion('${suggestion.replace(/'/g, "\\'")}')">
                    ${suggestion}
                 </div>`;
    });
    html += '</div>';
    
    suggestionsContainer.innerHTML = html;
    suggestionsContainer.style.display = 'block';
}

function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

function getSearchSuggestions(query) {
    const lowerQuery = query.toLowerCase();
    const suggestions = new Set();
    
    searchData.pages.forEach(item => {
        if (item.title.toLowerCase().includes(lowerQuery)) {
            suggestions.add(item.title);
        }
    });
    
    searchData.services.forEach(item => {
        if (item.title.toLowerCase().includes(lowerQuery)) {
            suggestions.add(item.title);
        }
    });
    
    return Array.from(suggestions).slice(0, 5);
}

function selectSuggestion(suggestion) {
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
        searchInput.value = suggestion;
        hideSearchSuggestions();
        performSearch(suggestion);
    }
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-suggestions') && !e.target.matches('input[type="search"]')) {
        hideSearchSuggestions();
    }
});

function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');
            
            document.querySelectorAll('.accordion-content').forEach(item => {
                item.classList.remove('active');
            });
            
            if (!isActive) {
                content.classList.add('active');
            }
        });
    });
}

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'block';
        });
    });
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-modal');
        
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-content');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (galleryItems && lightbox && lightboxImg) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                lightboxImg.setAttribute('src', imgSrc);
                lightbox.style.display = 'block';
            });
        });
        
        lightboxClose.addEventListener('click', function() {
            lightbox.style.display = 'none';
        });
        
        lightbox.addEventListener('click', function(event) {
            if (event.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
}

function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                submitForm(this);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        const errorElement = input.nextElementSibling;
        
        if (input.hasAttribute('required') && !input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
            }
        } else if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(input.value.replace(/[\s\-\(\)]/g, ''))) {
                showError(input, 'Please enter a valid phone number');
                isValid = false;
            }
        } else {
            hideError(input);
        }
    });
    
    return isValid;
}

function showError(input, message) {
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    input.style.borderColor = '#e74c3c';
}

function hideError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.style.display = 'none';
    }
    input.style.borderColor = '#ddd';
}

function submitForm(form) {
    const submitButton = form.querySelector('input[type="submit"]');
    const originalText = submitButton.value;
    
    submitButton.value = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        showSuccessMessage(form, 'Thank you! Your message has been sent successfully.');
        submitButton.value = originalText;
        submitButton.disabled = false;
        form.reset();
    }, 2000);
}

function showSuccessMessage(form, message) {
    let successElement = form.querySelector('.success-message');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'success-message';
        form.insertBefore(successElement, form.firstChild);
    }
    successElement.textContent = message
