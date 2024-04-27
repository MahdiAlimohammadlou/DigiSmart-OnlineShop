
let PHONE_IS_VALID, PASS_IS_VALID, REPASS_IS_VALID = false;

document.getElementById("email-phone").addEventListener("change", function(event){
    let inputPhone = $("#email-phone").val();
    let inputPhoneError = $("#phone-error-message");
    if (validatePhoneNumber(inputPhone)) {
        fetch(`/api/account/check-user-existence/${inputPhone}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data.exists) {
                PHONE_IS_VALID = true;
                inputPhoneError.text("");
                inputPhoneError.hide();

            }
            else {
                PHONE_IS_VALID = false;
                inputPhoneError.show();
                inputPhoneError.text("این شماره موبایل ثبت شده است.");
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    } else {
        PHONE_IS_VALID = false;
        inputPhoneError.show();
        inputPhoneError.text("شماره موبایل را به درستی وارد نمایید.");

    }
});

document.getElementById("password-input").addEventListener("change", function(event){
    let inputPass = $("#password-input").val();
    let inputPassError = $("#password-error-message");
    let validationErrors = validatePassword(inputPass);
    if (validationErrors) {
        inputPassError.html("");
        validationErrors.forEach(error => {
            PASS_IS_VALID = false;
            inputPassError.show();
            inputPassError.html(`${inputPassError.html()} ${error} <br>`);
        });
    } else {
        PASS_IS_VALID = true;
        inputPassError.html("");
        inputPassError.hide();
    }
});

document.getElementById("re-password-input").addEventListener("change", function(event){
    let inputPass = $("#password-input").val();
    let inputRePass = $("#re-password-input").val();
    let inputRePassError = $("#re-password-error-message");
    if (inputPass != inputRePass) {
            REPASS_IS_VALID = false;
            inputRePassError.show();
            inputRePassError.text("رمز عبور ها یکسان نیستند.");
    } else {
            REPASS_IS_VALID = true;
            inputRePassError.html("");
            inputRePassError.hide();
    }
});


document.getElementById("register-btn").addEventListener("click", function(event){
    if (!(PHONE_IS_VALID && PASS_IS_VALID && REPASS_IS_VALID)) {
        if ($("#email-phone").val().trim() == "") {
            let inputPhoneError = $("#phone-error-message");
            inputPhoneError.show();
            inputPhoneError.text("شماره موبایل نباید خالی باشد.");
        }
        if ($("#password-input").val().trim() == "") {
            let inputPassError = $("#password-error-message");
            inputPassError.show();
            inputPassError.text("رمز عبور نباید خالی باشد.");
        } 
        if ($("#re-password-input").val().trim() == "") {
            let inputRepassError = $("#re-password-error-message");
            inputRepassError.show();
            inputRepassError.text("تکرار رمز عبور نباید خالی باشد.");
        }
    } else {
        const create_user_url = '/api/auth/users/';
        const phone = $("#email-phone").val();
        const pass = $("#password-input").val();
        const repass = $("#re-password-input").val();
        const data = {
            'phone_number': phone,
            'password': pass,
            're-password': repass
        };
        const json_data = JSON.stringify(data);

        fetch(create_user_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json_data
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Redirect to the verification page
            window.location.href = `/account/verify-phone-number/?phone_number=${phone}`; 
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error
            document.body.innerHTML = "An error occurred while processing your request";
        });

    }
});
