function Particle(x, y, c, s) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;

    this.s = s;
    this.c = c;

    this.sx = x;
    this.sy = y;

    this.time = Date.now();
}

Particle.prototype = {
    constructor: Particle,
    update: function () {
        this.x += this.vx;
        this.y += this.vy;

        this.vx = (this.sx - this.x) / 10;
        this.vy = (this.sy - this.y) / 10;
    },
    render: function (context) {
        context.beginPath();
        context.fillStyle = this.c;
        context.fillRect(this.x, this.y, this.s, this.s);
        context.closePath();
    }
};

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var image = new Image();
var particle_size = 4;
var height, width, arr = [];
var animationStarted = false;

// Replace the URL below with the URL of your own image
image.crossOrigin = "Anonymous";
image.src = "https://raw.githubusercontent.com/mabhi02/AVM/main/images/A-v-M.jpg"; // Replace with your image URL
image.onload = init;

function init() {
    // Set the canvas size to 4K resolution (3840x2160 pixels)
    height = canvas.height = 2160;
    width = canvas.width = 3840;

    context.drawImage(image, 0, 0);
    var idata = context.getImageData(0, 0, width, height),
        data = idata.data;
    context.clearRect(0, 0, width, height);

    for (var y = 0; y < height; y += particle_size) {
        for (var x = 0; x < width; x += particle_size) {
            var o = x * 4 + y * 4 * idata.width;
            if (data[o + 3] > 210) {
                var c = 'rgba(' + data[o] + ',' + data[o + 1] + ',' + data[o + 2] + ',' + data[o + 3] + ')';
                var p = new Particle(x, y, c, particle_size);
                p.x = Math.random() * width;
                p.y = Math.random() * height;
                arr.push(p);
            }
        }
    }

    // Click event on a specific button or link
    var triggerButton = document.getElementById('trigger-animation-button');
    triggerButton.onclick = function () {
        if (!animationStarted) {
            animationStarted = true;
            update();
            render();
        }
    };

    function update() {
        for (var i = 0, l = arr.length; i < l; i++) {
            arr[i].update();
        }
        setTimeout(update, 1000 / 60);
    }

    function render() {
        context.clearRect(0, 0, width, height);
        for (var i = 0, l = arr.length; i < l; i++) {
            arr[i].render(context);
        }

        // Check if the animation is complete
        if (animationStarted && arr.every(particle => Math.abs(particle.vx) < 0.01 && Math.abs(particle.vy) < 0.01)) {
            fadeOriginalImage();
        } else {
            requestAnimationFrame(render);
        }
    }

    function fadeOriginalImage() {
        var originalImage = document.getElementById('original-image');
        originalImage.style.opacity = 1;
    }
}
