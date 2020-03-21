class Timeline {
    constructor (timeline) {
        this.tracks = timeline.map(track => {
            return new Track(track);
        });
    }

    get currentMedias () {

    }


    play () {
        this.tracks.forEach(track => track.play());
    }

    seek (time) {
        this.tracks.forEach(track => this.tracks.seek());
    }
}

class Track {
    constructor (playList) {
        this.currentTime = 0;
        this.playList = playList.map(item => {
            item.duration = item.end - item.start;
            return item;
        });
        this.end = this.playList[this.playList.length - 1].left + this.playList[this.playList.length - 1].duration;
        this.medias = [
            document.createElement('video'),
            document.createElement('video'),
        ];
        this.medias.forEach(media => {
            media.width = 640;
            media.height = 360;
        })
        this.currentFiles = [];
        this.requestAnimationFrameId = null;
        this._play = this._play.bind(this);
        this.isPlaying = false;
        this.init();
        this.prevDate = null;
        this._showVideo();
    }

    loadSrc(video, src, currentTime) {
        return new Promise(resolve => {
            if (video.src === src && video.currentTime === currentTime) {
                resolve();
            } else {
                video.oncanplaythrough = function () {
                    resolve();
                }
                if (video.src !== src) {
                    video.src = src;
                }
                video.currentTime = currentTime;
            }
        })
    }

    async playReady() {
        let files = this.currentFiles;
        if (files.length === 0) {
            files = this.findNearMedia();
        }
        let promises = [];
        for (let file of files) {
            let promise = this.loadSrc(
                this.medias[file % 2],
                this.playList[file].src, 
                this.playList[file].start
            );
            promises.push(promise);
        }
        return Promise.all(promises);
    }

    findMedia() {
        let medias = [];
        for (let i = 0; i < this.playList.length; i++) {
            let file = this.playList[i];
            if (this.currentTime >= file.left && this.currentTime < file.left + file.duration) {
                medias.push(i);
            }
            
        }
        return medias;
    }

    findNearMedia() {
        let medias = [];
        let i = 0;
        for (i = 0; i < this.playList.length; i++) {
            let file = this.playList[i];
            if (file.left >= this.currentTime) {
                medias.push(i);
                break;
            }
        }
        if (i + 1 < this.playList.length) {
            medias.push(i + 1);
        }
        return medias;
    }

    play () {
        this.playReady().then(() => {
            this._play();
        })
    }

    _play () {
        this.requestAnimationFrameId = requestAnimationFrame(this._play);
        this.isPlaying = true;
        console.log(this.currentTime);
        
        let date = Date.now();
        if (!this.prevDate) {
            this.prevDate = date;
        }
        this.currentTime += (date - this.prevDate) / 1000;
        if (this.currentTime > this.end) {
            this.pause();
            console.log('done');
        }
        // console.log(this.currentTime);
        
        let newFiles = this.findMedia();
        
        if (newFiles.length > 1) {

        } else if (newFiles.length > 0) {
            let newFileIndex = newFiles[0];
            let currentFileIndex = this.currentFiles[0];
            if (newFileIndex !== currentFileIndex) {
                this.loadNext();
                this.currentFiles = newFiles;
            }
            if (this.medias[this.currentFiles[0] % 2].paused) {
                this.medias[this.currentFiles[0] % 2].play();
            }
        } else {
            if (this.currentFiles.length === 0) return;
            this.medias[this.currentFiles[0] % 2].pause();
            if (this.medias[this.currentFiles[1]]) {
                this.medias[this.currentFiles[1] % 2].pause();
            }
        }
        this.prevDate = Date.now();
    }

    pause () {
        cancelAnimationFrame(this.requestAnimationFrameId);
        this.isPlaying = false;
        this.medias.forEach(media => media.pause());
    }

    seek (time) {
        if (this.isPlaying) {
            this.pause();
        }
        this.currentTime = time;
        let newFiles = this.findMedia();
        if (newFiles.length > 1) {

        } else if (newFiles.length > 0) {
            let newFileIndex = newFiles[0];
            if (newFileIndex !== this.currentFiles[0]) {
                this.currentFiles = newFiles;
            }
        } else {
            // newFiles = this.findNearMedia();
        }
        this.playReady();
        
    }

    init () {
        for (let i = 0; i < this.playList.length; i++) {
            if (i > 1) {
                break;
            }
            this.medias[i].src = this.playList[i].src;
            this.medias[i].currentTime = this.playList[i].start;
        }
    }

    loadNext () {
        let currentFileIndex = this.currentFiles[0];
        if (currentFileIndex >= 0 && currentFileIndex < this.playList.length) {
            let media = this.medias[currentFileIndex % 2];
            if (!media) {
                debugger;
            }
            media.pause();
            if (currentFileIndex + 2 < this.playList.length) {
                media.src = this.playList[currentFileIndex + 2].src
                media.currentTime = this.playList[currentFileIndex + 2].start;
            }
        }
        
    }

    _showVideo () {
        this.medias.forEach(media => {
            document.body.appendChild(media);
        })
    }
}


const test = [
    {
        left: 0,
        start: 0,
        end: 2,
        src: 'http://localhost:9000/assets/ad1.mp4'
    },
    {
        left: 5,
        start: 5,
        end: 18,
        src: 'http://localhost:9000/assets/jiangye1.mp4'
    },
    {
        left: 18,
        start: 0,
        end: 2,
        src: 'http://localhost:9000/assets/ad1.mp4'
    },
    {
        left: 20,
        start: 5,
        end: 8,
        src: 'http://localhost:9000/assets/ad2.mp4'
    },
    {
        left: 25,
        start: 5,
        end: 7,
        src: 'http://localhost:9000/assets/ad1.mp4'
    },
    {
        left: 27,
        start: 60,
        end: 90,
        src: 'http://localhost:9000/assets/jiangye2.mp4'
    }
]

let track = new Track(test);