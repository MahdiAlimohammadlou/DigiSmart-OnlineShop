
let IS_VALID = false;

document.getElementById("email-phone").addEventListener("change", function(event){
    let inputPhone = $("#email-phone").val();
    let inputPhoneError = $("#phone-error-message");
    if (validatePhoneNumber(inputPhone)) {
        fetch(`/account/check-user-existence/${inputPhone}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data.exists) {
                IS_VALID = true;
                inputPhoneError.text("");
                inputPhoneError.hide();

            }
            else {
                IS_VALID = false;
                inputPhoneError.show();
                inputPhoneError.text("این شماره تماس ثبت شده است.");
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    } else {
        IS_VALID = false;
        inputPhoneError.show();
        inputPhoneError.text("شماره تماس را به درستی وارد نمایید.");

    }
});

document.getElementById("password-input").addEventListener("change", function(event){
    let inputPass = $("#password-input").val();
    let inputPassError = $("#password-error-message");
    let validationErrors = validatePassword(inputPass);
    if (validationErrors) {
        inputPassError.html("");
        validationErrors.forEach(error => {
            IS_VALID = false;
            inputPassError.show();
            inputPassError.html(`${inputPassError.html()} ${error} <br>`);
        });
    } else {
        IS_VALID = true;
        inputPassError.html("");
        inputPassError.hide();
    }
});

document.getElementById("re-password-input").addEventListener("change", function(event){
    let inputPass = $("#password-input").val();
    let inputRePass = $("#re-password-input").val();
    let inputRePassError = $("#re-password-error-message");
    if (inputPass != inputRePass) {
            inputRePassError.show();
            inputRePassError.text("رمز عبور ها یکسان نیستند.");
    } else {
            IS_VALID = true;
            inputRePassError.html("");
            inputRePassError.hide();
    }
});


document.getElementById("register-btn").addEventListener("click", function(event){
    if (!IS_VALID) {
        event.preventDefault();
    }
});
