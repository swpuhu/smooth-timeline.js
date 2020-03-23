
class Track {
    constructor(playList) {
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
            media.width = 320;
            media.height = 180;
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
        if (files.length && files.length < 2) {
            if (files[0] < this.playList.length - 1) {
                files.push(files[0] + 1);
            }
        }
        if (files.length === 0) {
            files = this.findNearMedia();
        }

        let promises = [];
        for (let file of files) {
            let promise;
            if (this.playList[file].left > this.currentTime) {
                promise = this.loadSrc(
                    this.medias[file % 2],
                    this.playList[file].src,
                    this.playList[file].start
                );
            } else {
                promise = this.loadSrc(
                    this.medias[file % 2],
                    this.playList[file].src,
                    this.currentTime - this.playList[file].left + this.playList[file].start
                );
            }
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

    play() {
        this.playReady().then(() => {
            this._play();
        })
    }

    _play(currentTime) {
        // this.requestAnimationFrameId = requestAnimationFrame(this._play);
        this.isPlaying = true;

        let date = Date.now();
        if (!this.prevDate) {
            this.prevDate = date;
        }
        this.currentTime = currentTime;
        // this.currentTime += (date - this.prevDate) / 1000;
        if (currentTime > this.end) {
            this.pause();
            console.log('done');
        }
        // console.log(this.currentTime);

        let newFiles = this.findMedia(currentTime);

        if (newFiles.length > 1) {

        } else if (newFiles.length > 0) {
            let newFileIndex = newFiles[0];
            let currentFileIndex = this.currentFiles[0];
            if (newFileIndex !== currentFileIndex) {
                this.loadNext();
                console.log(this.playList[newFileIndex]);
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

    pause() {
        // cancelAnimationFrame(this.requestAnimationFrameId);
        this.isPlaying = false;
        this.medias.forEach(media => media.pause());
    }

    seek(time) {
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
        return this.playReady();
    }

    init() {
        for (let i = 0; i < this.playList.length; i++) {
            if (i > 1) {
                break;
            }
            this.medias[i].src = this.playList[i].src;
            this.medias[i].currentTime = this.playList[i].start;
        }
    }

    loadNext() {
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

    _showVideo() {
        this.medias.forEach(media => {
            document.body.appendChild(media);
        })
    }

    get currentMedias() {
        let medias = this.findMedia();
        return medias.map(index => this.medias[index % 2]);
    }
}
