
function deleteDiscountCode(code) {
    fetch('/discount-codes/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Discount code deleted successfully');
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }
  
  // Example usage:
  // deleteDiscountCode('YOUR_DISCOUNT_CODE_HERE');
  
  function fetchDiscountCode(code) {
    return fetch('/discount-codes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            return false;
          }
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Discount code:', data);
        return data;
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
        throw error; 
      });
  }

  