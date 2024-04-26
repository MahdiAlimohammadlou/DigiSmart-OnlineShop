
let PHONE_IS_VALID, PASS_IS_VALID = false;
let PHONE = null;
let PASS = null;
  


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

document.getElementById("password-input").addEventListener("change", function(event){
    let inputPass = $("#password-input").val();
    let inputPassError = $("#password-error-message");
    if (inputPass == "") {
        inputPassError.show();
        inputPassError.text("رمز عبور نباید خالی باشد.");
        PASS_IS_VALID = false;
    } else {
        PASS = inputPass;
        PASS_IS_VALID = true;
        inputPassError.text("");
        inputPassError.hide();
    }
});

document.getElementById("login-btn").addEventListener("click", function(event){
    if (!(PHONE_IS_VALID && PASS_IS_VALID)) {
        if ($("#phone-input").val().trim() == "") {
            let inputPhoneError = $("#phone-error-message");
            inputPhoneError.show();
            inputPhoneError.text("شماره موبایل نباید خالی باشد.");
        }
        if ($("#password-input").val().trim() == "") {
            let inputPassError = $("#password-error-message");
            inputPassError.show();
            inputPassError.text("رمز عبور نباید خالی باشد.");
        }
    } else {
        const formData = {
            phone_number: PHONE,
            password: PASS
          };

          const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          };

          fetch('/auth/jwt/create/', requestOptions)
            .then(response => {
              if (!response.ok) {
                let inputPassError = $("#password-error-message");
                inputPassError.show();
                inputPassError.text("رمز عبور وارد شده صحیح نمی باشد.");
              } else {
                return response.json();
              }
            })
            .then(data => {
                localStorage.setItem("refresh", data.refresh);
                localStorage.setItem("access", data.access);
                let priviesPage = localStorage.getItem("privies_page");
                localStorage.removeItem("privies_page");
                if (priviesPage !== null) {
                    window.location.href = priviesPage;
                } else {
                    window.location.href = "/";
                }
            })
            .catch(error => {
              console.error('Error:', error);
            });
  
    }
});
