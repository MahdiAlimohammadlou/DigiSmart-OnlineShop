

//Start account section
async function checkAuthentication() {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    let isAuthenticated = null;

    if (accessToken) {
        if (verifyJWT(accessToken)) {
            isAuthenticated = true;
        } else if (refreshToken) {
            if (verifyJWT(refreshToken)) {
                const newAccess = await refreshJWT(refreshToken);
                if (newAccess) {
                    localStorage.setItem("access", newAccess);
                    isAuthenticated = true;
                } else {
                    // Handle case where new access token couldn't be obtained
                }
            }
        }
    } else if (refreshToken) {
        if (verifyJWT(refreshToken)) {
            const newAccess = await refreshJWT(refreshToken);
            if (newAccess) {
                localStorage.setItem("access", newAccess);
                isAuthenticated = true;
            } else {
                // Handle case where new access token couldn't be obtained
            }
        }
    }

    return isAuthenticated;
}

checkAuthentication().then(isAuthenticated => {
    let accountContainer = $("#account-container");
    if (isAuthenticated) {
        const accountLink = $('<span></span>', {
            'class': 'title-account',
            'text': 'حساب کاربری'
        });
        const accountSection = $('<div></div>', {
            'class': 'dropdown-menu',
            'html': `
                    <ul class="account-uls mb-0">
                    <li class="account-item">
                        <a href="/account/profile/" class="account-link">پنل کاربری</a>
                    </li>
                    <li class="account-item">
                        <a href="/account/profile-order/" class="account-link">سفارشات من</a>
                    </li>
                    <li class="account-item">
                        <a href="#" class="account-link">آدرس ها</a>
                    </li>
                    <li class="account-item">
                        <a onclick="logout()" class="account-link">خروج</a>
                    </li>
                    </ul>`
        });
        accountContainer.append(accountLink);
        accountContainer.append(accountSection);
    } else {
        const registerLink = $('<a></a>', {
            'html': '<span class="title-account">ثبت نام</span>'
        });
        registerLink.attr('href', '/account/register/');

        const loginLink = $('<a></a>', {
            'html': '<span class="title-account">ورود</span>'
        });
        loginLink.attr('href', '/account/login/');

        accountContainer.append(registerLink);
        accountContainer.append(loginLink);


    }
})




//End account section

//Start load categories
let catesUl = document.getElementById("cat-menu");
if (catesUl) {
    fetch('/api/categories')
    .then(response => response.json())
    .then(data => {
        data.forEach(category => {
            let catLi = document.createElement("li");
            if (category.is_parent == true) {
                catLi.innerHTML = `
                <a href="#" class="collapsed" type="button" data-toggle="collapse" data-target="#collapse${category.id}" aria-expanded="false" aria-controls="collapse${category.id}">
                <i class="mdi mdi-chevron-down"></i>${category.title}</a>
                <div id="collapse${category.id}" class="collapse" aria-labelledby="heading${category.id}" data-parent="#accordionExample" style="">
                     <ul data-parentCatId = "${category.id}"></ul>
                </div>`;
                catesUl.appendChild(catLi);
            } else if (category.is_sub == true) {
                parentUl =  document.querySelector(`[data-parentCatId="${category.parent}"]`);
                catLi.innerHTML = `<a href="/products/?category=${encodeURIComponent(category.title)}" class="category-level-2">${category.title}</a>`;
                parentUl.appendChild(catLi);
            } else {
                catLi.innerHTML = `<a href="/products/?category=${encodeURIComponent(category.title)}">${category.title}</a>`;
                catesUl.appendChild(catLi);
            }
        });
    })
    .catch(error => {
        console.error('خطا در دریافت اطلاعات:', error);
    });
}
//End load categories


