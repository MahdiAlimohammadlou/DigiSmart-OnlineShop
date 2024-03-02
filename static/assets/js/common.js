

 //Start load categories
 let catesUl = document.querySelector("#cat-menu");
if (catesUl) {
    fetch('/api/categories')
    .then(response => response.json())
    .then(data => {
        data.forEach(category => {
            let catLi = document.createElement("li")
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


