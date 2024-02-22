const searchBars = document.querySelectorAll('.search-bar');
const resultsContainer = document.getElementById('search-results'); 
const listPages = ['index.html', 'page2.html', 'page3.html']; // Update with your list pages

// Fetch links data on script load
fetch('all_links.json')
    .then(response => response.json())
    .then(linksData => {
        let allLinks = linksData;  

        // Function to update search results (and redirect if needed)
        function updateSearchResults(searchTerm) {
            const currentPage = window.location.pathname.split('/').pop();
            const isOnSearchPage = currentPage === 'search.html';

            if (searchTerm === '') {
                // Redirect to the previous list page if on a search page
                if (isOnSearchPage) {
                    const currentIndex = listPages.indexOf(currentPage);
                    const prevIndex = (currentIndex - 1 + listPages.length) % listPages.length; 
                    const prevListPage = listPages[prevIndex]; 
                    window.location.href = prevListPage; 
                } else {
                    // Go back in browser history from a non-search page
                    window.history.back(); 
                }
            } else {
                const queryParams = new URLSearchParams({ q: searchTerm });

                if (isOnSearchPage) {
                    // Update results on search.html
                    resultsContainer.innerHTML = ''; // Clear old results

                    // Fetch and display results on 'search.html'
                    const filteredLinks = allLinks.filter(link => 
                        link.title.toLowerCase().includes(searchTerm.toLowerCase()) // Make search case-insensitive
                    );

                    if (filteredLinks.length === 0) {
                        resultsContainer.textContent = 'No results found.';
                    } else {
                        filteredLinks.forEach(link => {
                            const resultItem = document.createElement('a');
                            resultItem.href = link.url;
                            resultItem.textContent = link.title;
                            resultsContainer.appendChild(resultItem); 
                        });
                    }

                } else {
                    // Redirect to search.html with search term (after 2-second delay)
                    setTimeout(() => {
                        window.location.href = `search.html?${queryParams.toString()}`;
                    }, 2000); 
                }
            }
        }

        // Event listener for search bar input
        searchBars.forEach(searchBar => {
            searchBar.addEventListener('input', (event) => {
                const searchTerm = event.target.value; 
                updateSearchResults(searchTerm); 
            });
        });

        // Event listener for back/forward button (URL changes)
        window.addEventListener('popstate', () => {
            const queryParams = new URLSearchParams(window.location.search);
            const searchTerm = queryParams.get('q');
            updateSearchResults(searchTerm);
        });

        // Initial search (if needed, likely for your 'search.html' page)
        const initialSearchParams = new URLSearchParams(window.location.search);
        const initialSearchTerm = initialSearchParams.get('q');
        if (initialSearchTerm) {
            updateSearchResults(initialSearchTerm);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        // Handle error, e.g., display an error message on the relevant pages 
    });
