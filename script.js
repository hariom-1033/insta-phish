// Decoded / Deobfuscated script.js

var minimize = document.getElementById('minimize'),
    square   = document.getElementById('square'),
    exit     = document.getElementById('exit'),
    titleBar = document.getElementById('title-bar');

// --- minimize button hover effects ---
minimize.addEventListener('mouseover', function handleMouseOver() {
    minimize.style.backgroundColor = 'rgba(0,0,0,0.15)';
    minimize.style.cursor = 'context-menu';
});

minimize.addEventListener('mouseout', function handleMouseOut() {
    minimize.style.backgroundColor = 'transparent';
    minimize.style.cursor = 'default';
});

// --- square button hover effects ---
square.addEventListener('mouseover', function handleMouseOver() {
    square.style.backgroundColor = 'rgba(0,0,0,0.15)';
    square.style.cursor = 'context-menu';
});

square.addEventListener('mouseout', function handleMouseOut() {
    square.style.backgroundColor = 'transparent';
    square.style.cursor = 'default';
});

// --- exit button hover effects ---
exit.addEventListener('mouseover', function handleMouseOver() {
    exit.style.backgroundColor = 'red';
    exit.style.cursor = 'context-menu';
});

exit.addEventListener('mouseout', function handleMouseOut() {
    exit.style.backgroundColor = 'transparent';
    exit.style.cursor = 'default';
});

// --- title bar hover cursor effects ---
titleBar.addEventListener('mouseover', function handleMouseOver() {
    titleBar.style.cursor = 'context-menu';
});

titleBar.addEventListener('mouseout', function handleMouseOver() {
    titleBar.style.cursor = 'default';
});

// --- draggable window logic (jQuery) ---
var draggable = $('#window');
var title     = $('#title-bar');

title.on('mousedown', function (_event) {
    var $draggable = $(draggable).addClass('drag');
    height = $draggable.outerHeight();
    width  = $draggable.outerWidth();

    ypos = $draggable.offset().top  + height - _event.pageY;
    xpos = $draggable.offset().left + width  - _event.pageX;

    $(document.body)
        .on('mousemove', function (_moveEvent) {
            var top  = _moveEvent.pageY + ypos - height;
            var left = _moveEvent.pageX + xpos - width;
            if ($draggable.hasClass('drag')) {
                $draggable.offset({ top: top, left: left });
            }
        })
        .on('mouseup', function (_upEvent) {
            $draggable.removeClass('drag');
        });
});

// --- exit button: hide the window ---
$('#exit').click(function () {
    $('#window').css('display', 'none');
});

// --- square button: enlarge/restore window ---
$('#square').click(enlarge);

function enlarge() {
    if (square.classList.contains('enlarged')) {
        // Restore to smaller size
        $('#window').css('width', '40%');
        $('#title-bar-width').css('width', '100%').css('width', '+=2px');
        $('#content').css('width', '100%');
        $('#square').removeClass('enlarged');
    } else {
        // Expand to full size
        $('#window').css('width', '70%');
        $('#title-bar-width').css('width', '100%').css('width', '+=2px');
        $('#content').css('width', '100%');
        $('#square').addClass('enlarged');
    }
}

// --- clickme button: fade in the window ---
$('#clickme').click(function () {
    $('#window').fadeIn(300); // 300ms
});
