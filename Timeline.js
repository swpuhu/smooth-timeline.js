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
        this.playList = playList;
        this.medias = [
            document.createElement('video'),
            document.createElement('video'),
        ]
        this.currentMedias = [];
        this.requestAnimationFrameId = null;
        this.play = this.play.bind(this);
    }

    get currentMedias() {

    }

    findMedia() {
        let medias = [];
        for (let i = 0; i < this.playList.length; i++) {
            let file = this.playList[i];
            if (this.currentTime >= file.left && this.currentTime < file.end) {
                medias.push(i);
            }
            
        }
        return medias;
    }

    play () {
        this.requestAnimationFrameId = requestAnimationFrame(this.play);
        let newFiles = this.findMedia();
        if (newFiles.length > 1) {

        } else if (newFiles.length > 0) {
            let newFileIndex = newFiles[0];
            let currentFileIndex = this.currentMedias[0];
            if (newFileIndex !== currentFileIndex) {
                this.currentMedias = newFiles;
                this.loadNext();
            }
            // if (this.medias[this.currentMedias[0] % 2].paused) {
            //     this.medias[this.currentMedias[0] % 2].play();
            // }
        }
        
    }

    pause () {
        this.currentMedias.forEach(media => media.pause());
    }

    seek (time) {

    }

    init () {

    }

    loadNext () {

    }
}
