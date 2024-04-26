
function isValidProfile() {
    $('.error-message').text('');
  
    let isValid = true;
  
    let name = $('#name').val().trim();
    if (name === '') {
        $('#name').prev('.error-message').text('نام الزامی است');
        isValid = false;
    }
  
    let email = $('#email').val().trim();
    if (email === '' || !validateEmail(email)) {
        $('#email').prev('.error-message').text('ایمیل معتبر وارد کنید');
        isValid = false;
    }
  
    $('.error-message').show();
    return isValid
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function getFormData () {
    const formData = {
      full_name: $('#name').val(),
      email: $('#email').val(),
    };
  
    return formData;
  };


$("#register-btn").click(async function (e) { 
    e.preventDefault();
    if (isValidProfile()) {
        let data = getFormData();
        let userId = localStorage.getItem("user_id");
        result = await fetchData(`/auth/users/${userId}/`, "PATCH", data);
        if (result) {
            window.location.href = "/account/profile/";
        } else {
            alert("خطا مجدداً تلاش کنید");
        }
    }
});