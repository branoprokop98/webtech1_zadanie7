let draggedObject;
let hoveredObject;
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
    if (searchArrayCookie) {
        findedPictures = JSON.parse(searchArrayCookie);
    }
    if (cookieValue) {
        searchInput.value = cookieValue;
    }
    if (cookiePosition) {
        positions = JSON.parse(cookiePosition)
        objectPosition = positions
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
                if (galleryItem.id == "") {
                    galleryItem.id = positions[index]
                }
                let id = galleryItem.id;
                galleryItem.setAttribute("onclick", "showSlideShow(" + id + ")")
                objectPosition[index] = galleryItem
                gallery.appendChild(galleryItem)
                galleryItem.ondragstart = dragStart
                galleryItem.ondragover = dragOver
                galleryItem.ondragend = dragEnd
            })
            if (findedPictures.length > 0 && searchInput.value != "") {
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

var draggedID

function dragStart(evt) {
    draggedObject = evt.target
    hoveredObject = draggedObject;
    draggedID = draggedObject.id;
}

function dragOver(evt) {
    if (evt.target.id != draggedID) {
        hoveredObject = evt.target
        console.log("Hovered if: " + hoveredObject.id);
    }

    gallery.insertBefore(draggedObject, hoveredObject.nextSibling)
    console.log("Inserting: " + draggedObject.id, hoveredObject.id);
    //console.log(draggedObject, hoveredObject);
}

function dragEnd(evt) {
    // let tmp = objectPosition[draggedObject.id]
    // objectPosition[draggedObject.id] = objectPosition[4];
    // objectPosition[4] = tmp;
    let dragIdx = objectPosition.indexOf(draggedObject);
    let hoverIdx = objectPosition.indexOf(hoveredObject);

    shiftPosition(dragIdx, hoverIdx);
}

function clearGallery() {
    while (gallery.lastElementChild) {
        gallery.removeChild(gallery.lastElementChild);
    }
}

function shiftPosition(start, end) {
    let tmp = Array();
    if (start < end) {
        for (let i = 0; i < start; i++) {
            tmp[i] = objectPosition[i];
        }
        for (let i = start; i < end; i++) {
            tmp[i] = objectPosition[parseInt(i) + 1];
        }
        for (let i = end; i < objectPosition.length; i++) {
            tmp[i] = objectPosition[i];
        }
    }
    tmp[end] = objectPosition[start]
    for (let i = 0; i < tmp.length; i++) {
        positions[i] = parseInt(objectPosition[i].id);
    }
    setCookie("position", JSON.stringify(positions), 2);
    objectPosition = tmp;
    console.log(tmp);
}

function closeWindow() {
    document.getElementById('layer').style.display = 'none';
    var elmtTable = document.getElementsByClassName("carousel-item active")[0];
    var tableRows = elmtTable.getElementsByTagName('img');
    var rowCount = tableRows.length;

    for (var x = rowCount - 1; x >= 0; x--) {
        elmtTable.removeChild(tableRows[x]);
    }
    
    let galleryElem = document.getElementById("slideWindow");
    let divsIngalery =  galleryElem.getElementsByTagName('div');
    let divCount = divsIngalery.length;

    for(let i = divCount-1; i >=0; i--){
        galleryElem.removeChild(divsIngalery[i]);
    }

}


function showSlideShow(id) {

    let picId;
    for(let i = 0; i < objectPosition.length; i++){
        if(parseInt(objectPosition[i].id) == id){
            picId = i;
            break;
        }
    }

    document.getElementById("layer").style.display = 'block';
    // let slideItem = document.createElement("div");
    // slideItem.classList.add("carousel-inner")
    // slideItem.setAttribute("role", "listbox")
    var slideWindow = document.getElementById("slideWindow");
    slideWindow.appendChild(document.createElement("div")).className = "carousel-item active"
    let box = slideWindow.getElementsByClassName("carousel-item active")[0];
    
    var image = document.createElement("img");
    image.className = "d-block w-100"
    image.setAttribute("src", objectPosition[picId].src)
    box.appendChild(image)
    
    //let img = box.appendChild("img")
    //let img = box.createElement("img")
    //img.setAttribute("src", objectPosition[id].src);
}
