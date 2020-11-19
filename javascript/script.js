let draggedObject;
let hoveredObject = -1;
let gallery;
let findedPictures = new Array()

let objectPosition = new Array()

let positions = [0, 1, 2, 3, 4];

document.addEventListener("DOMContentLoaded", () => {

    gallery = document.getElementById("gallery-wrapper");

    const searchInput = document.getElementById("search")
    const cookieValue = getCookie("search");
    const cookiePosition = getCookie("position");
    const searchArrayCookie = getCookie("searchArray");
    JSON.stringify(positions);
    console.log(cookieValue)
    if(searchArrayCookie){
        findedPictures = JSON.parse(searchArrayCookie);
    }
    if (cookieValue) {
        searchInput.value = cookieValue;
    }
    if (cookiePosition) {
        positions = JSON.parse(cookiePosition)
        console.log(positions);
        console.log(cookiePosition);
    }

    searchInput.addEventListener("input", (evt) => {
        findedPictures.splice(0, 4)
        fetch("resources/photos.json")
            .then(response => response.json())
            .then(json => {
                positions.forEach((item, index) => {
                    if (json.photos[item].title.includes(searchInput.value) && searchInput.value != "") {
                        findedPictures.push(json.photos[item])
                    }
                })
                if (findedPictures.length > 0 && searchInput.value != "") {
                    clearGallery()
                    findedPictures.forEach((item, index) => {
                        let galleryItem = document.createElement("img");
                        galleryItem.setAttribute("src", findedPictures[index].src)
                        galleryItem.classList = "thumbnail"
                        gallery.appendChild(galleryItem)
                        galleryItem.ondragstart = dragStart
                        galleryItem.ondragover = dragOver
                        setCookie("searchArray", JSON.stringify(findedPictures), 2);
                    })
                }
                else {
                    clearGallery()
                    positions.forEach((item, index) => {
                        let galleryItem = document.createElement("img");
                        galleryItem.setAttribute("src", json.photos[item].src)
                        galleryItem.classList = "thumbnail"
                        galleryItem.id = index
                        gallery.appendChild(galleryItem)
                        galleryItem.ondragstart = dragStart
                        galleryItem.ondragover = dragOver
                    });
                }
            })
        console.log(evt.target.value)
        console.log(findedPictures)
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
                objectPosition[index] = galleryItem
                gallery.appendChild(galleryItem)
                galleryItem.ondragstart = dragStart
                galleryItem.ondragover = dragOver
                galleryItem.ondragend = dragEnd
            })
            if(findedPictures.length > 0 && searchInput.value != ""){
                clearGallery()
                findedPictures.forEach((item, index) => {
                    let galleryItem = document.createElement("img");
                    galleryItem.setAttribute("src", findedPictures[index].src)
                    galleryItem.classList = "thumbnail"
                    galleryItem.id = index
                    gallery.appendChild(galleryItem)
                    galleryItem.ondragstart = dragStart
                    galleryItem.ondragover = dragOver
                });
            }
        })



    setCookie("position", JSON.stringify(positions), 2);
    console.log(positions.toString())
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
    if(evt.target.id != hoveredObject.id){
        hoveredObject = evt.target
        console.log(hoveredObject);
    }

    gallery.insertBefore(draggedObject, hoveredObject.nextSibling)
    console.log(draggedObject.id, hoveredObject.id);
    //console.log(draggedObject, hoveredObject);
}

function dragEnd(evt){
    let tmp = objectPosition[draggedObject.id]
    objectPosition[draggedObject.id] = objectPosition[hoveredObject.id];
    objectPosition[hoveredObject.id] = tmp;
}

function clearGallery() {
    while (gallery.lastElementChild) {
        gallery.removeChild(gallery.lastElementChild);
    }
}