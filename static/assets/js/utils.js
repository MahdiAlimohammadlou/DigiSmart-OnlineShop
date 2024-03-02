
function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^(\d{11})|(\d{3}\s\d{4}\s\d{4})$/;
    return phoneRegex.test(phoneNumber);
}

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
