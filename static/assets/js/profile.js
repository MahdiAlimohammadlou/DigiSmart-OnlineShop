
checkAuthentication().then(isAuthenticated => {
        if (!isAuthenticated) {
            redirectToLogin();
        }
});

$(window).on('load', async function() {
    const userInfo = await getUserProfile(localStorage.getItem("access"));
    $(".profile-box-nameuser").text(userInfo.full_name);
    $(".profile-box-phone").text(`شماره تماس : ${userInfo.phone_number}`);
    $(".profile-box-tab-sign-out").click(function (e) { 
        e.preventDefault();
        logout();
    });
    
});