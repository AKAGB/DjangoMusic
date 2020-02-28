window.onload = function () {
    // 改变播放列表播放图标
    function changePlayIcon(index) {
        var bro = document.getElementsByClassName('songList_main')[0].querySelectorAll('i');
        for (var i = 0; i < bro.length; i++) {
            bro[i].setAttribute("class", "fa fa-play");
        }
        bro[index].setAttribute("class", "fa fa-pause");
    }

    // 点击播放列表的播放按键
    function change() {
        var name = this.className;
        if (name == "fa fa-play") {
            var index = parseInt(this.parentNode.parentNode.children[0].innerHTML) - 1;
            playAudio(index);
            cur_music = index;
        }
    }

    function scroll(event) {
        height = document.getElementsByTagName('p')[2].offsetHeight;
        origin = document.getElementById("Song_Word_inner").offsetTop;
        bottom = -document.getElementById("Song_Word_inner").offsetHeight;
        if (event.wheelDelta < 0) {
            if (origin > bottom + 5 * height) {
                document.getElementById("Song_Word_inner").style.top = origin - height + 'px';
            }
        } else {
            if (origin != 0) {
                document.getElementById("Song_Word_inner").style.top = origin + height + 'px';
            }
        }
    }
    document.getElementById("Song_Word_box").addEventListener("wheel", scroll);



    // 控制组件的js
    // 将xx:xx格式的时间转换为秒数
    function time2second(timetext) {
        var ts = timetext.split(':');
        return parseInt(ts[0]) * 60 + parseInt(ts[1]);
    }

    function second2time(second) {
        var minute = '' + Math.floor(second / 60),
            second = '' + second % 60;
        if (minute.length == 1)
            minute = '0' + minute;
        if (second.length == 1)
            second = '0' + second;
        return minute + ':' + second;
    }



    // 改变音乐当前时间，参数为百分比
    function changeCurTime(percent) {
        var cur_time = document.getElementById('cur-time'),
            total_time = document.getElementById('total-time');
        var new_time = parseInt(percent * time2second(total_time.innerHTML));
        new_time = second2time(new_time);
        cur_time.innerHTML = new_time;
    }

    // 拖拽进度点事件
    function pointMouseDown(event) {
        pointMove = (this.parentNode.id == 'music-progress') ? 0 : 1;

        audio.ontimeupdate = null;
        var rex = event.clientX - this.offsetLeft;
        var point = this,
            his = this.parentNode.children[1];
        document.body.onmousemove = function (e) {
            var xX = e.clientX - rex;
            if (xX < 0)
                xX = 0;
            else if (xX > point.MAXVALUE) {
                xX = point.MAXVALUE;
            }
            point.style.left = '' + xX + 'px';
            his.style.width = '' + xX + 'px';
            var per = xX / point.MAXVALUE;
            if (pointMove == 0) {
                changeCurTime(per);
            } else {
                setVolume();
            }
        };
    }

    function pointMouseUp() {
        document.body.onmousemove = null;
        if (pointMove == 0) {
            var time = document.getElementById('cur-time').innerHTML;
            time = time2second(time);
            audio.currentTime = time;
        }
        audio.ontimeupdate = synchronize;
    }

    // 点击进度条
    function barClick(event) {
        var rex = event.offsetX,
            point = this.parentNode.children[2],
            his = this.parentNode.children[1];
        point.style.left = '' + rex + 'px';
        his.style.width = '' + rex + 'px';
        var per = rex / point.MAXVALUE;
        audio.ontimeupdate = null;
        if (this.parentNode.id == 'music-progress') {
            //audio.fastSeek(per * audio.duration);
            audio.currentTime = per * audio.duration;
        } else {
            setVolume();
        }
        audio.ontimeupdate = synchronize;
    }

    // 播放或暂停的click回调
    function playOrPause() {
        var i = this.children[0];
        i.classList.remove(playClass[playState]);
        playState = 1 - playState;
        i.classList.add(playClass[playState]);
        if (playState == 0)
            audio.play();
        else
            audio.pause();
    }

    // 设置时间，同时改变进度条和时间字符串
    function setTime(per) {
        changeCurTime(per);
        var
            progress = document.querySelector('#music-player-controller .progress'),
            xX = parseInt(per * progress.children[2].MAXVALUE);
        progress.children[1].style.width = '' + xX + 'px';
        progress.children[2].style.left = '' + xX + 'px';
    }

    // 设置进度条模块
    function setBar(index) {
        var
            music_info = document.getElementById('music-info'),
            total_time = document.getElementById('total-time');
        music_info.innerHTML = musicList[index]['songList_songname'] + ' - ' + musicList[index]['songList_songauthor'];
        total_time.innerHTML = musicList[index]['songList_songtime'];
        setTime(0);
    }

    // 设置歌词模块
    function setLyrics(index) {
        var
            song_img = document.getElementById('singer_img'),
            song_name = document.getElementById('song_info_name'),
            songList_songauthor = document.getElementById('song_info_singer'),
            songList_album = document.getElementById('song_info_album'),
            song_word = document.getElementById('Song_Word_inner'),
            text = musicList[index]['words'].split('\n');

        lyric_time = [];

        song_img.style.backgroundImage = 'url(' + musicList[index]['picture_url'] + ')';
        song_name.innerHTML = '歌曲名：' + musicList[index]['songList_songname'];
        songList_songauthor.innerHTML = '歌手名：' + musicList[index]['songList_songauthor'];
        songList_album.innerHTML = '专辑名：' + musicList[index]['songList_album'];

        song_word.innerHTML = '';
        //初始化歌词滚动时间列表lyrix_time
        for (var i = 0; i < text.length; i++) {
            var p = document.createElement('p');
            p.setAttribute('class', 'lyric_word_p');
            p.innerHTML = text[i].substr(text[i].indexOf(']') + 1);
            var tmp = text[i].substr(text[i].indexOf('[') + 1, text[i].indexOf(']') - 1);
            if (tmp.length) {
                var arr = tmp.split(":"),
                    cnt = 0;
                for (var j = 0; j < arr.length; j++) {
                    cnt = cnt * 60 + parseFloat(arr[j]);
                }
                lyric_time.push(cnt);
            }
            p.setAttribute('data-id', 'line_' + i);
            song_word.appendChild(p);
        }
    }

    // 播放音乐
    function playAudio(index) {

        var url = '/get_music_detail/?id=' + musicList[index]['song_id'];
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status >= 200 && xmlhttp.status < 300 ||
                    xmlhttp.status == 304) {
                    var data = xmlhttp.responseText;
                    data = JSON.parse(data);
                    musicList[index]['picture_url'] = data['picture_url']
                    musicList[index]['song_url'] = data['song_url']
                    musicList[index]['words'] = data['words']

                    setBar(index);
                    setLyrics(index);
                    changePlayIcon(index);
                    audio.setAttribute('src', musicList[index]['song_url']);
                    playState = 1;
                    var clickEvent = document.createEvent('MouseEvent'),
                        playButton = document.getElementById('play');
                    clickEvent.initEvent('click', true, true);
                    playButton.dispatchEvent(clickEvent);
                } else {
                    console.log('failed');
                }
            }
        }

        xmlhttp.open('get', url, true);
        xmlhttp.send(null);

    }

    // 同步时间和进度条
    function synchronize() {
        setTime(audio.currentTime / audio.duration);
        setLyricsTime();
    }

    // 设置音量
    function setVolume() {
        var point = document.querySelector('#volume-progress .progress-point');
        audio.volume = point.offsetLeft / point.MAXVALUE;
    }

    // 音量键回调
    function volumeClick() {
        var progress = document.querySelector('#volume-progress');
        if (volumeState == 1) {
            progress.children[1].style.width = '0px';
            progress.children[2].style.left = '0px';
            setVolume();
        } else {
            // -144
            var total = progress.offsetWidth;
            progress.children[1].style.width = '' + (0.5 * total) + 'px';
            progress.children[2].style.left = '' + (0.5 * total) + 'px';
            setVolume();
        }
    }

    // 音量改变
    function volumeChange() {
        var volumeIcon = document.querySelector('#volume .volumn-icon');
        if (audio.volume == 0 && volumeState == 1) {
            volumeIcon.style.backgroundPosition = '0px -181px';
            volumeState = 0;
        } else if (volumeState == 0) {
            volumeIcon.style.backgroundPosition = '0px -143px';
            volumeState = 1;
        }

    }

    //同步歌词
    function setLyricsTime() {
        var index = 0;
        var inner = document.getElementById("Song_Word_inner");
        for (; index < lyric_time.length - 1; index++) {
            if (audio.currentTime >= lyric_time[index] && audio.currentTime < lyric_time[index + 1]) {
                break;
            }
        }
        if (index == lyric_time.length - 1 && lyric_time[0] > audio.currentTime) {
            index = 0;
        }
        var ps = document.getElementsByClassName('lyric_word_p');
        if (ps.length <= 2) {
            inner.style.top = 15 + 'px';
            return;
        }
        var height = ps[2].offsetHeight;
        inner.style.top = -height * index + 'px';
        inner.children[index].style.fontSize = '1.5em';
        inner.children[index].style.color = 'yellow';
        for (var i = index - 1; i >= 0; i--) {
            inner.children[i].style.fontSize = '1.1em';
            inner.children[i].style.color = 'white';
        }
        for (var i = index + 1; i < lyric_time.length; i++) {
            inner.children[i].style.fontSize = '1.1em';
            inner.children[i].style.color = 'white';
        }
    }

    // 播放模式Click
    function playModeClick() {
        playMode = (playMode + 1) % 3;
        if (playMode == 0)
            this.style.backgroundPosition = '0px -206px';
        else if (playMode == 1)
            this.style.backgroundPosition = '0px -233px';
        else
            this.style.backgroundPosition = '0px -72px';

    }

    // 切下一首歌Click
    function getNext() {
        if (playMode == 0)
            cur_music = (cur_music + 1) % musicList.length;
        else if (playMode == 1)
            cur_music = cur_music;
        else if (playMode == 2)
            cur_music = Math.floor(Math.random() * musicList.length);

        playAudio(cur_music);
    }

    // 切上一首歌
    function getPrevious() {
        if (playMode == 0)
            cur_music = (cur_music - 1 + musicList.length) % musicList.length;
        else if (playMode == 1)
            cur_music = cur_music;
        else if (playMode == 2)
            cur_music = Math.floor(Math.random() * musicList.length);

        playAudio(cur_music);
    }

    // 下载Click
    function downloadClick() {
        var music_link = document.querySelector('#download-link');
        music_link.href = musicList[cur_music]['song_url'];
        music_link.download = musicList[cur_music]['songList_songname'] + '.m4a';
        var clickEvent = document.createEvent('MouseEvent');
        clickEvent.initEvent('click', true, true);
        music_link.dispatchEvent(clickEvent);
    }

    playState = 1; // 播放状态，0表示播放，1表示暂停
    playClass = ['fa-pause', 'fa-play'];
    playMode = 0; // 0表示列表循环，1单曲循环，2随机播放
    cur_music = 0; // 当前歌曲下标
    audio = document.getElementById('mp3-player');
    volumeState = 1; // 音量状态，如果为0则静音
    pointMove = 3; // 当前拖拽的是进度条还是音量条，0表示进度，1表示音量，3则无效
    lyric_time = []; //歌词时间数组

    var
        playButton = document.getElementById('play'),
        progress = document.getElementsByClassName('progress'),
        volumeButton = document.querySelector('#volume .volumn-icon'),
        playModeButton = document.querySelector('.play-mode-icon'),
        nextButton = document.querySelector('#step-forward i'),
        previousButton = document.querySelector('#step-backward i'),
        downloadButton = document.querySelector('.download-music-icon');

    document.body.onmouseup = pointMouseUp;
    playButton.onclick = playOrPause;
    audio.ontimeupdate = synchronize;
    audio.onvolumechange = volumeChange;
    audio.onended = getNext;
    volumeButton.onclick = volumeClick;
    playModeButton.onclick = playModeClick;
    nextButton.onclick = getNext;
    previousButton.onclick = getPrevious;
    downloadButton.onclick = downloadClick;
    for (var i = 0; i < progress.length; i++) {
        var bar = progress[i].children[0],
            his = progress[i].children[1],
            point = progress[i].children[2];
        point.MAXVALUE = point.parentNode.offsetWidth;
        point.onmousedown = pointMouseDown;
        bar.onclick = barClick;
        his.onclick = barClick;
    }
    // setVolume();
    // 生成歌曲列表
    var songList = document.getElementsByClassName('songList_main')[0];
    var songListClass = ['num', 'play_img', 'songList_songname',
        'songList_songauthor', 'songList_album', 'songList_songtime'
    ]
    for (var i = 0; i < musicList.length; i++) {
        var
            tr = document.createElement('tr'),
            th_HTML = [i + 1, '<i class="fa fa-play" aria-hidden="true"></i>',
                musicList[i]['songList_songname'], musicList[i]['songList_songauthor'],
                musicList[i]['songList_album'], musicList[i]['songList_songtime']
            ];
        for (j = 0; j < songListClass.length; j++) {
            var th = document.createElement('th');
            th.classList.add(songListClass[j]);
            th.innerHTML = th_HTML[j];
            tr.appendChild(th);
        }
        tr.url = musicList[i]['url'];
        songList.appendChild(tr);
        if (songid === musicList[i]['song_id'].toString())
            cur_music = i;
    }

    var is = document.querySelectorAll('.play_img > i');
    for (var i = 0; i < is.length; i++) {
        is[i].onclick = change;
    }

    playAudio(cur_music);

}