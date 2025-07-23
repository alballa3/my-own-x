const email = document.getElementById("email") as HTMLInputElement
const password = document.getElementById("password") as HTMLInputElement
const emailError = document.getElementById("email_error")!
const passwordError = document.getElementById("password_error")!

const form = document.getElementById("form")
form?.addEventListener("submit", async (e) => {
    e.preventDefault()
    let hasError = false;
    emailError.textContent = "";
    passwordError.textContent = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        emailError.textContent = "Please enter a valid email";
        hasError = true;
    }

    if (password.value.length < 6) {
        passwordError.textContent = "The password must be at least 6 characters";
        hasError = true;
    } if (hasError) return;

    const user = {
        email: email.value,
        password: password.value
    }
    document.querySelectorAll("input").forEach(input => {
        input.disabled = true
      })
    const response = await fetch(`http://localhost:4000/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(user)
    });

    const json = await response.json();
    console.log(json);
    document.querySelectorAll("input").forEach(input => {
        input.disabled = false
      })
    if (!response.ok) {

        passwordError.textContent = json.error || "Register Failed";
        return;
    }
    window.location.href = "/";
})
