/*  1. Render songs
    2. Scroll top
    3. Play/ pause/ seek
    4. CD rotate
    5. Next/ prev
    6. Random
    7. Next/ Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
  */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
// var temp = -1;
// const PLAYER_STORAGE_KEY = 'F8_Player'

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $(".cd-thumb")
const audio = $('#audio')

const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')


const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    //    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},

    // setConfig: function(key, value){
    //     this.config[key] = value
    //     //localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(_this.config))
    // },
    songs: [
        {
            name: 'Cơn mưa băng giá',
            singer: 'Bằng Kiều',
            path: './data/music/music1.mp3',
            image: './data/img_music/music_img1.jpg'
        },
        {
            name: 'Chuyện hoa sim',
            singer: 'Đan Nguyên',
            path: './data/music/music2.mp3',
            image: './data/img_music/music_img2.jpg'
        },
        {
            name: 'Xuân này con không về',
            singer: 'Đan Nguyên',
            path: './data/music/music3.mp3',
            image: './data/img_music/music_img3.jpg'
        },
        {
            name: 'I want it that way',
            singer: 'Backstreet Boys',
            path: './data/music/music4.mp3',
            image: './data/img_music/music_img4.jpg'
        },
        {
            name: 'Flower Road',
            singer: 'Big Bang',
            path: './data/music/music5.mp3',
            image: './data/img_music/music_img5.jpg'
        },
        {
            name: 'Chicken Attack',
            singer: 'The Gregory Brothers, Takeo Ischi',
            path: './data/music/chicken.mp3',
            image: './data/img_music/chicken.jpg'
        }, {
            name: 'Maps',
            singer: 'Maroon 5',
            path: './data/music/maps.mp3',
            image: './data/img_music/maps.jpg'
        }

    ],
    render: function () {

        //hien thi danh sach bai hat
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                     <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                     <h3 class="title">${song.name}</h3>
                     <p class="author">${song.singer}</p>
                    </div>
                     <div class="option">
                     <i class="fas fa-ellipsis-h"></i>
                     <div class="option_selects" id="test_${index}" >
                     <h6 class="selects_item"> Play </h6>
                     <h6 class="selects_item"> Remove </h6>  
                     </div>
                     </div>
                </div>            
                `
        })
        $('.playlist').innerHTML = htmls.join('')
    },


    defineProperties: function () {

        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const _this = this

        const cdWidth = cd.offsetWidth

        //xử lý quay CD
        const cdThumbanimate =
            cdThumb.animate([
                // { transform: 'rotate(0) scale(1)' },
                { transform: 'rotate(360deg)' }
            ], {
                duration: 10000,
                iterations: Infinity,
            });

        cdThumbanimate.pause();

        //quay repeat
        const repeatAnimate =
            repeatBtn.animate([
                { transform: 'rotate(360deg)' }
            ], {
                duration: 500,
                iterations: 1
            });

        repeatAnimate.pause();

        



        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
            cd.style.opacity = newCdWidth / cdWidth
        }


        const backgroundPlaylist = $('.playlist')
        //play and pause

        // playBtn.onclick = function () {

        //console.log(audio)

        playBtn.onclick = () => {
            // console.log(_this.isPlaying)
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }

        //khi play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            backgroundPlaylist.classList.add('open')
            cdThumbanimate.play();

        }
        //khi play
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            backgroundPlaylist.classList.remove('open')
            cdThumbanimate.pause();

        }
        
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                // console.log(audio.currentTime, audio.duration)
                const progressPercent = Math.floor
                    (audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //khi tua bài nhạc
        progress.onchange = function (e) {
            //console.log(e.target.value)
            const seekTime =
                e.target.value * audio.duration / 100

            audio.currentTime = seekTime
            console.log(seekTime)
        }

        //bấm next
        btnNext.onclick = function () {
            console.log(_this.isRandom)

            if (_this.isRandom) {
                _this.playRandomSong()
                //audio.play()
            } else {
                _this.nextSong()

            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }

        //bấm prev
        btnPrev.onclick = () => {

            console.log(_this.isRandom)
            if (_this.isRandom) {
                _this.playRandomSong()
                //audio.play()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()


        }
        //random
        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom
            //    _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)


        }
        //btn-repeat

        repeatBtn.onclick = () => {
            //console.log(_this.isRepeat)
            _this.isRepeat = !_this.isRepeat
            //    _this.setConfig('isRepeat', _this.isRepeat)

            repeatBtn.classList.toggle('active', _this.isRepeat)

            repeatAnimate.play()
        }
        // khi bài hát kết thúc
        audio.onended = () => {
            if (_this.isRepeat) {
                audio.play()
            }
            else {
                btnNext.click()
            }

        }
        
        playlist.onclick = (e) => {
                        
            const songNode = e.target.closest('.song:not(.active)')
            
            
            // console.log(!songNode )
            //xử lý khi click vào song
            if (songNode || e.target.closest('.option')) {
                // console.log(e.target.closest('.option'))
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()       
                    console.log(_this.currentIndex)    
                          
                    // tmp.style.display = "block"
                    _this.render()
                    audio.play()                                  
                }
                else if (e.target.closest('.option')) {
                    console.log(_this.currentIndex)             
                    let tmp =  document.getElementById(`test_${_this.currentIndex}`)
                    tmp.style.display = "block"

                    console.log(tmp)  
                }
            }
           
            
        }




    },

    scrollToActiveSong: function () {

        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "center",
            })
        }, 500)
    }
    ,
    nextSong: function () {
        //console.log(this.currentIndex)
        this.currentIndex++
        if (this.currentIndex == this.songs.length) {
            this.currentIndex = 0
        }
        console.log(this.currentIndex)
        this.loadCurrentSong();

    },

    prevSong: function () {
        if (this.currentIndex == 0) {
            this.currentIndex = this.songs.length - 1
        }
        else {
            this.currentIndex--
        }
        //  alert(this.currentIndex)
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex = this.currentIndex
        console.log(newIndex)
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)

        } while (newIndex === this.currentIndex)
        console.log(newIndex)
        this.currentIndex = newIndex
        // alert(this.currentIndex)
        this.loadCurrentSong();
    },
    
   
    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
       
        

    },




    start: function () {

        //định nghĩa các thuộc tính cho object
        this.defineProperties()

        this.handleEvents()

        this.loadCurrentSong()

        this.render()


    }


}

app.start()
