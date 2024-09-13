document.addEventListener('DOMContentLoaded', () => {
    const defaultFaceUrl = 'assets/head_right.png'; // Default face URL
    const saveButton = document.querySelector('button');
    const customFaceUpload = document.getElementById('customFaceUpload');
    const customFaceInput = document.getElementById('customFaceInput');
    const customFacePreview = document.getElementById('customFacePreview');

    // Load the saved settings from localStorage
    const savedFace = localStorage.getItem('snakeFace');
    const savedCustomFaceUrl = localStorage.getItem('customFaceUrl');

    // Set the radio button state based on saved settings
    if (savedFace === 'custom') {
        document.querySelector('input[value="custom"]').checked = true;
        customFaceUpload.classList.remove('hidden');
        if (savedCustomFaceUrl) {
            customFacePreview.src = savedCustomFaceUrl;
            customFacePreview.style.display = 'block';
        }
    } else {
        document.querySelector('input[value="default"]').checked = true;
        customFaceUpload.classList.add('hidden');
    }

    // Show or hide custom face upload section based on selected option
    document.querySelectorAll('input[name="snakeFace"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'custom') {
                customFaceUpload.classList.remove('hidden');
            } else {
                customFaceUpload.classList.add('hidden');
            }
        });
    });

    // Handle file input change
    customFaceInput.addEventListener('change', () => {
        const file = customFaceInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                customFacePreview.src = e.target.result;
                customFacePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle Save Settings button click
    saveButton.addEventListener('click', () => {
        const selectedFace = document.querySelector('input[name="snakeFace"]:checked').value;
        if (selectedFace === 'custom') {
            // Save custom face URL to local storage
            localStorage.setItem('snakeFace', 'custom');
            localStorage.setItem('customFaceUrl', customFacePreview.src);
            console.log(customFacePreview.src);
        } else {
            // Save default face URL to local storage
            localStorage.setItem('snakeFace', 'default');
            localStorage.setItem('customFaceUrl', defaultFaceUrl);
            console.log(defaultFaceUrl);
        }
        alert('Settings saved successfully!');
    });
});
