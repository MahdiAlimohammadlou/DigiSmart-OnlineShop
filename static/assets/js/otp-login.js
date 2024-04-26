let PHONE_IS_VALID = false;

document.getElementById("phone-input").addEventListener("change", function(event){
    let inputPhone = $("#phone-input").val();
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
                PHONE_IS_VALID = false;
                inputPhoneError.show();
                inputPhoneError.text("شماره موبایل وجود ندارد.");
            }
            else {
                PHONE = inputPhone;
                PHONE_IS_VALID = true;
                inputPhoneError.text("");
                inputPhoneError.hide();
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

document.getElementById("send-otp-btn").addEventListener("click", function(event){
    if (!(PHONE_IS_VALID)) {
        if ($("#phone-input").val().trim() == "") {
            let inputPhoneError = $("#phone-error-message");
            inputPhoneError.show();
            inputPhoneError.text("شماره موبایل نباید خالی باشد.");
        }
    } else {
        const phone = $("#phone-input").val();
        window.location.href = `/account/verify-phone-number/?phone_number=${phone}`; 
    }
});