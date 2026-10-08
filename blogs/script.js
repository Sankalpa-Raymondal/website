// Function to fetch and process a blog post
async function displayBlogList() {
    // 1. Manually list the blogs you have, relative to THIS file (website/blogs/script.js)
    const blogUrls = [
        'blog_entries/20260312.md',
    ];

    const blogListContainer = document.getElementById('blog-list');

    // Clear any existing content
    blogListContainer.innerHTML = '';

    // Loop through each blog URL
    for (const url of blogUrls) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Could not fetch ${url}`);
            }
            const markdownContent = await response.text();

            // 2. Simple Parsing (we are not rendering full HTML, just summary)
            // Extract the Title (assuming first line starts with #)
            const titleMatch = markdownContent.match(/^#\s+(.*)/m);
            const title = titleMatch ? titleMatch[1] : 'Untitled Post';

            // Extract the Date (assuming second line is *Date*)
            const dateMatch = markdownContent.match(/^\*(.*)\*/m);
            const date = dateMatch ? dateMatch[1] : 'No Date';

            // Extract the summary (everything before )
            const summaryEndIndex = markdownContent.indexOf('');
            let summary = '';
            if (summaryEndIndex !== -1) {
                // Find where the summary starts, after the title and date
                const summaryStartIndex = markdownContent.indexOf('\n\n', dateMatch ? dateMatch.index : (titleMatch ? titleMatch.index : 0));
                summary = markdownContent.substring(summaryStartIndex, summaryEndIndex).trim();
            } else {
                // If no more tag, show first 150 chars as fallback
                const fallbackSummaryMatch = markdownContent.match(/\n\n([\s\S]*?)(?=\n\n|$)/);
                summary = fallbackSummaryMatch ? fallbackSummaryMatch[1].substring(0, 150).trim() + '...' : 'Preview not available.';
            }

            // 3. Create the HTML elements for each post in the list
            const postElement = document.createElement('div');
            postElement.classList.add('blog-post-item');

            const postTitle = document.createElement('h3');
            postTitle.textContent = title;

            const postDate = document.createElement('p');
            postDate.classList.add('post-date');
            postDate.textContent = date;

            const postSummary = document.createElement('p');
            postSummary.textContent = summary;

            const readMoreLink = document.createElement('a');
            readMoreLink.href = `#`; // We will need to figure out dynamic page loading for full posts
            readMoreLink.textContent = 'Read full post...';
            readMoreLink.classList.add('read-more-link');

            // Add all parts to the main post element
            postElement.appendChild(postTitle);
            postElement.appendChild(postDate);
            postElement.appendChild(postSummary);
            postElement.appendChild(readMoreLink);

            // Add the complete post element to the list container
            blogListContainer.appendChild(postElement);

        } catch (error) {
            console.error(`Error processing ${url}:`, error);
            // Optionally, add an error message to the UI
            const errorElement = document.createElement('p');
            errorElement.textContent = `Error loading a blog post: ${error.message}`;
            errorElement.style.color = 'red';
            blogListContainer.appendChild(errorElement);
        }
    }
}

// Execute the function when the script loads
displayBlogList();