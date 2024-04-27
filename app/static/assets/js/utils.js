//-----Ammount section-------

function calculateFinalPrice(Price, discountPercentage) {
    const discountedPrice = Price * (1 - (discountPercentage / 100));
    let result = {
        numResult : discountedPrice,
        stringResult : parseFloat(discountedPrice).toLocaleString('fa', { maximumFractionDigits: 0 })
    }
    return result
}

function calculateFinalPriceWithAmountDiscount(Price, discountAmount) {
    const discountedPrice = Price - discountAmount;
    let result = {
        numResult : discountedPrice,
        stringResult : parseFloat(discountedPrice).toLocaleString('fa', { maximumFractionDigits: 0 })
    }
    return result
}

//-----Ammount section-------


//---------Account section----------

//Validate phone number format
function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^(09\d{9})$/;
    return phoneRegex.test(phoneNumber);
}

//Validate password format
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

//Redirect to login page
function redirectToLogin() {
    let priviesPagePathName = window.location.pathname;
    let priviesQueryParams  = window.location.search;
    let priviesPage = priviesPagePathName + priviesQueryParams
    localStorage.setItem("privies_page", priviesPage);
    window.location = "/account/login/";
}

//Verify Token
function verifyJWT(token) {
    return fetch('/api/auth/jwt/verify/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: token
        })
    })
    .then(response => {
        if (response.status === 200) {
            return true;
        } else if (response.status === 401) {
            return false;
        } else {
            throw new Error('Unexpected response status: ' + response.status);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return false;
    });
}

//Refresh token
function refreshJWT(token) {
    return fetch('auth/jwt/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refresh: token
        })
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => data.access);
        } else if (response.status === 401) {
            return false;
        } else {
            throw new Error('Unexpected response status: ' + response.status);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
}

//Logout function
function logout() {
    clearCartInCookie()
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    location.reload(true);
}

//Check user is authenticated
async function checkAuthentication() {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    let isAuthenticated = false;

    if (accessToken) {
        if (await verifyJWT(accessToken)) {
            isAuthenticated = true;
        } else if (refreshToken) {
            if (await verifyJWT(refreshToken)) {
                const newAccess = await refreshJWT(refreshToken);
                if (newAccess) {
                    localStorage.setItem("access", newAccess);
                    isAuthenticated = true;
                }
            }
        }
    } else if (refreshToken) {
        if (await verifyJWT(refreshToken)) {
            const newAccess = await refreshJWT(refreshToken);
            if (newAccess) {
                localStorage.setItem("access", newAccess);
                isAuthenticated = true;
            }
        }
    }

    return isAuthenticated;
}


async function getUserProfile(accessToken) {
    let apiUrl = "/api/auth/users/me/";
    let token = `JWT ${accessToken}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error; 
    }
}

//---------Account section----------

//------------Cart section------------

function addCartToRedis(username, cart) {
    fetch('/api/order/cart-manager/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username : username,
            cart: cart
        }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

async function getCartFromRedis(username) {
    try {
        const response = await fetch(`/api/order/cart-manager/${username}/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        await saveCartInfo(data);
    } catch (error) {
        console.error('Error:', error);
        throw error; 
    }
}


// Save the cart to a cookie
async function saveCartInfo(newItems) {
    let cartItems = JSON.parse(getCookie('cart')) || [];

    newItems.forEach(newItem => {
        const existingItemIndex = cartItems.findIndex(item => item.id === newItem.id);
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex] = newItem;
        } else {
            cartItems.push(newItem);
        }
    });

    const jsonUpdatedItemsArray = JSON.stringify(cartItems);

    setCookie('cart', jsonUpdatedItemsArray, 30);
}

//Update cart in backend
async function updateBackendCart() {
    if (await checkAuthentication()) {
    try {
        const cartItems = getCartFromCookie();
        const token = localStorage.getItem("access");
        const userInfo = await getUserProfile(token);
        await addCartToRedis(userInfo.phone_number, JSON.stringify(cartItems));
    } catch (error) {
        console.error('Error saving cart to Redis:', error);
    }
    }
}



// Retrieve the cart from a cookie
function getCartFromCookie() {
    const jsonCart = getCookie('cart');
    const cartItems = JSON.parse(jsonCart);
    return cartItems;
}

// Select a product from the cart by its id
function selectProductById(productId) {
    const cartItems = getCartFromCookie();
    const selectedProduct = cartItems.find(item => item.id === productId);
    return selectedProduct;
}

// Set a cookie
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

// Get a cookie
function getCookie(name) {
    const cookieName = name + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}

// Remove a product from the cart in the cookie after confirmation
function removeFromCart(productId) {
    const confirmed = confirm("آیا از حذف این محصول از سبد خرید خود مطمئن هستید؟");
    if (confirmed) {
        let cartItems = JSON.parse(getCookie('cart')) || [];
        const updatedItems = cartItems.filter(item => item.id !== productId);
        setCookie('cart', JSON.stringify(updatedItems), 30);
        updateCartFront();
        if (window.location.pathname == "/order/cart/") {
            updateCartPageFront()
        }
        if (window.location.pathname == "/order/checkout/") {
            window.location.reload();
        }
        updateBackendCart();
    }
}

// Clear the cart in the cookie
function clearCartInCookie() {
    setCookie('cart', '[]'); 
    updateCartFront(); 
}

// Check if cart is empty
function isCartEmpty() {
    const cartItems = getCartFromCookie() || [];
    return cartItems.length === 0;
}

//------------Cart section------------

//fetch with authentication
async function fetchData(endpoint, method, data = null) {
    const requestOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + localStorage.getItem('access')
      }
    };
  
    if (data) {
      requestOptions.body = JSON.stringify(data);
    }
  
    try {
      const response = await fetch(endpoint, requestOptions);
  
      if (method.toUpperCase() === 'DELETE') {
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
        return { message: 'Delete successful' };
      }
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.detail || 'Something went wrong!');
      }
      
      return responseData;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }