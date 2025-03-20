// script.js
document.getElementById('checkButton').addEventListener('click', async () => {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value.trim();

    if (!password) {
        alert('Please enter a password.');
        return;
    }

    // Hash the password using SHA-1
    const hashedPassword = await hashPassword(password);

    // Extract the first 5 characters of the hash for k-anonymity
    const prefix = hashedPassword.slice(0, 5).toUpperCase();

    // Fetch breach data from HIBP API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();

    // Check if the password is breached
    const suffix = hashedPassword.slice(5).toUpperCase();
    const lines = data.split('\n');
    const matches = lines.filter(line => line.startsWith(suffix));

    if (matches.length > 0) {
        // Password is breached
        document.getElementById('resultSection').classList.remove('hidden');
        document.querySelector('.result-safe').innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <h2>Your password has been leaked!</h2>
    `;
    } else {
        // Password is safe
        document.getElementById('resultSection').classList.remove('hidden');
        document.querySelector('.result-safe').innerHTML = `
      <i class="fas fa-check-circle"></i>
      <h2>You are safe for now</h2>
    `;
    }
});

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const buffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(buffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}