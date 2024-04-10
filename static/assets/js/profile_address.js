
updateAddressListFront();

// Update address list front
async function updateAddressListFront() {
    $('.profile-stats').remove();
    const addressList = await fetchData('/account/api/address', 'GET');
    addressList.forEach(address => {
        createAddressContainer(address);
    });
}


function createAddressContainer(addressData) {
    let profileStats = $('<div>').addClass('profile-stats');
    let profileAddress = $('<div>').addClass('profile-address').appendTo(profileStats);
    let profileAddressItem = $('<div>').addClass('profile-address-item').appendTo(profileAddress);
    let profileAddressItemTop = $('<div>').addClass('profile-address-item-top').appendTo(profileAddressItem);
    $('<div>').addClass('profile-address-item-title').text(`${addressData.state} , ${addressData.city}`).appendTo(profileAddressItemTop);
    let uiMore = $('<div>').addClass('ui-more').appendTo(profileAddressItemTop);
    $('<button>')
    .addClass('btn-remove-address btn btn-danger')
    .attr('type', 'submit')
    .text('حذف')
    .appendTo(uiMore)
    .on('click', async function() {
        await removeAddress(addressData.id);
    });
    let profileAddressContent = $('<div>').addClass('profile-address-content').appendTo(profileAddressItem);
    let profileAddressInfo = $('<ul>').addClass('profile-address-info').appendTo(profileAddressContent);
    let li1 = $('<li>').appendTo(profileAddressInfo);
    $('<div>').addClass('profile-address-info-item location').html('<i class="mdi mdi-map-outline"></i>' + addressData.detail_address).appendTo(li1);
    let li2 = $('<li>').appendTo(profileAddressInfo);
    $('<div>').addClass('profile-address-info-item location').html('<i class="mdi mdi-phone"></i>' + addressData.phone_number).appendTo(li2);
    let li4 = $('<li>').appendTo(profileAddressInfo);
    $('<div>').addClass('profile-address-info-item location').html('<i class="mdi mdi-account"></i>' + addressData.recipient).appendTo(li4);
    let li5 = $('<li>').addClass('location-link').appendTo(profileAddressInfo);
    $('<a>').addClass('edit-address-link').attr('href', `/account/profile-address-edit/?address=${addressData.id}`).text('ویرایش آدرس').appendTo(li5);
    $(".profile-content").append(profileStats); 
}

async function removeAddress(addressId) {
    const confirmed = window.confirm('آیا از حذف این آدرس اطمینان دارید؟');
    if (confirmed) {
        await fetchData(`/account/api/address/${addressId}/`, 'DELETE');
        await updateAddressListFront();
    }
}

