(function(){
    const { ipcRenderer } = require('electron')
    let files = [], archives
    let bar = document.querySelector('.progress div:first-child')
    let completedBar = document.querySelector('.bar')
    let audio = document.querySelector('audio')
    audio.volume = 1
    document.querySelector('.volume div:first-child .bar').style.height = 100 + '%'
    audio.autoplay = false
    let time = document.querySelector('.time')
    let atualTime = null, play = document.querySelector('#play'),
    repeat = 0,
    random = false,
    file = null
    bar.addEventListener('click', e=>{
        mouse(e)
    })
    document.querySelector('.volume div:first-child').addEventListener('click', e=>{
        let per = (e.offsetY / e.target.offsetHeight)
        console.log(e.offsetY, per)
        console.log(e)
        audio.volume = per
        document.querySelector('.volume div:first-child .bar').style.height = (per*100) + '%'
    })
    function mouse(e){
        let per = (e.offsetX / bar.offsetWidth) * 100
        if(per > 100)
            per = 100
        if(per < 0)
            per = 0 
        completedBar.style.width = per + '%'
        audio.currentTime = (per/100) * audio.duration
    }
    document.addEventListener('keyup', e=>{
        let y = {}
        if(e.which === 39 || e.keyCode === 39){
            y.offsetX = completedBar.offsetWidth + ((bar.offsetWidth * .5) / 100)
            mouse(y)
        }
        else if(e.which === 37 || e.keyCode === 37){
            y.offsetX = completedBar.offsetWidth - ((bar.offsetWidth * .5) / 100)
            mouse(y)
        }

    })
    document.querySelector('#back').addEventListener('click', e=>{
        let z = audio.paused
        file += -1
        if (file === -1)
            file = files.length -1
        audio.src = files[file]
        document.querySelector('#app h1:first-child').innerText = `${files[file]}`
        audio.oncanplay = () => {
            let min = audio.duration / 60
            let s = '' + min
            s = '.' + s.split('.')[1]
            s = parseInt(parseFloat(s) * 60)
            min = parseInt(min)
            time.innerText = `0:00 - ${min}:${s}`
        }
        if(!z)
            audio.play()
    })
    document.querySelector('#for').addEventListener('click', e => {
        let z = audio.paused
        file++
        if (file === files.length)
            file = 0
        audio.src = files[file]
        document.querySelector('#app h1:first-child').innerText = `${files[file]}`
        audio.oncanplay = () => {
            let min = audio.duration / 60
            let s = '' + min
            s = '.' + s.split('.')[1]
            s = parseInt(parseFloat(s) * 60)
            min = parseInt(min)
            time.innerText = `0:00 - ${min}:${s}`
        }
        if (!z)
            audio.play()
    })
    document.querySelector('#stop').addEventListener('click', e=>{
        if(!audio.paused){
            play.querySelector('i').click()
            file = 0
            audio.src = files[0]
            audio.currentTime = 0
            audio.oncanplay = () => {
                let min = audio.duration / 60
                let s = '' + min
                s = '.' + s.split('.')[1]
                s = parseInt(parseFloat(s) * 60)
                min = parseInt(min)
                time.innerText = `0:00 - ${min}:${s}`
                audio.pause()
            }
        }
    })
    document.querySelector('#for').addEventListener('click', e => {})
    play.addEventListener('click', e=>{
        if (e.target.className === 'far fa-play-circle'){
            e.target.className = 'far fa-pause-circle white'
            if(audio.src !== ''){
                audio.play()
                atualTime = setInterval(() => {
                    completedBar.style.width = audio.currentTime/audio.duration*100 +'%'
                    let min = audio.currentTime / 60
                    let s = '' + min
                    s = '.' + s.split('.')[1]
                    s = parseInt(parseFloat(s) * 60)
                    min = parseInt(min)
                    time.innerText = `${min}:${s} ` + '-'+ time.innerText.split('-')[1]
                    if(completedBar.style.width === '100%'){
                        if(repeat === 1){
                            audio.load()
                            audio.play()
                            document.querySelector('#app h1:first-child').innerText = `${files[file]}`
                        } else if(repeat === 2){
                            file++
                            if(file === files.length)
                                file = 0
                            audio.src = files[file]
                            document.querySelector('#app h1:first-child').innerText = `${files[file]}`
                            audio.oncanplay = () => {
                                let min = audio.duration / 60
                                let s = '' + min
                                s = '.' + s.split('.')[1]
                                s = parseInt(parseFloat(s) * 60)
                                min = parseInt(min)
                                time.innerText = `0:00 - ${min}:${s}`
                                audio.play()
                            }
                        } else {
                            file++
                            if (!(file === files.length)) {
                                audio.src = files[file]
                                document.querySelector('#app h1:first-child').innerText = `${files[file]}`
                                audio.oncanplay = () => {
                                    let min = audio.duration / 60
                                    let s = '' + min
                                    s = '.' + s.split('.')[1]
                                    s = parseInt(parseFloat(s) * 60)
                                    min = parseInt(min)
                                    time.innerText = `0:00 - ${min}:${s}`
                                    audio.play()
                                }
                            } else {
                                clearInterval(atualTime)
                                play.querySelector('i').click()
                                file = 0
                                audio.src = files[0]
                                audio.currentTime = 0
                                audio.oncanplay = () => {
                                    let min = audio.duration / 60
                                    let s = '' + min
                                    s = '.' + s.split('.')[1]
                                    s = parseInt(parseFloat(s) * 60)
                                    min = parseInt(min)
                                    time.innerText = `0:00 - ${min}:${s}`
                                    audio.pause()
                                }
                            }
                        }
                    }
                }, 1000)
            }
        } else {
            e.target.className = 'far fa-play-circle'
            audio.pause()
            clearInterval(atualTime)
        }
    })
    document.querySelector('#repeat').addEventListener('click', e=>{
        let r = document.querySelector('#repeat')
        if(repeat === 0){
            repeat = 1
            r.innerHTML = r.innerHTML.split('</i>')[0] + '</i>' + ' 1'
        } else if (repeat === 1 && files.length > 1){
            repeat = 2
            r.innerHTML = r.innerHTML.split('</i>')[0] + '</i>' + ' all'
        } else {
            repeat = 0
            r.innerHTML = r.innerHTML.split('</i>')[0] + '</i>'
        }
    })
    document.querySelector('#random').addEventListener('click', e=>{ 
        random = !random
        if(random){
            document.querySelector('#random i').classList.add('white')
            let x = [], z = audio.paused
            while(files.length !== 0){
                let y = Math.round(Math.random()*files.length)
                if(files[y]){
                    x.push(files[y])
                    files.splice(y, 1)
                }
            }
            files = x
            completedBar.style.width = 0
            audio.oncanplay = () => {
                let min = audio.duration / 60
                let s = '' + min
                s = '.' + s.split('.')[1]
                s = parseInt(parseFloat(s) * 60)
                min = parseInt(min)
                time.innerText = `0:00 - ${min}:${s}`
            }
            if(z)
                audio.pause()
            ipcRenderer.send('random', files)
        } else {
            document.querySelector('#random i').classList.remove('white')
            files = archives
            completedBar.style.width = 0
            audio.oncanplay = () => {
                let min = audio.duration / 60
                let s = '' + min
                s = '.' + s.split('.')[1]
                s = parseInt(parseFloat(s) * 60)
                min = parseInt(min)
                time.innerText = `0:00 - ${min}:${s}`
            }
            audio.pause()
        }
    })
    ipcRenderer.on('files', (e, f)=>{
        archives = files = f
        audio.src = files[0]
        file = 0
        audio.pause()
        document.querySelector('#play i').className = 'far fa-play-circle'
        completedBar.style.width = 0
        audio.oncanplay = () => { 
            let min = audio.duration / 60
            let s = ''+min
            s = '.'+s.split('.')[1]
            s = parseInt(parseFloat(s)*60)
            min = parseInt(min)
            time.innerText = `0:00 - ${min}:${s}`
        }
        document.querySelector('#app h1:first-child').innerText = `${files[file]}`
    })
})()