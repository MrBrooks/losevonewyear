/**************************************/
/* Custom JavaScript files supervisor */
/**************************************/

$(window).load(function(){
  setTimeout(function(){
    $("#preloader").addClass("uppp");
  },2000);
  // tree_slider.trigger("refresh.owl.carousel");
});
$(document).ready(function() {

    /* Custom */

 /*    //= ./common/material-init.js */
 /*    //= ./common/google-analytics.js */

  var nav = new Navigation();
  var card_data = new CardData();
  BackgroundParalax();
  SoundControl();
  CopyLink();
  var card_builder = new CardBuilder();
  var message_builder = new MessageBuilder();
  var svg_card, svg_message;

  


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

function CopyLink(){
  var message = $("#copy-message-btn"), btn = new Clipboard('[data-clipboard-target]');
  btn.on('success',function(){
    message.text("Скопировано!");
  });
  btn.on('error',function(){
    message.text("Нажмите Ctrl + C");
  });


}


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

  if(scene.length > 0 && $(window).width() >= 768){
    init();
  }
}

function CardData(){
  var self = this;
  var buffer = [];
  var card = {
    tree: 1,
    background: 2,
    toys: [
      {id: 1, top: 10, left: 10, scale: 1},
      {id: 3, top: 10, left: 10, scale: 1},
    ],
    stars: [
      {id: 1, top: 10, left: 10, scale: 1},
      {id: 3, top: 10, left: 10, scale: 1},
    ],
    balls: [
      {id: 1, top: 10, left: 10, scale: 1},
      {id: 3, top: 10, left: 10, scale: 1},
    ],
  };

  var tree_slider = $('#tree-slider').owlCarousel({
    items: 1,
    nav: true,
    navText: ['<div class="svg-sprite--arrow_left"></div>', '<div class="svg-sprite--arrow_right"></div>'],
    dots: false,
  });

  var toys_sliders = $('.items-slider').owlCarousel({
    items: 4,
    // slideBy: 1,
    nav: true,
    navText: ['<div class="svg-sprite--arrow_left"></div>', '<div class="svg-sprite--arrow_right"></div>'],
    dots: false,
    // autoplay: true,
    // loop: true,
    onDragged: test_callback,
  });

  function test_callback(e){
    console.log(e);
  }
  
  // tree_slider.on("",function());

  self.update = function(what){
    switch(what){
      case "tree": 
        card.tree = parseInt(tree_slider.find(".active [data-tree]").attr("data-tree"));
        break;
    }
  };
}

function MessageBuilder(){
  var canvas, message, background, message_text, text_box;

  function init(){
    canvas = new fabric.Canvas('canvas-message');
    message = $("#text-message");
    fabric.Image.fromURL('img/svg/happy_new_year.svg', function(el){
      background = el;
      background.width = 380;
      background.height = 380;
      background.selectable  = false;
      canvas.add(background);
    });
    
  }

  this.toSVG = function(){
    message_text = message.val();
    if(text_box){
      text_box.remove();
    }
    text_box = new fabric.Textbox(message_text, {
      fontFamily: 'Bad Script',
      fontSize: 14,
      width: 212,
      left: 89,
      top:200
    });
    text_box.selectable  = false;
    canvas.add(text_box);
    return canvas.toSVG({
      viewBox:{x:0 , y:0, width: 380, height: 380}
    });
  };

  init();
}

function CardBuilder(){
  var elements, background_btns, card_builder, message, message_close_btn, backgrounds, canvas, tree_id, tree,
    background_index;

  this.setTree = function(id){
    if(!tree || (tree_id !== id)){
      tree_id = id;
      fabric.Image.fromURL("img/svg/tree-"+tree_id+".svg", function(el){
        if(tree){
          tree.remove();
        }
        el.selectable  = false;
        el.scaleToHeight(380);
        el.hoverCursor = "auto";
        canvas.add(el);
        el.center();
        el.setCoords();
        el.moveTo(0);
        tree = el;

      });
    }
  };
  this.toSVG = function(){
    return canvas.toSVG({
      viewBox:{x:0 , y:0, width: 380, height: 380}
    });
  };
  this.unsetBackground = function(){
    canvas.backgroundImage = null;
  };
  this.setBackground = function(){
    fabric.Image.fromURL('img/svg/back-full-'+background_index+'.svg',function(el){
      el.width = 380;
      el.height = 380;
      canvas.add(el);
      el.moveTo(0);
    });
  };

  function init(){
    elements = $(".selector .pic");
    background_btns = $(".selector label");
    card_builder = $("#card-builder");
    backgrounds = card_builder.find(".card-backs img");
    message = card_builder.find(".message");
    message_close_btn = card_builder.find(".btn");
    canvas = new fabric.Canvas('canvas');
    tree_id = 1;
    background_index = 1;

    //events
    elements.on("click", function(e){

      console.log("elements on double click");
      var type = $(this).attr('data-type'),
          index = parseInt($(this).attr('data-index'));
      switch(type){
        case "ball":
          type = "ball";
          break;
        case "star":
          type = "star";
          break;
        case "toy":
          type = "toy";
          break;
        default: throw Error("Unexpected element data-type in CardBuilder init()");
      }
      var path = "img/svg/";
      fabric.Image.fromURL(path+type+"-"+index+".svg", function(el){
        el.scaleToWidth(40);
        el.lockRotation = true;
        el.hasRotatingPoint = false;
        el.lockScalingFlip = true;
        el.lockSkewingX = true;
        el.lockSkewingY = true;
        el.lockUniScaling = true;
        el.borderColor = 'white';
        el.transparentCorners  = false;
        el.cornerStyle = 'circle';
        el.cornerSize = 15;
        el.cornerColor = 'rgba(255,255,255,0.7)';
        el.cornerStrokeColor = 'rgba(255,255,255,0.7)';
        el.strokeWidth = 3;
        canvas.add(el);
        el.center();
        el.setCoords();
        el.bringToFront();
        // console.log(el.getCenterPoint());
        // el.on("selected",function(e){
        //   console.log("selected");
        // });
        el.on("moving",function(e){
          var center = this.getCenterPoint();
          if( center.x >= 320 && center.y >= 320){
            this.remove();
          }
        });
        // canvas.centerObject(el);
      });
    });
    background_btns.on("click", function(e){

      // console.log("backgound on click");
      background_index = parseInt($(this).attr("data-index"));
      backgrounds.removeClass("active").filter("[data-index='"+background_index+"']").addClass("active");
    });
    message_close_btn.on("click",function(){
      message.addClass("ok");
    });
  }

  function inTrash(){

  }

  function getTree(){ 
    return parseInt(tree_slider.find(".active [data-tree]").attr("data-tree"));
  }

  init();

}

function SoundControl(){
  var btn = $("#sound-btn"),
      sound_flag = true,
      audio = document.getElementById("music");

  btn.on("click",function(){
    $(this).toggleClass("active");
    toggle();
  });

  function toggle(){
    sound_flag = sound_flag? false : true;
    if( sound_flag){
      audio.play();
    } else{
      audio.pause();
    }
  }
}

function Navigation(){
  var btns = $(".navigation");

  var content_slider = $('#content-slider').owlCarousel({
    items: 1,
    nav: false,
    dots: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoHeight: true
  });

  var steps_bar = new StepsBar();

  btns.on('click', function(){
    callback($(this).attr("data-nav"));
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
        card_builder.setTree(parseInt($("#tree-slider .active [data-tree]").attr("data-tree")));
        card_builder.unsetBackground();
        content_slider.trigger("to.owl.carousel",[2,400,true]);
        steps_bar.to(2);
        break;

      case "card-message":
        card_builder.setBackground();
        content_slider.trigger("to.owl.carousel",[3,400,true]);
        steps_bar.to(3);
        $("body").removeClass("send-page");
        break;

      case "card-send":
        svg_message = message_builder.toSVG();
        svg_card = card_builder.toSVG();
        $("#svg-card").html(svg_card);
        $("#svg-message").html(svg_message);
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
  };
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

});