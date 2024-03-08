
//Validate phone number format
function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^(09\d{9})$/;
    return phoneRegex.test(phoneNumber);
}

//Validate password format
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    const messages = [
        "حداقل 8 کاراکتر باید وارد شود.",
        "حداقل یک حرف کوچک باید وارد شود.",
        "حداقل یک حرف بزرگ باید وارد شود.",
        "حداقل یک عدد باید وارد شود.",
        "حداقل یک علامت از !@#$%^&*()_+ باید وارد شود."
    ];

    const isValid = passwordRegex.test(password);
    if (!isValid) {
        const errors = [];
        if (password.length < 8) errors.push(messages[0]);
        if (!/(?=.*[a-z])/.test(password)) errors.push(messages[1]);
        if (!/(?=.*[A-Z])/.test(password)) errors.push(messages[2]);
        if (!/(?=.*\d)/.test(password)) errors.push(messages[3]);
        if (!/(?=.*[!@#$%^&*()_+])/.test(password)) errors.push(messages[4]);
        return errors;
    }

    return null;
}

//Redirect to login page
function redirectToLogin(pathName) {
    localStorage.setItem("privies_page", pathName);
    window.location = "account/login/";
}


//Verify Token
function verifyJWT(token) {
    return fetch('/auth/jwt/verify/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: token
        })
    })
    .then(response => {
        if (response.status === 200) {
            return true;
        } else if (response.status === 401) {
            return false;
        } else {
            throw new Error('Unexpected response status: ' + response.status);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return false;
    });
}

//Refresh token
function refreshJWT(token) {
    return fetch('auth/jwt/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refresh: token
        })
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => data.access);
        } else if (response.status === 401) {
            return false;
        } else {
            throw new Error('Unexpected response status: ' + response.status);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
}

//Logout function
function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    location.reload(true);
}
