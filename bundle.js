(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const timestamp = require('time-funcs/timestamp')
const Unipointer = require('unipointer')



function PointerFun( elem ) {
  this.element = elem
  this.log = document.querySelector('.log')

  this.bindStartEvent( this.element )
}
// inherit Unipointer
PointerFun.prototype = new Unipointer()

// overwrite public pointer methods
PointerFun.prototype.pointerDown = function( event, pointer ) {
// console.log('pointer down', event, pointer, this.log);
  this.append('pointerDown')
  // this.log.value = timestamp() + ' pointerDown\n' + this.log.value
  this._bindPostStartEvents( event )
}

PointerFun.prototype.pointerMove = function( event, pointer ) {
  this.append('pointerMove')
  // this.log.value = timestamp() + ' pointerDown\n' + this.log.value
// console.log('pointer move');
};

PointerFun.prototype.pointerUp = function( event, pointer ) {
  this.append('pointerUp')
// console.log('pointer up');
};

PointerFun.prototype.pointerCancel = function( event, pointer ) {
  this.append('pointerCancel')
// console.log('pointer cancel');
};

// triggered on pointerUp and pointerCancel
PointerFun.prototype.pointerDone = function( event, pointer ) {
  this.append('pointerDone')
// console.log('pointer done');
};

PointerFun.prototype.append = function( text ) {
  this.log.value = timestamp() + ' ' + text + '\n' + this.log.value
}

new PointerFun(document.querySelector('.rect'))

},{"time-funcs/timestamp":5,"unipointer":6}],2:[function(require,module,exports){
/**
 * EvEmitter v1.0.3
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : this, function() {

"use strict";

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var i = 0;
  var listener = listeners[i];
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  while ( listener ) {
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
    // get next listener
    i += isOnce ? 0 : 1;
    listener = listeners[i];
  }

  return this;
};

return EvEmitter;

}));

},{}],3:[function(require,module,exports){
module.exports = function(data) {
  if (data == null) return false
  return data instanceof Date
    && data.getTime() === data.getTime()
}

},{}],4:[function(require,module,exports){
module.exports = function(data, check, safe) {
  if (safe === true) {
    if (data == null || Object.getPrototypeOf(data) !== String.prototype) return false
  }
  else if (typeof data !== 'string') return false

  return check === undefined || check === true
    ? data.trim().length > 0
    : true
}

},{}],5:[function(require,module,exports){
/*
Y: the year with the century
y: the year without the century (00-99)
z: the year without the century, padded with a leading space for single digit values (1-9)

O: the month, padded to 2 digits (01-12)
o: the month
p: the month, padded with a leading space for single digit values (1-9)

D: day of the month, padded to 2 digits (01-31)
d: day of the month
e: day of the month, padded with a leading space for single digit values (1-9)

H: the hour (24-hour clock), padded to 2 digits (00-23)
h: the hour (24-hour clock)
i: the hour (24-hour clock), padded with a leading space for single digit values (0-9)

M: the minute, padded to 2 digits (00-59)
m: the minute
n: the minute, padded with a leading space for single digit values (0-9)

S: the second, padded to 2 digits (00-60)
s: the second
t: the second, padded with a leading space for single digit values (0-9)

L: the milliseconds, padded to 3 digits
l: the milliseconds (only the first digit)
*/

const isString = require('is-funcs/is-string')
const isDate = require('is-funcs/is-date')

module.exports = function(pattern, date) {
  if (isString(pattern) === false) pattern = 'H:M:S.L'
  if (isDate(date) === false) date = new Date()

  var str = ''
  var c
  var t
  for (var i = 0, n = pattern.length; i < n; i++) {
    c = pattern.charCodeAt(i)

    // H or i
    if (c === 72 || c === 105) {
      t = date.getHours()
      if (t > 9) str += t
      else str += (c === 72 ? '0' : ' ') + t
    }
    // h
    else if (c === 104) {
      str += date.getHours()
    }
    // M or n
    else if (c === 77 || c === 110) {
      t = date.getMinutes()
      if (t > 9) str += t
      else str += (c === 77 ? '0' : ' ') + t
    }
    // m
    else if (c === 109) {
      str += date.getMinutes()
    }
    // S or t
    else if (c === 83 || c === 116) {
      t = date.getSeconds()
      if (t > 9) str += t
      else str += (c === 83 ? '0' : ' ') + t
    }
    // s
    else if (c === 115) {
      str += date.getSeconds()
    }
    // L
    else if (c === 76) {
      t = date.getMilliseconds().toString()
      while (t.length < 3) t = '0' + t
      str += t
    }
    // l
    else if (c === 108) {
      t = date.getMilliseconds()
      if (t < 100) str += '0'
      else str += t.toString().charAt(0)
    }
    // Y
    else if (c === 89) {
      str += date.getFullYear()
    }
    // y or z
    else if (c === 121 || c === 122) {
      t = date.getFullYear().toString().substr(2)
      if (c === 122 && t.charAt(0) === '0') str += ' ' + t.substr(1)
      else str += t
    }
    // O or p
    else if (c === 79 || c === 112) {
      t = date.getMonth() + 1//)/.toString()
      if (t > 9) str += t
      else str += (c === 79 ? '0' : ' ') + t
    }
    // o
    else if (c === 111) {
      str += (date.getMonth() + 1)
    }
    // D or e
    else if (c === 68 || c === 101) {
      t = date.getDate()
      if (t > 9) str += t
      else str += (c === 68 ? '0' : ' ') + t
    }
    // d
    else if (c === 100) {
      str += date.getDate()
    }
    else {
      str += pattern.charAt(i)
    }
  }
  return str
}

},{"is-funcs/is-date":3,"is-funcs/is-string":4}],6:[function(require,module,exports){
/*!
 * Unipointer v2.2.0
 * base class for doing one thing with pointer event
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*global define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'ev-emitter/ev-emitter'
    ], function( EvEmitter ) {
      return factory( window, EvEmitter );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('ev-emitter')
    );
  } else {
    // browser global
    window.Unipointer = factory(
      window,
      window.EvEmitter
    );
  }

}( window, function factory( window, EvEmitter ) {

'use strict';

function noop() {}

function Unipointer() {}

// inherit EvEmitter
var proto = Unipointer.prototype = Object.create( EvEmitter.prototype );

proto.bindStartEvent = function( elem ) {
  this._bindStartEvent( elem, true );
};

proto.unbindStartEvent = function( elem ) {
  this._bindStartEvent( elem, false );
};

/**
 * works as unbinder, as you can ._bindStart( false ) to unbind
 * @param {Boolean} isBind - will unbind if falsey
 */
proto._bindStartEvent = function( elem, isBind ) {
  // munge isBind, default to true
  isBind = isBind === undefined ? true : !!isBind;
  var bindMethod = isBind ? 'addEventListener' : 'removeEventListener';

  if ( window.PointerEvent ) {
    // Pointer Events. Chrome 55, IE11, Edge 14
    elem[ bindMethod ]( 'pointerdown', this );
  } else {
    // listen for both, for devices like Chrome Pixel
    elem[ bindMethod ]( 'mousedown', this );
    elem[ bindMethod ]( 'touchstart', this );
  }
};

// trigger handler methods for events
proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// returns the touch that we're keeping track of
proto.getTouch = function( touches ) {
  for ( var i=0; i < touches.length; i++ ) {
    var touch = touches[i];
    if ( touch.identifier == this.pointerIdentifier ) {
      return touch;
    }
  }
};

// ----- start event ----- //

proto.onmousedown = function( event ) {
  // dismiss clicks from right or middle buttons
  var button = event.button;
  if ( button && ( button !== 0 && button !== 1 ) ) {
    return;
  }
  this._pointerDown( event, event );
};

proto.ontouchstart = function( event ) {
  this._pointerDown( event, event.changedTouches[0] );
};

proto.onpointerdown = function( event ) {
  this._pointerDown( event, event );
};

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto._pointerDown = function( event, pointer ) {
  // dismiss other pointers
  if ( this.isPointerDown ) {
    return;
  }

  this.isPointerDown = true;
  // save pointer identifier to match up touch events
  this.pointerIdentifier = pointer.pointerId !== undefined ?
    // pointerId for pointer events, touch.indentifier for touch events
    pointer.pointerId : pointer.identifier;

  this.pointerDown( event, pointer );
};

proto.pointerDown = function( event, pointer ) {
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// hash of events to be bound after start event
var postStartEvents = {
  mousedown: [ 'mousemove', 'mouseup' ],
  touchstart: [ 'touchmove', 'touchend', 'touchcancel' ],
  pointerdown: [ 'pointermove', 'pointerup', 'pointercancel' ],
};

proto._bindPostStartEvents = function( event ) {
  if ( !event ) {
    return;
  }
  // get proper events to match start event
  var events = postStartEvents[ event.type ];
  // bind events to node
  events.forEach( function( eventName ) {
    window.addEventListener( eventName, this );
  }, this );
  // save these arguments
  this._boundPointerEvents = events;
};

proto._unbindPostStartEvents = function() {
  // check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
  if ( !this._boundPointerEvents ) {
    return;
  }
  this._boundPointerEvents.forEach( function( eventName ) {
    window.removeEventListener( eventName, this );
  }, this );

  delete this._boundPointerEvents;
};

// ----- move event ----- //

proto.onmousemove = function( event ) {
  this._pointerMove( event, event );
};

proto.onpointermove = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerMove( event, event );
  }
};

proto.ontouchmove = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerMove( event, touch );
  }
};

/**
 * pointer move
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerMove = function( event, pointer ) {
  this.pointerMove( event, pointer );
};

// public
proto.pointerMove = function( event, pointer ) {
  this.emitEvent( 'pointerMove', [ event, pointer ] );
};

// ----- end event ----- //


proto.onmouseup = function( event ) {
  this._pointerUp( event, event );
};

proto.onpointerup = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerUp( event, event );
  }
};

proto.ontouchend = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerUp( event, touch );
  }
};

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerUp = function( event, pointer ) {
  this._pointerDone();
  this.pointerUp( event, pointer );
};

// public
proto.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
};

// ----- pointer done ----- //

// triggered on pointer up & pointer cancel
proto._pointerDone = function() {
  // reset properties
  this.isPointerDown = false;
  delete this.pointerIdentifier;
  // remove events
  this._unbindPostStartEvents();
  this.pointerDone();
};

proto.pointerDone = noop;

// ----- pointer cancel ----- //

proto.onpointercancel = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerCancel( event, event );
  }
};

proto.ontouchcancel = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerCancel( event, touch );
  }
};

/**
 * pointer cancel
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerCancel = function( event, pointer ) {
  this._pointerDone();
  this.pointerCancel( event, pointer );
};

// public
proto.pointerCancel = function( event, pointer ) {
  this.emitEvent( 'pointerCancel', [ event, pointer ] );
};

// -----  ----- //

// utility function for getting x/y coords from event
Unipointer.getPointerPoint = function( pointer ) {
  return {
    x: pointer.pageX,
    y: pointer.pageY
  };
};

// -----  ----- //

return Unipointer;

}));

},{"ev-emitter":2}]},{},[1]);
