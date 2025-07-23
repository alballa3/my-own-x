const email = document.getElementById("email") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const name = document.getElementById("name") as HTMLInputElement;
const nameError = document.getElementById("name-error")!;
const emailError = document.getElementById("email-error")!;
const passwordError = document.getElementById("password-error")!;

document.getElementById("form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    let hasError = false;
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";

    if (name.value.trim().length === 0) {
        nameError.textContent = "Enter a valid name";
        hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        emailError.textContent = "Please enter a valid email";
        hasError = true;
    }

    if (password.value.length < 6) {
        passwordError.textContent = "The password must be at least 6 characters";
        hasError = true;
    } if (hasError) return;
    document.querySelectorAll("input").forEach(input => {
        input.disabled = true
    })
    const response = await fetch(`http://localhost:4000/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            email: email?.value,
            name: name?.value,
            password: password?.value
        })
    });
    document.querySelectorAll("input").forEach(input => {
        input.disabled = false
    })
    try {
        const json = await response.json();
        console.log(json);

        if (!response.ok) {
            passwordError.textContent = json.error || 'Registration failed';
            return;
        }

        // Handle successful registration (e.g., redirect)
        console.log('Registration successful');
        window.location.href = "/";

    } catch (error) {
        console.error('Registration error:', error);
        passwordError.textContent = 'Network error. Please try again.';
    }
});