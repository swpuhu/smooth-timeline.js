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
        this.playList = playList;
        this.medias = [
            document.createElement('video'),
            document.createElement('video'),
        ]
    }

    get currentMedias() {

    }

    play () {

    }

    seek (time) {

    }

    init () {

    }

    loadNext () {

    }
}

const timeline = [
    [
        {
            start: 0,
            end: 10,
            url: 'http://localhost:9000/assets/4chclip.mp4'
        },
        {
            start: 5,
            end: 10,
            url: 'http://localhost:9000/assets/4chclip.mp4'
        },
        {
            start: 0,
            end: 10,
            url: 'http://localhost:9000/assets/4chclip.mp4'
        },
        {
            start: 5,
            end: 10,
            url: 'http://localhost:9000/assets/4chclip.mp4'
        },
        {
            start: 0,
            end: 10,
            url: 'http://localhost:9000/assets/4chclip.mp4'
        },
        {
            start: 5,
            end: 10,
            url: 'http://localhost:9000/assets/4chclip.mp4'
        }
    ]
]