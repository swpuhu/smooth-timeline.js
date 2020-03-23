
const test = [
    [
        {
            left: 0,
            start: 0,
            end: 5,
            src: 'http://localhost:9000/assets/ad2.mp4'
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
            start: 90,
            end: 120,
            src: 'http://localhost:9000/assets/jiangye2.mp4'
        },
        {
            left: 57,
            start: 120,
            end: 150,
            src: 'http://localhost:9000/assets/jiangye1.mp4'
        }
    ],
    [
        {
            left: 0,
            start: 0,
            end: 12,
            src: 'http://localhost:9000/assets/ad1.mp4'
        },
        {
            left: 15,
            start: 5,
            end: 18,
            src: 'http://localhost:9000/assets/jiangye1.mp4'
        },
        {
            left: 30,
            start: 0,
            end: 2,
            src: 'http://localhost:9000/assets/ad1.mp4'
        },
        {
            left: 35,
            start: 5,
            end: 8,
            src: 'http://localhost:9000/assets/ad2.mp4'
        },
        {
            left: 40,
            start: 5,
            end: 7,
            src: 'http://localhost:9000/assets/ad1.mp4'
        },
        {
            left: 45,
            start: 90,
            end: 120,
            src: 'http://localhost:9000/assets/jiangye2.mp4'
        },
        {
            left: 78,
            start: 120,
            end: 150,
            src: 'http://localhost:9000/assets/jiangye1.mp4'
        }
    ]
]

let timeline = new Timeline(test);

let playButton = document.createElement('button');
playButton.textContent = 'Play';

playButton.onclick = function () {
    timeline.play();
}
let pauseButton = document.createElement('button');
pauseButton.textContent = 'Pause';
pauseButton.onclick = function () {
    timeline.pause();
}

document.body.appendChild(playButton);
document.body.appendChild(pauseButton);

