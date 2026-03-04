document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const formSection = document.getElementById('form-section');
    const itemsSection = document.getElementById('items-section');
    const showFormBtn = document.getElementById('show-form-btn');
    const showItemsBtn = document.getElementById('show-items-btn');
    const reportForm = document.getElementById('report-form');
    const itemsContainer = document.getElementById('items-container');

    // Navigation Toggles
    showFormBtn.addEventListener('click', () => {
        formSection.style.display = 'block';
        itemsSection.style.display = 'none';
    });

    showItemsBtn.addEventListener('click', () => {
        formSection.style.display = 'none';
        itemsSection.style.display = 'block';
        fetchItems(); // Fetch data when opening this view
    });

    // Handle Form Submission
    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the page from reloading

        // JavaScript Validation
        const title = document.getElementById('title').value.trim();
        if (title.length < 3) {
            alert('Please provide a clearer title (at least 3 characters).');
            return;
        }

        // Gather the form data
        const formData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            location: document.getElementById('location').value,
            item_date: document.getElementById('item_date').value,
            contact_info: document.getElementById('contact_info').value
        };

        try {
            // Send data to our backend (we will build this route next!)
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Item reported successfully!');
                reportForm.reset(); // Clear the form
                showItemsBtn.click(); // Switch over to the view screen
            } else {
                alert('Failed to submit report. Please check your inputs.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server error. Please try again later.');
        }
    });

    // Fetch and Display Items with Update/Delete actions
async function fetchItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();

        itemsContainer.innerHTML = ''; 

        if (items.length === 0) {
            itemsContainer.innerHTML = '<p>No items reported yet.</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = `item-card ${item.category.toLowerCase()}`;
            
            const dateObj = new Date(item.item_date);
            const formattedDate = dateObj.toLocaleDateString();

            card.innerHTML = `
    <h3>${item.title} <span style="font-size: 0.8em; color: gray;">(${item.category})</span></h3>
    <img src="https://via.placeholder.com/150" alt="${item.title}" loading="lazy" style="width:100%; border-radius:4px; margin-bottom:10px;">
    <p><strong>Location:</strong> ${item.location}</p>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p><strong>Description:</strong> ${item.description}</p>
    <p><strong>Contact:</strong> ${item.contact_info}</p>
    <p><strong>Status:</strong> 
        <select onchange="updateStatus(${item.id}, this.value)">
            <option value="Active" ${item.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Claimed" ${item.status === 'Claimed' ? 'selected' : ''}>Claimed</option>
            <option value="Resolved" ${item.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
        </select>
    </p>
    <button onclick="deleteItem(${item.id})" style="background:#dc3545; color:white; border:none; padding:5px; cursor:pointer; margin-top:10px; border-radius:4px;">Delete Report</button>
`;
            itemsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        itemsContainer.innerHTML = '<p>Error loading items from the database.</p>';
    }
}

// Function to handle DELETE [Requirement: CRU(D)]
async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this report?')) {
        try {
            const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Report deleted!');
                location.reload(); // Refresh to show updated list
            }
        } catch (error) {
            alert('Error deleting item');
        }
    }
}

// Function to handle UPDATE [Requirement: CR(U)D]
async function updateStatus(id, newStatus) {
    try {
        const response = await fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
            alert('Status updated!');
        }
    } catch (error) {
        alert('Error updating status');
    }
}
// end of DOMContentLoaded listener
});