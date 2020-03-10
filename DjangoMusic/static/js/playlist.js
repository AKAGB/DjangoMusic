window.onload = function(){
    

    var tbody=document.querySelector(".selfcreated_playlist .playList_main");
    for(var i=0;i<selfcreated_playlist.length;i++){
        var tr = document.createElement("tr");
        var td0 = document.createElement("td");
        td0.attributes["class"] = "num";
        td0.innerHTML = i+1;
        tr.appendChild(td0);
        var id = selfcreated_playlist[i]["id"];
        for(let key in selfcreated_playlist[i]){
            if(key=="id"){
                continue;
            }
            var td = document.createElement("td");
            td.setAttribute("class",key);
            if(key=="playList_name"){
                var a = document.createElement("a");
                a.setAttribute("href","/single_playlist_info/?id=" + id);
                a.innerHTML = selfcreated_playlist[i][key];
                a.style.color = "black";
                a.style.textDecoration = 'none';
                td.appendChild(a);
                tr.appendChild(td);
                continue;
            }
            td.innerHTML = selfcreated_playlist[i][key];
            tr.appendChild(td);
        }
        var last_td = document.createElement('td');
        last_td.setAttribute("class","remove");
        var a = document.createElement("a");
        var _i = document.createElement("i");
        _i.setAttribute('class','fa fa-trash');
        a.appendChild(_i);
        a.setAttribute("href",'/remove_playlist/?id='+id);
        last_td.appendChild(a);
        tr.appendChild(last_td);
        tbody.appendChild(tr);
    }

    var tbody=document.querySelector(".collection_playlist .playList_main");
    for(var i=0;i<collection_playlist.length;i++){
        var tr = document.createElement("tr");
        var td0 = document.createElement("td");
        td0.attributes["class"] = "num";
        td0.innerHTML = i+1;
        tr.appendChild(td0);
        var id = collection_playlist[i]["id"];
        for(let key in collection_playlist[i]){
            if(key=="id"){
                continue;
            }
            var td = document.createElement("td");
            td.setAttribute("class",key);
            if(key=="playList_name"){
                var a = document.createElement("a");
                a.setAttribute("href","/single_playlist_info/?id=" + id);
                a.innerHTML = collection_playlist[i][key];
                a.style.color = "black";
                a.style.textDecoration = 'none';
                td.appendChild(a);
                tr.appendChild(td);
                continue;
            }
            td.innerHTML = collection_playlist[i][key];
            tr.appendChild(td);
        }
        var last_td = document.createElement('td');
        last_td.setAttribute("class","remove");
        var a = document.createElement("a");
        var _i = document.createElement("i");
        _i.setAttribute('class','fa fa-trash');
        a.appendChild(_i);
        a.setAttribute("href",'/remove_playlist/?id='+id);
        last_td.appendChild(a);
        tr.appendChild(last_td);
        tbody.appendChild(tr);
    }
}