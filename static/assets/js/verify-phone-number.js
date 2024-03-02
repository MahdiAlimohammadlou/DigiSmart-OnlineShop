
var phoneNumber = "";
var inputOtp = "";


// Verify OTP
function verify_opt(phone, enteredOTP) {
    fetch('/account/verify-otp/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone_number: phone, entered_otp: enteredOTP }),
    })
    .then(response => {
        if (!response.ok) {
            let otpError = $("#opt-error-message");
            otpError.show();
            otpError.text("کد وارد شده صحیح نمی باشد.");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("access", data.access);
        if (data.is_new_user) {
            window.location = "/account/welcome/";
        } else {
            window.location = "/";
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


//Get url params
let urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('phone_number')) {
    phoneNumber = urlParams.get('phone_number');
    $("#phone-number").text(phoneNumber);
}

$("#verify-btn").click(function(event) {
    for (let index = 1; index <= 5; index++) {
        inputOtp += $(`#char${index}`).val();
    }
    verify_opt(phoneNumber, inputOtp);
});

//Generate OTP
fetch('/account/generate-otp/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone_number: phoneNumber }),
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    console.log('OTP code generated');
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});







