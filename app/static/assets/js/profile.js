
checkAuthentication().then(isAuthenticated => {
    if (!isAuthenticated) {
        redirectToLogin();
    }
});

function setUserInfo(fieldSelector, value) {
    $(fieldSelector).text(value ? value : "-");
}

let pathName = window.location.pathname

$(window).on('load', async function() {
    let userInfo = await getUserProfile(localStorage.getItem("access"))
    localStorage.setItem("user_id", userInfo.id);
    $(".profile-box-nameuser").text(userInfo.full_name);
    $(".profile-box-phone").text(`شماره تماس : ${userInfo.phone_number}`);
    if (pathName == "/account/profile") {
        setUserInfo(".full_name .value", userInfo.full_name);
        setUserInfo(".email .value", userInfo.email);
        setUserInfo(".phone_number .value", userInfo.phone_number);
        setUserInfo(".registration_date .value", userInfo.shamsi_registration_date);
    } else if (pathName == "/account/profile-info") {
        if (userInfo.full_name) $("#name").val(userInfo.full_name);
        if (userInfo.email) $("#email").val(userInfo.email);
    }
});
