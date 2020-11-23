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
    }
    else {
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
                    //positions.forEach((item, index) => {
                    let galleryItem = document.createElement("img");
                    galleryItem.setAttribute("src", objectPosition[index].src); //json.photos[item].src
                    galleryItem.classList = "thumbnail";
                    if (galleryItem.id == "") {
                        galleryItem.id = objectPosition[index].id; //positions[index]
                    }
                    let id = galleryItem.id;
                    galleryItem.setAttribute("onclick", "showSlideShow(" + id + ")");
                    //objectPosition[index] = galleryItem
                    gallery.appendChild(galleryItem);
                });
            }
            else if (findedPictures.length > 0 && searchInput.value != "") {
                findedPictures.forEach((item, index) => {
                    //positions.forEach((item, index) => {
                    let galleryItem = document.createElement("img");
                    galleryItem.setAttribute("src", findedPictures[index].src); //json.photos[item].src
                    galleryItem.classList = "thumbnail";
                    if (galleryItem.id == "") {
                        galleryItem.id = findedPictures[index].id; //positions[index]
                    }
                    let id = galleryItem.id;
                    galleryItem.setAttribute("onclick", "showSlideForFind(" + id + ")");
                    //objectPosition[index] = galleryItem
                    gallery.appendChild(galleryItem);
                });
            }
        });

    searchInput.addEventListener("input", (evt) => {
        findedPictures.splice(0, 4)
        fetch("resources/photos.json")
            .then(response => response.json())
            .then(json => {
                objectPosition.forEach((item, index) => {
                    if (json.photos[index].title.includes(searchInput.value) && searchInput.value != "") {
                        findedPictures.push(json.photos[index])
                    }
                })
                if (findedPictures.length > 0 && searchInput.value != "") {
                    clearGallery()
                    setCookie("findedPictures", JSON.stringify(findedPictures), 2);
                    findedPictures.forEach((item, index) => {
                        let galleryItem = document.createElement("img");
                        galleryItem.setAttribute("src", findedPictures[index].src)
                        let id = findedPictures[index].id
                        galleryItem.setAttribute("onclick", "showSlideForFind(" + id + ")")
                        galleryItem.classList = "thumbnail"
                        gallery.appendChild(galleryItem)
                        //setCookie("searchArray", JSON.stringify(findedPictures), 2);
                    })
                }
                else {
                    clearGallery()
                    objectPosition.forEach((item, index) => {
                        let galleryItem = document.createElement("img");
                        galleryItem.setAttribute("src", objectPosition[index].src)
                        if (galleryItem.id == "") {
                            galleryItem.id = objectPosition[index].id                      //positions[index]
                        }
                        let id = galleryItem.id;
                        galleryItem.setAttribute("onclick", "showSlideShow(" + id + ")")
                        galleryItem.classList = "thumbnail"
                        galleryItem.id = index
                        gallery.appendChild(galleryItem)
                        //findedPictures.splice(0, 4);
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
            get: function (sortable) {
                let order = localStorage.getItem(sortable.options.group.name);
                return order ? console.log(order.split("|")) : [];
            },
            set: function (sortable) {
                //setOrderPosition(sortable)
                //var orderArray = sortable.toArray();
                //localStorage.setItem(sortable.options.group.name, orderArray.join("|"));
                //console.log(sortable);
            },
        },
        onEnd: function (/**Event*/ evt) {
            var itemEl = evt.item; // dragged HTMLElement
            evt.to; // target list
            evt.from; // previous list
            evt.oldIndex; // element's old index within old parent
            evt.newIndex; // element's new index within new parent
            let oldIndex = evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
            let newIndex = evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
            evt.clone; // the clone element
            evt.pullMode; // when item is in another sortable: `"clone"` if cloning, `true` if moving
            console.log("old" + evt.oldIndex);
            console.log("new" + evt.newIndex);
            swapPositions(newIndex, oldIndex)
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

    // function swapPositions(newIndex, oldIndex) {

    //     if (findedPictures.length > 0) {
    //         let old = findedPictures[newIndex];

    //         console.log(findedPictures)
    //         findedPictures.splice(newIndex, 1, findedPictures[oldIndex]);
    //         findedPictures[oldIndex] = old;
    //         console.log(findedPictures)
    //         setCookie("findedPictures", JSON.stringify(findedPictures), 2);
    //     } else {
    //         let old = objectPosition[newIndex];

    //         console.log(objectPosition)
    //         objectPosition.splice(newIndex, 1, objectPosition[oldIndex]);
    //         objectPosition[oldIndex] = old;
    //         console.log(objectPosition)
    //         setCookie("order", JSON.stringify(objectPosition), 2);
    //     }
    // }

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

})

function closeWindow() {
    // let carouselItem = document.getElementsByClassName("carousel-item");
    //var tableRows = carouselItem.getElementsByTagName('img');
    //var rowCount = tableRows.length;

    // for (let i = 0; i < carouselItem.length; i++) {
    //   for(let j = 0; j < carouselItem[i].children.length; j++)
    //     carouselItem[i].children[j].removeChild("img")
    // }
    // for(let i = 0; i < carouselItem.length; i++){
    //     carouselItem[i].children.removeChild("div");
    // }
    document.getElementById('layer').style.display = 'none';
    let galleryElem = document.getElementById("slideWindow");

    while (galleryElem.lastElementChild) {
        galleryElem.removeChild(galleryElem.lastElementChild);
    }

    // let divsIngalery = galleryElem.getElementsByTagName('div');
    // let divCount = divsIngalery.length;

    // //let carouselItem = document.getElementsByClassName("carousel-item");


    // for (let i = divCount - 1; i >= 0; i--) {
    //     galleryElem.removeChild(divsIngalery[i]);
    // }
}


function showSlideShow(id) {
    let slideArray = new Array()

    slideArray = objectPosition;

    document.getElementById("layer").style.display = 'block';
    for (let i = 0; i < slideArray.length; i++) {
        var slideWindow = document.getElementById("slideWindow");
        if (slideArray[i].id == id) {
            slideWindow.appendChild(document.createElement("div")).className = "carousel-item active"
        }
        else {
            slideWindow.appendChild(document.createElement("div")).className = "carousel-item"
        }
        let box = slideWindow.getElementsByClassName("carousel-item")[i];

        var image = document.createElement("img");
        image.className = "d-block w-75 mx-auto"
        image.setAttribute("src", slideArray[i].src)
        box.appendChild(image)
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
        }
        else {
            slideWindow.appendChild(document.createElement("div")).className = "carousel-item"
        }
        let box = slideWindow.getElementsByClassName("carousel-item")[i];

        var image = document.createElement("img");
        image.className = "d-block w-100"
        image.setAttribute("src", slideArray[i].src)
        box.appendChild(image)
    }
}

function startSlideShow(){
  let galleryBox = document.getElementById("carousel-example-1z");
  galleryBox.setAttribute("data-ride", "carousel");
  galleryBox.classList.add("slide")
}

function stopSlideShow(){
  let galleryBox = document.getElementById("carousel-example-1z");
  galleryBox.removeAttribute("data-ride")
  galleryBox.classList.remove("startSlideShow")
}


function showSlideShow2(id) {

    let slideArray = new Array();
    let picId;
    for (let i = 0; i < objectPosition.length; i++) {
        if (parseInt(objectPosition[i].id) == id) {
            picId = parseInt(objectPosition[i].id);
            break;
        }
    }

    document.getElementById("layer").style.display = 'block';
    // let slideItem = document.createElement("div");
    // slideItem.classList.add("carousel-inner")
    // slideItem.setAttribute("role", "listbox")
    let divPos = 0;
    var slideWindow = document.getElementById("slideWindow");
    slideWindow.appendChild(document.createElement("div")).className = "carousel-item active"
    let box = slideWindow.getElementsByClassName("carousel-item active")[divPos];

    var image = document.createElement("img");
    image.className = "d-block w-100"
    image.setAttribute("src", objectPosition[picId].src)
    box.appendChild(image)

    let desc = document.createElement("div");
    desc.className = "text-center"
    desc.innerHTML += objectPosition[picId].title
    box.appendChild(desc)

    slideArray.splice(0, 4);
    //slideArray.push(objectPosition[picId])

    if (findedPictures.length != 0) {
        for (let i = 0; i < findedPictures.length; i++) {
            if (findedPictures[i].id != picId) {
                slideArray.push(findedPictures[i]);
                var slideWindow = document.getElementById("slideWindow");
                slideWindow.appendChild(document.createElement("div")).className = "carousel-item"
                divPos++;
                let box = slideWindow.getElementsByClassName("carousel-item")[divPos];

                var image = document.createElement("img");
                image.className = "d-block w-100"
                image.setAttribute("src", findedPictures[i].src)
                box.appendChild(image)
            }
        }
    }

    else {
        for (let i = picId; i < objectPosition.length; i++) {
            if (i != picId) {
                slideArray.push(objectPosition[i]);
                var slideWindow = document.getElementById("slideWindow");
                slideWindow.appendChild(document.createElement("div")).className = "carousel-item"
                divPos++;
                let box = slideWindow.getElementsByClassName("carousel-item")[divPos];

                var image = document.createElement("img");
                image.className = "d-block w-100"
                image.setAttribute("src", objectPosition[i].src)
                box.appendChild(image)

                let desc = document.createElement("div");
                desc.className = "text-center"
                desc.innerHTML += objectPosition[i].title

                box.appendChild(desc)
            }
        }

        for (let i = 0; i < picId; i++) {
            if (i != picId) {
                slideArray.push(objectPosition[i])
                var slideWindow = document.getElementById("slideWindow");
                slideWindow.appendChild(document.createElement("div")).className = "carousel-item"
                divPos++;
                let box = slideWindow.getElementsByClassName("carousel-item")[divPos];

                var image = document.createElement("img");
                image.className = "d-block w-100"
                image.setAttribute("src", objectPosition[i].src)
                box.appendChild(image)

                let desc = document.createElement("div");
                desc.className = "text-center"
                desc.innerHTML += objectPosition[i].title

                box.appendChild(desc)
            }
        }
    }

    //let img = box.appendChild("img")
    //let img = box.createElement("img")
    //img.setAttribute("src", objectPosition[id].src);
}

// document.getElementById("startAnimation").addEventListener("click", ()=>{
//   let galleryBox = document.getElementById("carousel-example-1z");
//   galleryBox.setAttribute("data-ride", "carousel");
// })

// document.getElementById("stopAnimation").addEventListener("click", ()=>{
//   let galleryBox = document.getElementById("carousel-example-1z");
//   galleryBox.setAttribute("data-ride", "carousel");
// })
