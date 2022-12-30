// var dataUrl= "data_dict.json"
// var dataUrl= "x1.json"
// var dataUrl= "x.json"
var dataUrl= "https://raw.githubusercontent.com/yaocaptain/mj/main/data_dict.json"  // 公開 data_dict.json 65MB
var d  // data_dict
var id  // 用 hot_score 排序過的
var loaded_count = 0;  // 定義一個變數，記錄已經載入的圖片數量
console.log(dataUrl);
$.ajax({
    url: dataUrl,
    method: 'GET',
    dataType: 'json',
    data: '',
    async: true,

    success: res =>{
        d = res
        id = Object.keys(d).sort((a, b) => d[b]['hot_score'] - d[a]['hot_score']);  // id[0] 的 'hot_score' 最高
        console.log('ajax 加載成功')
        console.log('typeof(res)', typeof(res));
        console.log('Object.keys(d).length:', Object.keys(d).length)
        checkScroll()
    },
    error: err =>{
        console.log(err)
        console.log('ajax 加載失敗')
    },
});

// 監控使用者是否滑到網頁底部
function checkScroll() {
    // 取得滾動條的高度
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  
    // 取得網頁的總高度
    var scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
  
    // 取得瀏覽器視窗的高度
    // var clientHeight = document.documentElement.clientHeight;
    var clientHeight = document.body.clientHeight;
    // 如果滾動條的高度加上瀏覽器視窗的高度等於網頁的總高度，表示已滑到底部
    // if (scrollTop + clientHeight === scrollHeight) {
    if (scrollTop + clientHeight >= scrollHeight - 1000) {
        // console.log('滑到底部了');
        // // 載入 20 張圖片
        loadImages();
    } else {
        // console.log("還沒到底");
    }
}

// 載入20張圖片
function loadImages() {
    if (loaded_count >= id.length) {
        console.log('loaded_count', loaded_count);
        console.log('id.length', id.length);
        console.log('所有圖片已全部加載完畢！');
        return
    }
    update_num = 20  // 一次更新20張圖片
    var endIndex = loaded_count + update_num
    if (endIndex > id.length) {
        endIndex = id.length
    }

    for (var i = loaded_count; i < endIndex; i++) {
        // id0-id3 依序更新一張
        var div = document.getElementById(`id${i % 4}`);
        var imgContainer = document.createElement('div');
        imgContainer.className = 'divhere'
        var img = document.createElement('img');
        img.className = 'img'
        var btnContainer = document.createElement('div');
        btnContainer.className = 'btnContainer'
        btnContainer.style.display = 'none';
        // img.src = `https://cdn.midjourney.com/${id[i]}/0_0.png`;  # 最高清圖
        img.src = `https://cdn.midjourney.com/${id[i]}/grid_0_384_N.webp`;
        // https://cdn.midjourney.com/6e061cb6-02f1-4969-ab47-8399c1748705/grid_0_640_N.webp  # 大
        // https://cdn.midjourney.com/6e061cb6-02f1-4969-ab47-8399c1748705/grid_0_384_N.webp  # 中
        // https://cdn.midjourney.com/6e061cb6-02f1-4969-ab47-8399c1748705/grid_0_128_N.webp  # 小

        img.style.width = '384px';
        img.style.marginBottom = `${400-384}px`;
        img.title = `${d[id[i]]['prompt']}`

        // downloadButton
        var downloadButton = document.createElement('button');
        downloadButton.innerHTML = '原始圖片';
        downloadButton.dataset.index = i;
        // downloadButton.className = 'downloadButton'
        downloadButton.className = 'greenCss'
        let pic_url = `${d[id[i]]['image_paths']}`
        downloadButton.onclick = function(){
            console.log(pic_url)
            window.open(pic_url)
        };

        btnContainer.appendChild(downloadButton);
        
        // copyTextButton
        var copyTextButton = document.createElement('button');
        copyTextButton.innerHTML = '複製prompt';
        // copyTextButton.className = 'copyTextButton'
        copyTextButton.className = 'greenCss'

        let full_command = `${d[id[i]]['full_command']}`
        copyTextButton.onclick = function(){
            var content = full_command;
            console.log(content)
            navigator.clipboard.writeText(content)
                .then(() => {
                console.log("已複製到剪貼板")
            })
                .catch(err => {
                console.log('Something went wrong', err);
            })
        };

        btnContainer.onmouseover = function() {
            this.style.display = 'block';
            document.getElementById("prompt").innerHTML = prompt;
            document.getElementById("prompt").style.display = 'block';
        }
        downloadButton.onmouseover = function() {
            this.parentNode.style.display = 'block';
            document.getElementById("prompt").innerHTML = prompt;
            document.getElementById("prompt").style.display = 'block';
        }
        copyTextButton.onmouseover = function() {
            this.parentNode.style.display = 'block';
            document.getElementById("prompt").innerHTML = prompt;
            document.getElementById("prompt").style.display = 'block';
        }
        let a1 = `over ${id[i]}`
        let prompt = `${d[id[i]]['prompt']}`;
        img.onmouseover = function() {
            // console.log(a1);
            this.previousSibling.style.display = 'block';
            document.getElementById("prompt").innerHTML = prompt;
            document.getElementById("prompt").style.display = 'block';
        }
        let a2 = `out ${id[i]}`
        img.onmouseout = function() {
            // console.log(a1);
            this.previousSibling.style.display = 'none';
            document.getElementById("prompt").style.display = 'none';
        }
        btnContainer.appendChild(copyTextButton);
        imgContainer.appendChild(btnContainer);
        imgContainer.appendChild(img);
        div.appendChild(imgContainer);
    }
    loaded_count = endIndex  // 累加 loaded_count
}