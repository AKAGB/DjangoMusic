window.onload = function () {
    var
        points = document.getElementsByClassName('points'),
        container = document.getElementById('container'),
        imgList = document.getElementById('img-box').children,
        toLeft = document.getElementById('toLeft'),
        toRight = document.getElementById('toRight'),
        icon_search = document.querySelector('.icon-search'),
        bar = document.querySelector('.bar'),
        form_search = document.querySelector('.form-search'),
        rs_btn = document.querySelector('.rs-btn'),
        search_text = document.querySelector('#search-text');
    

    // Define Function
    var
        setMiddle = function (index) {
            // 将index对应的img置于中间，并将另两张置于左右
            var
                rightI = (index + 1) % 3,
                leftI = (index + 2) % 3;
            for (var i = 0; i < imgList.length; i++) {
                imgList[i].classList.remove('left', 'middle', 'right');
            }
            imgList[index].classList.add('middle');
            imgList[leftI].classList.add('left');
            imgList[rightI].classList.add('right');
        },

        setPointActive = function (index) {
            for (var i = 0; i < points.length; i++) {
                points[i].classList.remove('active');
            }
            points[index].classList.add('active');
        },

        changePointState = function () {
            // 改变点的状态，并确定对应图片
            setPointActive(this.index);
            setMiddle(this.index);
        },

        move = function (direction) {
            // 根据direction决定参数，返回一个移动函数，该移动时长1s
            // 该函数不是必要的，可将toLeft和toRight的onclick使用的moveClick替换为这个函数
            var params = {
                'left': ['left', 'actionRight'],
                'right': ['right', 'actionLeft']
            };
            return function () {
                var
                    middleI = document.getElementsByClassName(params[direction][0])[0].index,
                    rightI = (middleI + 1) % 3,
                    leftI = (middleI + 2) % 3;
                for (var i = 0; i < imgList.length; i++) {
                    imgList[i].classList.add(params[direction][1]);
                }
                setTimeout(function () {
                    for (var i = 0; i < imgList.length; i++) {
                        imgList[i].classList.remove('left', 'middle', 'right', params[direction][1]);
                    }
                    imgList[middleI].classList.add('middle');
                    imgList[leftI].classList.add('left');
                    imgList[rightI].classList.add('right');
                    setPointActive(imgList[middleI].index);
                }, 1000);
            }
        },

        moveClick = function (direction) {
            // 返回移动函数，移动无间隔
            return function () {
                var middleI = document.getElementsByClassName(direction)[0].index;
                var clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent('click', true, true);
                points[middleI].dispatchEvent(clickEvent);
            }
        },

        autoMove = function () {
            var
                middleI = document.getElementsByClassName('right')[0].index,
                rightI = (middleI + 1) % 3,
                leftI = (middleI + 2) % 3;
            for (var i = 0; i < imgList.length; i++) {
                imgList[i].classList.add('actionLeft');
            }
            setTimeout(function () {
                for (var i = 0; i < imgList.length; i++) {
                    imgList[i].classList.remove('left', 'middle', 'right', 'actionLeft');
                }
                imgList[middleI].classList.add('middle');
                imgList[leftI].classList.add('left');
                imgList[rightI].classList.add('right');
                setPointActive(imgList[middleI].index);
                timeId = setTimeout(autoMove, 2000);
                if (inContainer)
                    clearTimeout(timeId);
            }, 1000);
        },

        searchClick = function () {
            icon_search.style.width = '300px';
            bar.style.display = 'none';
            rs_btn.style.display = 'block';
            form_search.style.display = 'inline';
            form_search.focus();
        },

        rsBtnClick = function (event) {
            event.stopPropagation();
            form_search.value = '';
            form_search.style.display = 'none';
            rs_btn.style.display = 'none';
            icon_search.style.width = '30px';
            setTimeout(function () {
                bar.style.display = 'block';
            }, 500);
        },

        searchSubmit = function () {
            icon_search.submit();
        };

    for (var i = 0; i < points.length; i++) {
        points[i].index = i;
        imgList[i].index = i;
        points[i].onclick = changePointState;
    }

    toLeft.onclick = move('left');
    toRight.onclick = move('right');
    icon_search.onclick = searchClick;
    rs_btn.onclick = rsBtnClick;
    search_text.onkeypress = function (event) {
        if (event.keyCode == 13) {
            searchSubmit();
        }
    }



    container.onmouseover = function () {
        toLeft.style.display = 'block';
        toRight.style.display = 'block';
        inContainer = true;
        if (inContainer)
            clearTimeout(timeId);
    }

    container.onmouseout = function () {
        toLeft.style.display = 'none';
        toRight.style.display = 'none';
        inContainer = false;
        timeId = setTimeout(autoMove, 0);
        if (inContainer)
            clearTimeout(timeId);
    }

    inContainer = false;
    timeId = setTimeout(autoMove, 2000);
    if (inContainer)
        clearTimeout(timeId);

    for (var i = 0; i < imgList.length; i++) {
        var list_a = document.createElement("a");
        list_a.setAttribute("href", "/single_playlist_info/?id=" + recommandMusic[i]['list_id']);
        list_a.innerHTML = '<div class="playlist_img" style="background-image: url(' + recommandMusic[i]['list_picture'] + ')"></div><p class="playlist_name">' + recommandMusic[i]['list_name'] + '</p>';
        imgList[i].appendChild(list_a);
    }
}