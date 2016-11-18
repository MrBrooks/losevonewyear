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
  var svg_card, svg_message, png_card, png_message;
  var popup = new Popup(function(){
    var sizes = losevo_video.getSizes();
    popup.setSizes(sizes);
    losevo_video.play();
  }, function(){
    losevo_video.stop();
  });

  var tabs = new Tabs({
    btns: ".choose-send .pagination .item",
    tabs: ".choose-send .tab-content",
    callbackOpen: function(el){
      if($(window).width() < 768){
        var index = $(el).attr('data-index');
        $(".choose-send .pagination .item[data-index='"+index+"']").after($(".choose-send .tab-content[data-index='"+index+"']"));
      }
    }
  });

  var mobile_toy_tabs = new Tabs({
    effect: "active",
    btns: ".mobile-toy-tabs .item",
    tabs: ".mobile-toy-tabs .tab-content",
    close: ".mobile-toy-tabs .close-tab",
    callbackOpen: function(){
      $(".card-start .logo").addClass('slideTop');
    },
    callbackClose: function(){
      $(".card-start .logo").removeClass('slideTop');
    }
  });

  var ajax_submit = new AjaxSubmit();


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

  function test_callback(){
    // console.log(e);
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
  var canvas, message, background, message_text, text_box, size;

  function init(){
    canvas = new fabric.Canvas('canvas-message');
    message = $("#text-message");
    // canvas_size = $(window).width() >= 768? 380 : 320;
    // canvas.setDimensions({
    //   width: size,
    //   height: size
    // });
    fabric.loadSVGFromURL(getPrefix()+'img/svg/happy_new_year.svg', function(els,opts){
      background = fabric.util.groupSVGElements(els,opts);
      background.width = 380;
      background.height = 380;
      background.selectable  = false;
      canvas.add(background);
    });
    
  }
  this.toPNG = function(){
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
    var png = canvas.toDataURL({
      format:'png'
    });
    return png;
  };
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
    background_index, toy_layer, remove_btn, background, canvas_size;

  this.setTree = function(id){
    if(!tree || (tree_id !== id)){
      tree_id = id;
      fabric.loadSVGFromURL(getPrefix()+"img/svg/tree-"+tree_id+".svg", function(els, opts){
        if(tree){
          tree.remove();
        }
        tree = fabric.util.groupSVGElements(els,opts);
        tree.set({
          selectable : false,
          hoverCursor: "auto"
        });
        tree.scaleToWidth(canvas_size);
        canvas.add(tree);
        tree.center().setCoords().moveTo(1);
        tree.deletable = false;
      });
    }
  };
  this.toPNG = function(){
    var png = canvas.toDataURL({
      format:'png'
    });
    return png;
  };
  this.toSVG = function(){
    return canvas.toSVG({
      viewBox:{x:0 , y:0, width: canvas_size, height: canvas_size}
    },function(svg){
      //fix to ImageMagic convert to png
      // var op, fill, style;
      // svg = svg.replace('stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10;','');

      // if( (op = parseFloat($(svg).css('opacity'))) < 1){
      //   fill = $(svg).css('fill');
      //   fill = fill.replace('rgb','rgba').replace(')',','+op+')');
      //   svg = $(svg).css('fill', fill).get(0).outerHTML;
      // }
      // style = $(svg).attr('style').split(';');
      // style.pop();
      // for(var i = 0; i < style.length; i++){
      //   style[i] = style[i].replace(': ','="')+'"';
      // }
      // style = style.join(' ');
      // svg = svg.replace('style',' '+style+' style');
      // svg = $(svg).removeAttr('style').get(0).outerHTML;
      // console.log(svg);
      return svg;
    });
  };
  this.unsetBackground = function(){
    // console.log(canvas.getObjects());
    if(background){
      canvas.remove(background);
      canvas.renderAll();
    }
    // console.log(canvas.getObjects());
  };
  this.setBackground = function(){
    fabric.loadSVGFromURL(getPrefix()+'img/svg/back-full-'+background_index+'.svg',function(els,opts){
      if(background){
        canvas.remove(background);
      }
      background = fabric.util.groupSVGElements(els,opts);
      background.set({
        // width: canvas_size,
        // height: canvas_size,
        selectable: false,
        hoverCursor: "auto",
      }).scaleToWidth(canvas_size);

      canvas.add(background);
      background.moveTo(0);
    });
  };
  function removeToys(){
    var all = canvas.getObjects();
    var count = all.length;
    for(var i = 1; i < count; i++){ //remove all exept tree - always on canvas with index 0
      canvas.remove(all[1]);        //all[] dynamicaly update after remove() operation
    }
  }
  function init(){
    elements = $(".pic[data-type]");
    background_btns = $("label[data-index]");
    card_builder = $("#card-builder");
    backgrounds = card_builder.find(".card-backs img");
    remove_btn = $(".clear-all");
    message = card_builder.find(".message");
    message_close_btn = card_builder.find(".btn");
    controls = $(".choose-toys .controls");
    canvas_size = $(window).width() >= 768? 380 : 320;
    if(document.getElementById('canvas')){
      canvas = new fabric.Canvas('canvas');
      canvas.setDimensions({
        width: canvas_size,
        height: canvas_size
      });
      toy_layer = new fabric.Group();
    }
    tree_id = 1;
    background_index = 1;

    //events
    remove_btn.on('click',function(){
      removeToys();
    });
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
      var path = getPrefix()+"img/svg/";
      fabric.loadSVGFromURL(path+type+"-"+index+".svg", function(els, opts){
        el = fabric.util.groupSVGElements(els,opts);
        el.set({
          lockRotation : true,
          hasRotatingPoint : false,
          lockScalingFlip : true,
          lockSkewingX : true,
          lockSkewingY : true,
          lockUniScaling : true,
          borderColor : 'white',
          transparentCorners  : false,
          cornerStyle : 'circle',
          cornerSize : 15,
          cornerColor : 'rgba(255,255,255,0.7)',
          cornerStrokeColor : 'rgba(255,255,255,0.7)',
          strokeWidth : 3,
          deletable : true,
        });
        el.scaleToWidth(50);
        
        canvas.add(el);
        
        el.center().setCoords().bringToFront();
        el.on("moving",function(e){
          var center = this.getCenterPoint();
          if( center.x >= canvas_size - 60 && center.y >= canvas_size - 60){
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
      controls.addClass("active");
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
    // autoHeight: true
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
      case 'main-page':
        scrollTop();
        $("body").removeClass('card-start');
        content_slider.trigger("to.owl.carousel",[0,400,true]);
        break;
      case "card-start":
        scrollTop();
        $("body").addClass(id);
        setTimeout(function(){
          content_slider.trigger("to.owl.carousel",[1,400,true]);
        },1000);
        
        break;
      case "card-tree":
        scrollTop();
        $("body").removeClass('card-toys-page');
        content_slider.trigger("to.owl.carousel",[1,400,true]);
        steps_bar.to(1);
        break;

      case "card-toys":
        scrollTop();
        $("body").addClass('card-toys-page');
        card_builder.unsetBackground();
        card_builder.setTree(parseInt($("#tree-slider .active [data-tree]").attr("data-tree")));
        content_slider.trigger("to.owl.carousel",[2,400,true]);
        steps_bar.to(2);
        $("body").removeClass('card-message-page');
        break;

      case "card-message":
        scrollTop();
        $("body").removeClass('card-toys-page');
        $("body").addClass('card-message-page');
        card_builder.setBackground();
        
        content_slider.trigger("to.owl.carousel",[3,400,true]);
        steps_bar.to(3);
        $("body").removeClass("send-page");
        break;

      case "card-send":
        scrollTop();
        $("body").removeClass('card-message-page');
        png_card = card_builder.toPNG();
        png_message = message_builder.toPNG();
        $("#test").attr('src', png_card);
        $("#test-m").attr('src', png_message);

        svg_message = message_builder.toSVG();
        svg_card = card_builder.toSVG();
        submitCardAndMessage();
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

function submitCardAndMessage(){
  var form = $("#card-data"),
      card = $("#svg-card-data"),
      message = $("#svg-message-data");
  // var cut = svg_card.indexOf("<svg");
  // svg_card = svg_card.slice(cut);
  // cut = svg_message.indexOf("<svg");
  // svg_message = svg_message.slice(cut);
  // console.log(svg_card.length);
  // var card64 = window.btoa(encodeURIComponent(svg_card));
  // var message64 = window.btoa(encodeURIComponent(svg_message));
  // console.log(card64.length);
  // console.log(message64.length);
  card.val(svg_card);
  message.val(svg_message);

  var data = form.serialize();
  $.ajax({
    url: getAjaxPrifix(),
    type: 'POST',
    data: data,
    success: function(result) {
      console.log(result);
      data = JSON.parse(result);
      $("#url-to-card").val(data.url);
      $("[name='hash-id']").val(data.hash);
      $("#download").attr('href',data.link);
    },
    error: function(one, two, three){
      console.log(one);
      console.log(two);
      console.log(three);
    }
  });
}

});

function Tabs(options){
  var defs = {
    btns: ".tab-btn",
    tabs: ".tab-content",
    effect: false,
    close: "",
    callbackOpen: function(el){},
    callbackClose: function(el){},
  };
  var opts = $.extend(defs, options);

  var btns, tabs, group, close;

  function init(){
    btns = $(opts.btns);
    tabs = $(opts.tabs);
    if(opts.close){
      close = $(opts.close);
      close.on('click',closeTabs);
    }
    btns.on('click',onClick);
  }

  function closeTabs(){
    tabs.removeClass('active');
    btns.removeClass('active');
    opts.callbackClose(this);
  }

  function onClick(){
    btns.removeClass('active');
    if(opts.effect){
      tabs.removeClass(opts.effect);
    } else{
      tabs.slideUp(300);
    }
    var index = parseInt($(this).addClass('active').attr('data-index'));
    if(opts.effect){
      $(tabs.get(index-1)).addClass(opts.effect);
    } else{
      $(tabs.get(index-1)).slideDown(300);
    }
    opts.callbackOpen(this);
  }

  init();
}

function getPrefix(){
  return '';
}

function getAjaxPrifix(){
  return '/losevonewyear/';
}

//require JQUERY
function AjaxSubmit(options){
  var def = {
    form: '.ajax-submit',
    btn: '[type="submit"]',
    message: '.message',
    isMessageInput: false,
    inputs: 'input:not([type="submit"]), textarea',
    invalid: 'invalid', //class
    validate: validate, //boolean function(element)
    message_succsess: "Отплавлено",
    succsess_callback: function(){},
    error_callback: function(){},
  };
  var opts = $.extend(def, options);

  var form, btn, message, inputs, sendingFlag = false, message_init = "";

  function init(){
    form = $(opts.form);
    btn = form.find(opts.btn);
    message = form.find(opts.message);
    // inputs = form.find(opts.inputs);
    form.on("submit", submit);
  }

  function submit(){
    var err = false;
    inputs = $(this).find(opts.inputs);

    inputs.each(function(){
      if(opts.validate($(this))){
        $(this).removeClass(opts.invalid);
      } else{
        $(this).addClass(opts.invalid);
        err = true;
      }

    });

    if (!err){
      var data = $(this).serialize();
      $.ajax({
         type: 'POST',
         url: getAjaxPrifix(),
         dataType: 'json',
         data: data, 
         beforeSend: beforeSend,
         success: success,
         error: error,
         complete: complete
      });
    }
    return false;
  }

  function beforeSend(){
    if(opts.isMessageInput){
      message_init = message.val();
      message.val("Идет отправка...");
    } else{
      message_init = message.text();
      message.text("Идет отправка...");
    }
    btn.prop('disabled', true);
    sendingFlag = true;
  }

  function success(data){
    sendingFlag = false;
    if (data['error']) { 
      if(opts.isMessageInput){
        message.val("Ошибка");
      } else{
        message.text("Ошибка");
      }
    } else {
      if(opts.isMessageInput){
        message.val(opts.message_succsess);
      } else{
        message.text(opts.message_succsess);
      }
    }
    opts.succsess_callback();
  }

  function error(xhr, ajaxOptions, thrownError){
    sendingFlag = false;
    if(opts.isMessageInput){
      message.val("Ошибка");
    } else{
      message.text("Ошибка");
    }
    opts.error_callback();
    // console.log(xhr);
    // console.log(ajaxOptions);
    // console.log(thrownError);
    // btn.prop('disabled', false);
  }
  function complete(){
    if(sendingFlag){
      message.text(message_init);
      sendingFlag = false;
    }
    btn.prop('disabled', false);
  }
  function validate(el){
    var field_type = el.attr('data-type');
    switch(field_type){
      case 'required': 
        if (el.val() === ''){
          return false;
        }
        break;
      case 'email': 
        var isemail = /.+@.+\..+/i;
        var t = el.val();
        if(t === '' || !isemail.test(t)){
          return false;
        }
      break;
      default: ;
    }
    
    return true;
  }
  init();
}

function Popup(callback_open, callback_close){
  var self = this;
  var popup, btn_open, btn_close;

  function init(){
    btn_open = $(".popup-open-btn");
    btn_close = $(".popup-close-btn");
    popup = $(".popup");
    content = popup.find(".popup-content");

    btn_open.on('click', self.open);
    btn_close.on('click', self.close);

  }
  this.open = function(){
    if(callback_open){callback_open();}
    popup.addClass('active');
  };
  this.close = function(){
    popup.removeClass('active');
    if(callback_close){callback_close();}
  };
  this.setSizes = function(s){
    content.width(s.w);
    content.height(s.h);
  };
  init();
}

function LoadYoutubeVideo(){
  var height = window.innerHeight,
      width = window.innerWidth,
      ratio = 560/315,
      padding = window.innerWidth > 767 ? 100 : 30;


  function evalSize(){
    var hp = height - padding*2,
        wp = width - padding*2,
        result = {};
    var rp = wp/hp;
    if(rp >= ratio){
      result.h = hp;
      result.w = hp*ratio;
    } else{
      result.w = wp;
      result.h = wp/ratio;
    }
    return result;
  }

  var player, sizes;

  function initPlayer() {
    sizes = evalSize();
    player = new YT.Player('player', {
      height: sizes.h,
      width: sizes.w,
      videoId: 'OvW_L8sTu5E',
      events: {
        'onReady': onPlayerReady,
      }
    });
  }
  this.play = function(){
    player.playVideo();
  };
  this.init = function(){
    initPlayer();
  };
  this.stop = function(){
    player.stopVideo();
  };

  this.getSizes = function(){
    return sizes;
  };

  function onPlayerReady(){

  };
}
var losevo_video  = new LoadYoutubeVideo();
function onYouTubeIframeAPIReady(){
  losevo_video.init();
}

function scrollTop(){
  $('html,body').animate({scrollTop:0}, '500');
}