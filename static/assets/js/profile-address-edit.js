
$(window).on('load', async function() {
    let allStates = await fetchCitiesData("https://iran-locations-api.ir/api/v1/fa/states");
    insertStates(allStates);
    
    var urlParams = new URLSearchParams(window.location.search);
    let isUpdatePage = false;
    if (urlParams.has("address")) {
        const addressID  = urlParams.get("address");
        let retrievedAddress = await fetchData(`/account/api/address/${addressID}/`, 'GET');
        await fillFormValues(retrievedAddress);
        isUpdatePage = true;
    }

    $('.btn-registrar').on('click', async function(e) {
        e.preventDefault();
        if (isValidAddress()) {
            const addressData = getFormData()
            if (isUpdatePage) {
                const addressID  = urlParams.get("address");
                await fetchData(`/account/api/address/${addressID}/`, 'PUT', addressData);
            } else {
                await fetchData('/account/api/address/', 'POST', addressData);
            }
            window.location.href = "/account/profile-address/";
        }
    });  
});
