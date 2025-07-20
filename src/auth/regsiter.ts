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

    if (name.value.length == 0) {
        nameError.textContent = "Enter a valid name";
        hasError = true;
    }
    if (!email.value.includes("@")) {
        emailError.textContent = "Please enter a valid email";
        hasError = true;
    }
    if (password.value.length <= 6) {
        passwordError.textContent = "The password length must be at least 6 characters or more";
        hasError = true;
    }
    if (hasError) return;

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

    const json = await response.json();
    console.log(json);

    if (!response.ok) {
        passwordError.textContent = json.error;
        return;
    }
});