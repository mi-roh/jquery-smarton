/*
 *  jquery-smartOn - v0.1.0
 *  Adds a set of function to manipulate on-event-binding
 *  https://github.com/mi-roh/jquery-smarton/
 *
 *  Written by Micha Rohde (hi@mi-roh.de)
 *  Under MIT License
 *  SDG
 */
/*!
 * jquery-miRohSmartOn
 *
 * implements
 *
 * .afterOn()
 * .smartOn()
 * .everyOn()
 * .delayOn()
 *
 * SDG
 *
 * @author      Micha Rohde <hi@mi-roh.de>
 *
 */

/**
 * @todo  add a counter Reset ?
 * @todo  .on() supports following param-list: events (plain Object, Event-Handler), selector, data;
 */

( function( root, factory ) {

    var moduleName = "jquerySmartOn";

    if ( typeof exports === "object" && typeof module === "object" ) {
        module.exports = factory( require( "jquery" ) );
    } else if ( typeof define === "function" && define.amd ) {
        define( [ "jquery" ], factory );
    } else if ( typeof exports === "object" ) {
        exports[ moduleName ] = factory( jQuery );
    } else {
        root[ moduleName ] = factory( jQuery );
    }

} )( this, function( $ ) {

    "use strict";

    //  Don't throw any errors when jQuery
    if ( !$ ) {
        return console.warn( "smartOn needs jQuery" );
    }

    /**
     * Define smartOn Plugin
     * triggers the handler after the event was not triggered for delay ms times
     *
     * @callback smartOn
     * @param eventTypes {object|string} events passed to .on() - see .on()
     * @param [selector] {string} live-Selector passed to .on() - see .on()
     * @param [data] {object} data passed to .on() - see .on()
     * @param handler {function} handler to call on event - see .on()
     * @param [delay] {number} delay in ms (or other counting, depending on Definition) after event
     * to call the handler
     * @returns {*|HTMLElement}
     */

    /**
     * Defines an Handler within an a smartOn Plugin, handling when the event gets called.
     * @callback smartOnAction
     * @param fire {function} a Function to call if the event will be called
     * @param delay {number} the last parameter of the smartOn-Call
     * @param global {object} an Object, that will be passed every call, to transfer Data between
     * calls.
     * @param global.t {number} a pointer to a running timeout
     * @param global.counter {number} counts of events since last time the fire()-Function got
     * called
     */

    /**
     * Name of the After-Plugin in jQuery
     * @type {string}
     */
    var PLUGIN_NAME_AFTER = "afterOn";
    /**
     * Name of the Smart-Plugin in jQuery
     * @type {string}
     */
    var PLUGIN_NAME_SMART = "smartOn";
    /**
     * Name of the Every-Plugin in jQuery
     * @type {string}
     */
    var PLUGIN_NAME_EVERY = "everyOn";
    /**
     * Name of the Every-Plugin in jQuery
     * @type {string}
     */
    var PLUGIN_NAME_DELAY = "delayOn";

    var DATA_ATTR = "smartOnEventKeys";

    /**
     * Default Delay if not set on definition
     * @type {number}
     */
    var DEFAULT_DELAY = 300;

    /**
     * Only for Validation purpose
     * @type {{}|*}
     */
    $.fn = $.fn || {};

    /**
     * With every ID it gets iterated
     * @type {number}
     */
    var idCounter = 0;

    /**
     * Random Key for Ids.
     * @type {number}
     */
    var idRandom = Math.floor( Math.random() * 26 ) + Date.now();

    /**
     * Generates a smartOn-Function
     * @param smartOnName {string} Name of the smartOnFunction
     * @param smartOnAction {smartOnAction}
     * @param [defaultEventDelay] {number}
     * @returns {smartOn}
     */
    var event = function( smartOnName, smartOnAction, defaultEventDelay ) {

        // Function gets called on initialization of this Script

        defaultEventDelay =
            "number" === typeof defaultEventDelay ? defaultEventDelay : DEFAULT_DELAY;

        return function( eventTypes, selector, data, handler, delay ) {

            // The Actual Plugin gets Called on Call of .smartOn...

            var arg = Array.prototype.slice.call( arguments ),
                handlerArgument = arg.pop(),
                delayArgument = defaultEventDelay,
                $this = $( this ),
                smartHandler,
                getElementGlobal,
                elementGlobals = {},
                idBase = smartOnName + idRandom + "_" + ( ++idCounter );

            if ( "number" === typeof handlerArgument ) {
                delayArgument = handlerArgument;
                handlerArgument = arg.pop();
            }

            /**
             * returns a custom Object for the Element an Event-Binding
             * for global Data-Storage between several event-calls
             * @param $ele the Element to get the Data from
             * @returns {{$ele:jQuery|HTMLElement,counter:int,...}}
             */
            getElementGlobal = function( $ele ) {
                var key,
                    keys = $ele.data( DATA_ATTR ) || {};
                $ele.data( DATA_ATTR, keys );
                if ( !keys[ idBase ] ) {
                    keys[ idBase ] = ++idCounter;
                }
                key = keys[ idBase ];
                if ( !elementGlobals[ key ] ) {
                    elementGlobals[ key ] = {
                        $ele: $ele,
                        counter: 0
                    };
                }
                return elementGlobals[ key ];
            };

            /**
             * Replaces the handler in the on-binding and fires the handler and prepares a function
             * to call, to fire the handler
             */
            smartHandler = function( eventObject ) {

                // Gets called when the original on-Event gets triggered

                // Global this
                var THIS = this;

                // global Object for Data storage between several calls
                var global = getElementGlobal( $( this ) );

                // Arguments for the trigger-Call
                var onArguments = Array.prototype.slice.call( arguments );

                // Data to pass to the trigger-Call
                var smartOnEventData = onArguments[ 0 ].smartOn = {
                    name: smartOnName
                };

                // Function to trigger the call.
                var fire = function() {

                    // Gets called by the smartOnAction wenn the Event shall fire

                    smartOnEventData.count = global.counter;
                    smartOnEventData.eventObjects = global.eventObjects;

                    handlerArgument.apply( THIS, onArguments );
                    global.counter = 0;
                };

                if ( !global.eventObjects ) {
                    global.eventObjects = [];
                }

                global.counter++;
                global.eventObjects.push( eventObject );

                smartOnAction( fire, delayArgument, global );

            };

            // arg.push( dataArgument);
            arg.push( smartHandler );

            $.fn.on.apply( $this, arg );

            return $this;
        };

    };

    /**
     * Define afterOn Plugin
     * triggers the handler after the event was not triggered for delay ms times
     * @type {smartOn}
     */
    $.fn[ PLUGIN_NAME_AFTER ] = event(
        PLUGIN_NAME_AFTER,
        /**
         * @typedef smartOnAction
         */
        function( fire, delay, global ) {
            clearTimeout( global.t );
            global.t = setTimeout( function() {
                fire();
            }, delay );
        }
    );

    /**
     * Define smartOn Plugin
     * triggers the handler only every delay (ms)
     * @type {smartOn}
     */
    $.fn[ PLUGIN_NAME_SMART ] = event(
        PLUGIN_NAME_SMART,
        function( fire, delay, global ) {
            if ( !global.t || global.t === -1 ) {
                global.t = setTimeout( function() {
                    fire();
                    clearTimeout( global.t );
                    global.t = -1;
                }, delay );
            }
        }
    );

    /**
     * Define everyOn Plugin
     * triggers the handler only every delay times
     * @type {smartOn}
     */
    $.fn[ PLUGIN_NAME_EVERY ] = event(
        PLUGIN_NAME_EVERY,
        function( fire, delay, global ) {
            if ( delay <= global.counter ) {
                fire();
            }
        },
        10
    );

    /**
     * Define delayOn Plugin
     * triggers the handler with a given delay (ms)
     * @type {smartOn}
     *
     * @todo - bug - doubleclick?
     */
    $.fn[ PLUGIN_NAME_DELAY ] = event(
        PLUGIN_NAME_DELAY,
        function( fire, delay, global ) {
            setTimeout( function() {
                fire();
            }, delay );
        }
    );
} );
