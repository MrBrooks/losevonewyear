/**************************************/
/* Custom JavaScript files supervisor */
/**************************************/
$(document).ready(function() {

    /* Custom */

 /*    //= ./common/material-init.js */
 /*    //= ./common/google-analytics.js */

  var nav = new Navigation();
  var card_data = new CardData();
  BackgroundParalax();


  


  var window_updater = new WindowUpdater([
    {
      event: "scroll",
      actions: [
        // scroll_anim.updateView,
        // logo.update,
        // video_control.update,
        // video_play.scrollControl,
        // econtenta_pixel.checkScrollConditions,
        // menu.update
      ]
    },
    {
      event: "resize",
      actions: [
        // scroll_anim.updateItems,
        // logo.resize,
        // full_height.update
      ]
    }
  ]);
});

function BackgroundParalax(){
  var scene = $("#scene"), items;

  function init(){
    items = scene.find(".layer");
    items.each(function(){
      $(this).attr("data-depth",Math.round(Math.random()*100)/100)
             .css("transition-delay",Math.random()*500+"ms");

    });
    scene.parallax({
      // calibrateX: true,
      // calibrateY: true,
      invertX: true,
      invertY: true,
      // limitX: 10,
      // limitY: 10,
      scalarX: 5,
      scalarY: 3,
      frictionX: 0.9,
      frictionY: 0.9,
      // originX: 1.0,
      // originY: 1.0
     });
  }

  if(scene.length > 0){
    init();
  }
}

function CardData(){
  var card = {
    tree: 1,
    toys: [{}],
  };

  var tree_slider = $('#tree-slider').owlCarousel({
    items: 1,
    nav: true,
    navText: ['<div class="svg-sprite--arrow_left"></div>', '<div class="svg-sprite--arrow_right"></div>'],
    dots: false,
  });

  var toys_sliders = $('.items-slider').owlCarousel({
    items: 4,
    nav: true,
    navText: ['<div class="svg-sprite--arrow_left"></div>', '<div class="svg-sprite--arrow_right"></div>'],
    dots: false,
  });

}

function Navigation(){
  var btns = $(".navigation");

  var content_slider = $('#content-slider').owlCarousel({
    items: 1,
    nav: false,
    dots: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false
  });

  var steps_bar = new StepsBar();

  btns.on('click', function(){
    callback($(this).attr("data-nav"))
  });

  function route(id){
    if(id){
      $("body").attr("class","").addClass(id);
    }
    callback(id);
  }

  function callback(id){
    switch(id){
      case "card-start":
        $("body").addClass(id);
        setTimeout(function(){
          content_slider.trigger("to.owl.carousel",[1,400,true]);
        },1000);
        
        break;
      case "card-tree":
        content_slider.trigger("to.owl.carousel",[1,400,true]);
        steps_bar.to(1);
        break;

      case "card-toys":
        content_slider.trigger("to.owl.carousel",[2,400,true]);
        steps_bar.to(2);
        break;

      case "card-message":
        content_slider.trigger("to.owl.carousel",[3,400,true]);
        steps_bar.to(3);
        $("body").removeClass("send-page");
        break;
      case "card-send":
        content_slider.trigger("to.owl.carousel",[4,400,true]);
        steps_bar.to(4);
        $("body").addClass("send-page");
        break;

      default: throw new Error("Unexpected Id in Navigation.callback()");
    }
  }
}

function StepsBar(options){
  var defs = {
    selector: "#steps-bar",
    item: ".step"
  }
  var opts = $.extend(defs, options);
  var state = 1, bar, items, init_flag = false;
  var self = this;
  
  function init(){
    bar = $(opts.selector);
    items = bar.find(opts.item);
    self.to(1);
  }
  
  self.to = function (step){
    if(step > items.length){
      throw new Error("Step index too big");
    }
    else{
      state = step;
      items.removeClass("active");
      for( var i = 0; i < state; i++){
        $(items.get(i)).addClass("active");
      }
    }
  };
  
  self.next = function(){
    if(state < items.length){
      self.to(++state);
    }
  };
  
  self.prev = function(){
    if(state > 1){
      self.to(--state);
    }
  };
  
  init();

}

function WindowUpdater(opts){ 
  var self = this, timer;

  self.add = function(event, func){
    for(var i = 0; i < opts.length; i++){
      if(opts[i].event === event){
        opts[i].actions.push(func);
        break;
      }
    }
  };

  self.update = function(event){
    clearTimeout(timer);
    timer = setTimeout(function(){
      if(event.data !== null){
        for(var i = 0; i < opts[event.data].actions.length; i++){
          opts[event.data].actions[i]();
        }
      }
      //do smthng
    },50);
  };

  self.onEvents = function(){
    for(var i = 0; i < opts.length; i++){
      $(window).on(opts[i].event, i, self.update);
    }
  };

  self.onEvents();
}

