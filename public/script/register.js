function checkStrength() {
    const password = document.getElementById("password").value;
    const strengthBar = document.getElementById("strength-bar");
    const strengthText = document.getElementById("strength-text");

    let strength = 0;

    // Check password length
    if (password.length >= 6) strength++;
    // Check for uppercase letters
    if (password.match(/[A-Z]/)) strength++;
    // Check for numbers
    if (password.match(/[0-9]/)) strength++;
    // Check for special characters
    if (password.match(/[\W]/)) strength++;

    // Update strength bar and text
    switch (strength) {
        case 0:
            strengthBar.style.width = "0%";
            strengthText.textContent = "";
            break;
        case 1:
            strengthBar.style.width = "33%";
            strengthBar.className = "strength-bar weak";
            strengthText.textContent = "Weak";
            strengthText.style.color = "red";
            break;
        case 2:
            strengthBar.style.width = "66%";
            strengthBar.className = "strength-bar medium";
            strengthText.textContent = "Medium";
            strengthText.style.color = "orange";
            break;
        case 3:
        case 4:
            strengthBar.style.width = "100%";
            strengthBar.className = "strength-bar strong";
            strengthText.textContent = "Strong";
            strengthText.style.color = "green";
            break;
    }
}