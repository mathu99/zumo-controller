document.addEventListener("DOMContentLoaded", function() {
    console.log('testing');
    if ('ondeviceorientation' in window) {
        document.getElementById('ondeviceorientation').innerHTML = 'ondeviceorientation working';
        window.addEventListener('deviceorientation', function(event) {
            var info, xyz = "[X, Y, Z]";
            info = xyz.replace("X", Math.round(event.beta));
            info = info.replace("Y", Math.round(event.gamma));
            info = info.replace("Z", Math.round(event.alpha));
            document.getElementById('ondeviceorientation1').innerHTML = info;
        })
    }
    if ('ondevicemotion' in window) {
        document.getElementById('ondevicemotion').innerHTML = 'ondevicemotion';
        window.addEventListener('devicemotion', function(event) {
            var info, xyz = "[X, Y, Z]";
            info = xyz.replace("X", Math.round(event.acceleration.x));
            info = info.replace("Y", Math.round(event.acceleration.y));
            info = info.replace("Z", Math.round(event.acceleration.z));
            document.getElementById('ondevicemotion1').innerHTML = info;
        })
    }
 });