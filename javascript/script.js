let draggedObject;
let hoveredObject;
let gallery;

let positions = [2, 4, 3, 1, 0];

document.addEventListener("DOMContentLoaded", () => {

    gallery = document.getElementById("gallery-wrapper");

    const searchInput = document.getElementById("search")
    const cookieValue = getCookie("search");
    const cookiePosition = getCookie("position");
    JSON.stringify(positions);
    console.log(cookieValue)
    if(cookieValue){
        searchInput.value = cookieValue;
    }
    if(cookiePosition){
        positions = JSON.parse(cookiePosition)
        console.log(positions);
        console.log(cookiePosition);
    }

    searchInput.addEventListener("input", (evt)=>{
        console.log(evt.target.value)
        setCookie("search", evt.target.value, 2)
    })

    fetch("resources/photos.json")
        .then(response => response.json())
        .then(json => {
            positions.forEach((item, index) => {
                let galleryItem = document.createElement("img");
                galleryItem.setAttribute("src", json.photos[item].src)
                galleryItem.classList = "thumbnail"
                galleryItem.id = index
                positions.push(index);
                gallery.appendChild(galleryItem)
                galleryItem.ondragstart = dragStart

                galleryItem.ondragover = dragOver
            });
        })
    setCookie("position", JSON.stringify(positions), 2);
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function dragStart(evt) {
    draggedObject = evt.target
}

function dragOver(evt) {
    hoveredObject = evt.target

    gallery.insertBefore(draggedObject, hoveredObject.nextSibling)
}