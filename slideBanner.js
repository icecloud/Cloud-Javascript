window.Cloud = window.Cloud || {};
    
Cloud.slideBanner = function ($this) {
    var $imgList = $this.find('ul.img-list');
    var $li = $this.find('ul.img-list>li');
    var num = $li.length;
    var $triggers = $this.find('ul.slide-triggers');
    if ($triggers.length == 0) {
	$triggers = $('<ul class=\"slide-triggers\"></ul')
	    .appendTo($this);
    };
    var height = $this.innerHeight();
    var speed = 500;
    var autoModeInterval = 0;
    var autStartHandle;
    var currentIndex;
    
    function createTriggers() {
	$li.each(function(index) {
	    $trigger = $('<li>' + (index+1) + '</li>').data('index', index);
	    $triggers.prepend($trigger);
	    $trigger.hover(function() {
                transitTo($(this).data('index'));
 	    });
	});

	$triggers.find('li').last().addClass('active');
        currentIndex = 0;
    };
    
    function transitTo(index) {
	if (index >= 0 && index < num && currentIndex !== index) {
            // animated transition
	    //$imgList.clearQueue().animate({top: -height*index}, speed);
            
            // transition using fadein and fadeout.
            $imgList.stop(true, true) // necessary to clear the animation queue.
                .fadeOut(speed/2, function() {
                    $imgList.css('top', -height*index);
                }).fadeIn(speed/2);

            // Update active trigger
            currentIndex = index;
	    $triggers.find('li.active').removeClass('active');
	    $triggers.find('li:eq(' + (num - index - 1) + ')').addClass('active');
	};
    };

    function transitToNext() {
	currentIndex = (currentIndex+1) % num;
	transitTo(currentIndex);
    };

    function autoStart(interval) {
        if (autStartHandle) {
            stop(); // restart
        };
        if (interval > 0) {
	    autoStartHandle = setInterval(transitToNext, interval);
            autoModeInterval = interval;
        };
    };

    function pause() {
        autoStartHandle && clearInterval(autoStartHandle);
        autoStartHandle = 0;
    };

    function resume() {
        if (autoModeInterval > 0) {
            autoStartHandle = setInterval(transitToNext, autoModeInterval);
        };
    };

    function stop() {
        pause();
        autoModeInterval = 0;
    };

    createTriggers();
    $this.mouseenter(pause).mouseleave(resume);

    return {
	transit: transitTo,
	autoStart: autoStart,
        stop: stop,
        pause: pause,
        resume: resume
    };
};
