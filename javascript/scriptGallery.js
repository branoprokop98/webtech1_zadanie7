let findedPictures = new Array()

let objectPosition = new Array()

let positions = new Array()

document.addEventListener("DOMContentLoaded", () => {
    let searchInput = document.getElementById("search");

    let order = getCookie("order");
    let search = getCookie("search");
    let finded = getCookie("findedPictures")


    if (search) {
        searchInput.value = search;
    }

    if (finded && search) {
        findedPictures = JSON.parse(finded);
    }

    if (order) {
        objectPosition = JSON.parse(order);
    } else {
        fetch("resources/photos.json")
            .then(response => response.json())
            .then(json => {
                for (let i = 0; i < json.photos.length; i++) {
                    objectPosition[i] = json.photos[i];
                }
            })
    }

    gallery = document.getElementById("gallery-wrapper");

    fetch("resources/photos.json")
        .then((response) => response.json())
        .then((json) => {
            if (findedPictures == 0) {
                objectPosition.forEach((item, index) => {
                    let galleryItem = document.createElement("img");
                    galleryItem.setAttribute("src", objectPosition[index].src);
                    galleryItem.classList = "thumbnail";
                    galleryItem.setAttribute("data-toggle", "modal")
                    galleryItem.setAttribute("data-target", ".bs-example-modal-lg")
                    if (galleryItem.id == "") {
                        galleryItem.id = objectPosition[index].id;
                    }
                    let id = galleryItem.id;
                    galleryItem.setAttribute("onclick", "showSlideShow(" + id + ")");
                    gallery.appendChild(galleryItem);
                });
            } else if (findedPictures.length > 0 && searchInput.value != "") {
                findedPictures.forEach((item, index) => {
                    let galleryItem = document.createElement("img");
                    galleryItem.setAttribute("src", findedPictures[index].src);
                    galleryItem.classList = "thumbnail";
                    galleryItem.setAttribute("data-toggle", "modal")
                    galleryItem.setAttribute("data-target", ".bs-example-modal-lg")
                    if (galleryItem.id == "") {
                        galleryItem.id = findedPictures[index].id;
                    }
                    let id = galleryItem.id;
                    galleryItem.setAttribute("onclick", "showSlideForFind(" + id + ")");
                    gallery.appendChild(galleryItem);
                });
            }
        });

    searchInput.addEventListener("input", (evt) => {
        fetch("resources/photos.json")
            .then(response => response.json())
            .then(json => {
                if (searchInput.value != "") {
                    findedPictures.splice(0, 4)
                    objectPosition.forEach((item, index) => {
                        if ((json.photos[index].title.includes(searchInput.value) || json.photos[index].description.includes(searchInput.value)) && searchInput.value != "") {
                            findedPictures.push(json.photos[index])
                        }
                    })
                }
                if (findedPictures.length > 0 && searchInput.value != "") {
                    clearGallery()
                    setCookie("findedPictures", JSON.stringify(findedPictures), 2);
                    findedPictures.forEach((item, index) => {
                        let galleryItem = document.createElement("img");
                        galleryItem.setAttribute("src", findedPictures[index].src)
                        let id = findedPictures[index].id
                        galleryItem.setAttribute("onclick", "showSlideForFind(" + id + ")")
                        galleryItem.classList = "thumbnail"
                        galleryItem.setAttribute("data-toggle", "modal")
                        galleryItem.setAttribute("data-target", ".bs-example-modal-lg")
                        gallery.appendChild(galleryItem)
                    })
                } else {
                    clearGallery()
                    objectPosition.forEach((item, index) => {
                        let galleryItem = document.createElement("img");
                        galleryItem.setAttribute("src", objectPosition[index].src)
                        if (galleryItem.id == "") {
                            galleryItem.id = objectPosition[index].id
                        }
                        let id = galleryItem.id;
                        galleryItem.setAttribute("onclick", "showSlideShow(" + id + ")")
                        galleryItem.classList = "thumbnail"
                        galleryItem.setAttribute("data-toggle", "modal")
                        galleryItem.setAttribute("data-target", ".bs-example-modal-lg")
                        galleryItem.id = index
                        gallery.appendChild(galleryItem)
                    });
                }
            })
        console.log(evt.target.value)
        console.log(findedPictures)
        setCookie("search", evt.target.value, 2)
    })


    function clearGallery() {
        while (gallery.lastElementChild) {
            gallery.removeChild(gallery.lastElementChild);
        }
    }


    let galleryDrag = document.getElementById("gallery-wrapper")
    let galleryDragItem = new Sortable(galleryDrag, {
        animation: 150,
        store: {
            get: function(sortable) {
                let order = localStorage.getItem(sortable.options.group.name);
                return order ? console.log(order.split("|")) : [];
            },
            set: function(sortable) {
                //setOrderPosition(sortable)
                //var orderArray = sortable.toArray();
                //localStorage.setItem(sortable.options.group.name, orderArray.join("|"));
                //console.log(sortable);
            },
        },
        onEnd: function( /**Event*/ evt) {
            var itemEl = evt.item; // dragged HTMLElement
            let oldIndex = evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
            let newIndex = evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
            console.log("old: " + evt.oldIndex);
            console.log("new: " + evt.newIndex);
            if (findedPictures.length > 0 && searchInput.value != "") {
                swapFindedPositions(newIndex, oldIndex);
            } else if (findedPictures.length == 0 && searchInput.value == "") {
                swapPositions(newIndex, oldIndex)
            }
        },
    })

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

    function setOrderPosition(sortable) {
        positions.slice(0, 4);
        let order = [],
            el,
            children = sortable.el.children,
            i = 0,
            n = children.length,
            options = sortable.options;

        for (; i < n; i++) {
            el = children[i];
            if (galleryDragItem.closest(el, sortable.options.draggable, sortable.el, false)) {
                positions.push(parseInt(el.id))
                    //order.push(el.getAttribute(sortable.options.dataIdAttr) || _generateId(el));
            }
        }

        swapPositions(positions)
    }

    function swapPositions(new_index, old_index) {
        let arr = objectPosition;
        if (old_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        objectPosition = arr;
        setCookie("order", JSON.stringify(objectPosition), 2);
    };

    function swapFindedPositions(new_index, old_index) {
        let arr = findedPictures;
        if (old_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        findedPictures = arr;
        setCookie("findedPictures", JSON.stringify(findedPictures), 2);
    }

})

function closeWindow() {
    document.getElementById('layer').style.display = 'none';
    let galleryElem = document.getElementById("slideWindow");

    while (galleryElem.lastElementChild) {
        galleryElem.removeChild(galleryElem.lastElementChild);
    }
}


function showSlideShow(id) {
    let slideArray = new Array()

    slideArray = objectPosition;

    document.getElementById("layer").style.display = 'block';
    for (let i = 0; i < slideArray.length; i++) {
        var slideWindow = document.getElementById("slideWindow");
        if (slideArray[i].id == id) {
            slideWindow.appendChild(document.createElement("div")).className = "carousel-item active"
        } else {
            slideWindow.appendChild(document.createElement("div")).className = "carousel-item"
        }
        let box = slideWindow.getElementsByClassName("carousel-item")[i];

        var image = document.createElement("img");
        image.className = "d-block w-100 mx-auto"
        image.setAttribute("src", slideArray[i].src)
        box.appendChild(image)

        var desc = document.createElement("div");
        desc.className = "modal-text"
        desc.innerHTML = "Názov: " + slideArray[i].title
        box.appendChild(desc)
    }
}

function showSlideForFind(id) {
    let slideArray = new Array()

    slideArray = findedPictures;

    document.getElementById("layer").style.display = 'block';
    for (let i = 0; i < slideArray.length; i++) {
        var slideWindow = document.getElementById("slideWindow");
        if (slideArray[i].id == id) {
            slideWindow.appendChild(document.createElement("div")).className = "carousel-item active"
        } else {
            slideWindow.appendChild(document.createElement("div")).className = "carousel-item"
        }
        let box = slideWindow.getElementsByClassName("carousel-item")[i];

        var image = document.createElement("img");
        image.className = "d-block w-75 mx-auto"
        image.setAttribute("src", slideArray[i].src)
        box.appendChild(image)

        var desc = document.createElement("div");
        desc.className = "modal-text"
        desc.innerHTML = "Názov: " + slideArray[i].title
        box.appendChild(desc)

    }
}

function cookieLayerControl() {
    document.getElementById("layer-cookie").style.display = "none"
}
