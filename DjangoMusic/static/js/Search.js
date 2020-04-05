window.onload = function () {
    //歌曲搜索结果加载

    for (var i = 0; i < songList_elemt.length; i++) {

        var tr = document.createElement("tr");
        var th0 = document.createElement("th");
        th0.setAttribute("class", "num");
        th0.innerHTML = i + 1;
        tr.appendChild(th0);

        var th1 = document.createElement("th");
        th1.setAttribute("class", "play_img");

        var th1_a = document.createElement("a");
        var url = "/music_player_song" + "/?value=" + value + "&songid=" + songList_elemt[i]['song_id']; //
        th1_a.classList.add("play_a");
        th1_a.setAttribute("target", "_blank");
        th1_a.setAttribute("href", url);

        var th1_i = document.createElement("i");
        th1_i.setAttribute("class", "fa fa-play");
        th1_i.setAttribute("aria-hidden", "true");
        th1_a.appendChild(th1_i);
        th1.appendChild(th1_a);
        tr.appendChild(th1);

        for (let key in songList_elemt[i]) {
            if (key == "song_id") {
                continue;
            }
            var th = document.createElement("th");
            th.setAttribute("class", key);
            th.innerHTML = songList_elemt[i][key];
            tr.appendChild(th);
        }
        var th2 = document.createElement("th");
        th2.setAttribute("class", "add_tolist");
        tr.appendChild(th2);
        var th2_i = document.createElement("i");
        th2_i.setAttribute("class", "fa fa-plus");
        th2_i.id = songList_elemt[i]["song_id"];
        th2_i.setAttribute("aria-hidden", "true");

        th2.appendChild(th2_i);

        document.getElementsByClassName("songList_main")[0].appendChild(tr);
    }


    //歌单搜索结果加载
    for (var i = 0; i < songListS_elemt.length; i++) {

        var tr = document.createElement("tr");
        tr.setAttribute("class", "playlist_main");

        var th1 = document.createElement("th");
        th1.innerHTML = i + 1;
        tr.appendChild(th1);

        for (let key in songListS_elemt[i]) {
            if (key == "playlist_id") {
                continue;
            }
            if (key == "playlist_flag") {
                continue;
            } else {
                var th = document.createElement("th");
                th.setAttribute("class", key);
                th.innerHTML = songListS_elemt[i][key];
                tr.appendChild(th);
            }
        }
        var th2 = document.createElement("th");
        th2.setAttribute("class", "like");
        tr.appendChild(th2);
        var th2_i = document.createElement("i");
        th2_i.setAttribute("class", "fa fa-heart");
        th2_i.setAttribute("aria-hidden", "true");
        th2_i.id = songListS_elemt[i]["playlist_id"];

        if (songListS_elemt[i]["playlist_flag"] == "1") {
            th2_i.selected = 1;
            th2_i.style.color = "red";
        }
        th2.appendChild(th2_i);

        var a = document.createElement("a");
        var url = "/single_playlist_info/?id=" + songListS_elemt[i]["playlist_id"];
        a.setAttribute("herf", url);
        a.setAttribute("class", "toplaylist_a");
        tr.appendChild(a);
        document.getElementsByClassName("songs_listT")[0].appendChild(tr);
    }



    var hearts = document.getElementsByClassName("fa fa-heart");
    for (var i = 0; i < hearts.length; i++) {
        if (hearts[i].selected != false)
            continue;
        else {
            hearts[i].selected = false;
            hearts[i].style.color = '#fff';
        }

    }

    flag = 0;

    function change() {
        var name = this.className;
        if (name == "fa fa-pause") {
            this.setAttribute("class", "fa fa-play");

            flag = 0;
        } else if (flag == 0 && name == "fa fa-play") {
            this.setAttribute("class", "fa fa-pause");
            flag = 1;
        } else if (flag == 1 && name == "fa fa-play") {
            var sub_arr = document.getElementsByClassName("fa fa-pause")[0];
            sub_arr.setAttribute("class", "fa fa-play");
            this.setAttribute("class", "fa fa-pause");
            flag = 1;
        }
    }

    function like_color() {
        collect_playlist(this.id);
        if (this.selected)
            this.style.color = '#000';
        else
            this.style.color = '#f00';
        this.selected = !this.selected;

    }

    function collect_playlist(list_id) //利用ajax向后台发送歌单id
    {

        var xmlhttp = new XMLHttpRequest(); // 创建http请求
        xmlhttp.onreadystatechange = function () { // 当http请求的状态变化时执行
            if (xmlhttp.readyState == 4) { // 4-已收到http响应数据
                if (xmlhttp.status >= 200 && xmlhttp.status < 300 || xmlhttp.status == 304) {

                    list_id = list_id;
                } else {
                    alert("error");
                }
            }
        }


        // 打开http请求（open）的参数： get|post， url，是否异步发送
        var url = "/ajax_addsonglist?songlistid=" + list_id;
        xmlhttp.open("get", url, true);

        xmlhttp.send(null); //发送http请求。 get只能用null作为参数

    }

    function change_mode() {

        var name = this.className;
        if (name == "single_song") {
            var sub1 = document.getElementsByClassName("single_song")[0];
            sub1.style.backgroundColor = "skyblue";

            var sub2 = document.getElementsByClassName("songs")[0];
            sub2.style.backgroundColor = "rgb(102, 100, 96)";

            var sub3 = document.getElementById("t2");
            sub3.style.display = "none";

            var sub4 = document.getElementById("t1");
            sub4.style.display = "inline";
        } else {
            var sub1 = document.getElementsByClassName("songs")[0];
            sub1.style.backgroundColor = "skyblue";

            var sub2 = document.getElementsByClassName("single_song")[0];
            sub2.style.backgroundColor = "rgb(102, 100, 96)";

            var sub3 = document.getElementById("t1");
            sub3.style.display = "none";

            var sub4 = document.getElementById("t2");
            sub4.style.display = "inline";
        }
    }

    function show_box() {

        var list_div = document.getElementsByClassName("add_toMylist")[0];
        showShadow();

        list_div.style.display = "inline-block";
        list_div.style.top = "" + 4 * document.documentElement.clientHeight / 12 + "px";
        list_div.style.left = "" + 4 * document.documentElement.scrollWidth / 12 - 30 + "px";
        show_songlist(this.id);
    }



    function show_songlist(this_songid) {

        click_songid = this_songid;
        get_list(this_songid); //
        //根据得到的歌单数据， 动态地显示我的歌单


    }

    function get_list(this_songid) //向后台发送get请求，得到歌单数据
    {

        //发送加入歌单的请求post
        // var data = xmlhttp.responseText;
        //         data = JSON.parse(data);
        //         musicList[cur_music]['picture_url'] = data['picture_url']
        //         musicList[cur_music]['song_url'] = data['song_url']
        //         musicList[cur_music]['words'] = data['words']
        var xmlhttp = new XMLHttpRequest(); // 创建http请求
        xmlhttp.onreadystatechange = function () { // 当http请求的状态变化时执行
            if (xmlhttp.readyState == 4) { // 4-已收到http响应数据
                if (xmlhttp.status >= 200 && xmlhttp.status < 300 || xmlhttp.status == 304) {
                    var data = xmlhttp.responseText;
                    my_songlist = JSON.parse(data);
                    var lt = document.getElementsByClassName("list_info");
                    var par = document.getElementsByClassName("add_toMylist")[0];

                    if (lt != "") {
                        for (var i = 0;;) {
                            if (lt.length == 0)
                                break;
                            par.removeChild(lt[i]);
                        }
                    }

                    for (var i = 0; i < my_songlist.length; i++) {

                        var div = document.createElement("div");
                        div.setAttribute("class", "list_info");
                        div.id = my_songlist[i]["play_listid"];
                        // alert("list")
                        // alert(my_songlist[i]["playlist_id"]);
                        div.songid = this_songid;

                        var list_img = document.createElement("img");
                        list_img.setAttribute("class", "list_img");
                        list_img.setAttribute("src", my_songlist[i]["list_img"]);

                        div.appendChild(list_img);

                        var div1 = document.createElement("span");
                        div1.setAttribute("class", "list_name");
                        div1.innerHTML = my_songlist[i]["list_name"];
                        div.appendChild(div1);

                        var div2 = document.createElement("span");
                        div2.setAttribute("class", "list_num");
                        div2.innerHTML = my_songlist[i]["list_num"];
                        div.appendChild(div2);

                        document.getElementsByClassName("add_toMylist")[0].appendChild(div);
                    }
                    var is = document.querySelectorAll('.list_info'); // 添加到我的歌单时，选择相应的歌单
                    for (var i = 0; i < is.length; i++) {
                        is[i].onclick = add_list;
                    }
                } else {
                    alert("error");
                }
            }
        }
        // 打开http请求（open）的参数： get|post， url，是否异步发送
        xmlhttp.open("get", "/ajax_songlist", true);

        xmlhttp.send(null); //发送http请求。 get只能用null作为参数
    }

    function showShadow() { //变灰色  
        var shadow = document.getElementById("shadow");
        shadow.style.width = "" + document.documentElement.scrollWidth + "px";
        if (document.documentElement.clientHeight > document.documentElement.scrollHeight)
            shadow.style.height = "" + document.documentElement.clientHeight + "px";
        else
            shadow.style.height = "" + document.documentElement.scrollHeight + "px";
        shadow.style.display = "block";
    }

    function hidebox() {
        var list_div = document.getElementsByClassName("add_toMylist")[0];
        var shadow = document.getElementById("shadow");
        list_div.style.display = "none";
        shadow.style.display = "none";
    }

    function add_list() {
        var collected;
        var xmlhttp = new XMLHttpRequest(); // 创建http请求
        xmlhttp.onreadystatechange = function () { // 当http请求的状态变化时执行
            if (xmlhttp.readyState == 4) { // 4-已收到http响应数据
                if (xmlhttp.status >= 200 && xmlhttp.status < 300 || xmlhttp.status == 304) {
                    collected = xmlhttp.responseText;
                    collected = JSON.parse(collected);
                    alert(collected["message"]);
                } else {
                    alert("error");
                }
            }
        }

        // 打开http请求（open）的参数： get|post， url，是否异步发送
        var url = "/ajax_addsong?songlistid=" + this.id + "&songid=" + click_songid;

        xmlhttp.open("get", url, true);
        xmlhttp.send(null); //发送http请求。 get只能用null作为参数
        hidebox();




    }

    function send_search() { //搜索结果跳转
        var a = document.getElementById("search_a");
        var text = document.getElementById("search_word").value;
        if (text == "") {
            alert("输入不能为空");
            return;
        }
        var url = "/Search" + "/?value=" + text;
        a.href = url;
        var clickevent = document.createEvent("MouseEvent");
        clickevent.initEvent("click", true, true);
        a.dispatchEvent(clickevent);
    }

    function toPlaylist(i) //跳转到歌单详情界面
    {
        return function () {
            this.style.backgroundColor = "skyblue";
            var a1 = document.getElementsByClassName("toplaylist_a")[i]; //这边需要参数
            window.open(a1.getAttribute("herf"), "_self");

        }

    }

    var is = document.querySelectorAll('.songListT_name '); //点击进入歌单详情
    for (var i = 0; i < is.length; i++) {
        is[i].onclick = toPlaylist(i);
    }
    var is = document.querySelectorAll(' .songListT_num '); //点击进入歌单详情
    for (var i = 0; i < is.length; i++) {
        is[i].onclick = toPlaylist(i);
    }
    var is = document.querySelectorAll('  .songList_songauthor '); //点击进入歌单详情
    for (var i = 0; i < is.length; i++) {
        is[i].onclick = toPlaylist(i);
    }



    var is = document.querySelectorAll('.search > i'); //点击搜索图标
    for (var i = 0; i < is.length; i++) {
        is[i].onclick = send_search;
    }


    var is = document.querySelectorAll('.close > i'); //添加到我的歌单时，右上角的x号
    for (var i = 0; i < is.length; i++) {
        is[i].onclick = hidebox;
    }

    var is = document.querySelectorAll('.add_tolist > i'); //点击加号，添加到我的歌单
    for (var i = 0; i < is.length; i++) {
        is[i].onclick = show_box;
    }

    var is = document.querySelectorAll('.play_img > i'); //点击播放歌曲
    for (var i = 0; i < is.length; i++) {
        is[i].onclick = change;
    }

    var is = document.querySelectorAll('.like > i'); //点击收藏歌单
    for (var i = 0; i < is.length; i++) {
        is[i].onclick = like_color;
    }
    var is = document.querySelectorAll('.choose_mode > span'); //点击切换歌曲歌单
    for (var i = 0; i < is.length; i++) {
        is[i].onclick = change_mode;
    }

}