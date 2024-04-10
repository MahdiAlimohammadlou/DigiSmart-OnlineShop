async function fetchCitiesData(url) {
  try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
      return null;
  }
}

function isValidAddress() {
  $('.error-message').text('');

  let isValid = true;

  let nameValue = $('#name').val().trim();
  if (nameValue === '') {
      $('#name').prev('.error-message').text('نام تحویل گیرنده الزامی است');
      isValid = false;
  }

  let phoneValue = $('#phone-number').val().trim();
  if (phoneValue === '' || !validatePhoneNumber(phoneValue)) {
      $('#phone-number').prev('.error-message').text('شماره موبایل معتبر وارد کنید');
      isValid = false;
  }

  let addressValue = $('#address').val().trim();
  if (addressValue === '') {
      $('#address').prev('.error-message').text('آدرس الزامی است');
      isValid = false;
  }

  let postCodeValue = $('#post-code').val().trim();
  if (postCodeValue === '' || !isValidPostCode(postCodeValue)) {
      $('#post-code').prev('.error-message').text('کد پستی معتبر وارد کنید');
      isValid = false;
  }

  let bldNumValue = $('#bld-num').val().trim();
  if (bldNumValue === '') {
      $('#bld-num').prev('.error-message').text('پلاک الزامی است');
      isValid = false;
  }

  let selectedCity = $("#city").children("option:selected").val();
  if(selectedCity == "date-desc") {
      $('#city').prev('.error-message').text('استان الزامی است');
      isValid = false;
  }

  let selectedState = $("#province").children("option:selected").val();
  if(selectedState == "date-desc") {
      $('#province').prev('.error-message').text('شهر الزامی است');
      isValid = false;
  }

  $('.error-message').show();
  return isValid
}

async function fillFormValues(data) {
  $('#name').val(data.recipient || '');
  $('#phone-number').val(data.phone_number || '');
  $('#province').val(data.state || 'date-desc');
  await updateCityList($('#province').val());
  $('#city').prop('disabled', false);
  $('#city').val(data.city || 'date-desc');
  $('#address').val(data.detail_address || '');
  $('#post-code').val(data.zip_code || '');
  $('#bld-num').val(data.plate || '');
}


function getFormData () {
  const formData = {
    recipient: $('#name').val(),
    phone_number: $('#phone-number').val(),
    state: $('#province').val(),
    city: $('#city').val(),
    detail_address: $('#address').val(),
    zip_code: $('#post-code').val(),
    plate: $('#bld-num').val()
  };

  return formData;
};




function isValidPostCode(postCode) {
    let postCodePattern = /^\d{10}$/;
    return postCodePattern.test(postCode);
}

// fetchCitiesData("https://iran-locations-api.ir/api/v1/fa/states").then(allStates => {
//     insertStates(allStates);
// });

async function updateCityList(state) {
  let cities = await fetchCitiesData(`https://iran-locations-api.ir/api/v1/fa/cities?state=${state}`)
  updateCities(cities.cities);
}

$('#province').on('change', async function() {
  var selectedState = $(this).val();
  if (selectedState == "date-desc") {
    $('#city').prop('disabled', true);
    $('#city').val('date-desc');
  } else {
    $('#city').prop('disabled', false);
  }
  await updateCityList(selectedState);
});


function addOptionsToSelect(selectElement, optionsList) {
  $.each(optionsList, function(index, option) {
      const newOption = $("<option>");
      newOption.val(option.name);
      newOption.text(option.name);
      selectElement.append(newOption);
  });
}

function insertStates(optionsList) {
  let selectElement = $("#province");
  selectElement.empty();
  const defaultOption = $("<option>");
  defaultOption.val("date-desc");
  defaultOption.text("استان مورد نظر را انتخاب کنید");
  selectElement.append(defaultOption);
  addOptionsToSelect(selectElement, optionsList)
}


function updateCities(optionsList) {
  let selectElement = $("#city");
  selectElement.empty();
  const defaultOption = $("<option>");
  defaultOption.val("date-desc");
  defaultOption.text("شهر مورد نظر را انتخاب کنید");
  selectElement.append(defaultOption);
  addOptionsToSelect(selectElement, optionsList)
}





