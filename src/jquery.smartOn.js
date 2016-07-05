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
 * @version     0.2
 * @author      Micha Rohde <hi@mi-roh.de>
 * @copyright   Copyright (c) 2016 Micha Rohde
 *
 */

/**
 * @todo  add a counter Reset ?
 * @todo  .on() supports following param-list: events (plain Object, Event-Handler), selector, data;
 */

// jshint -W098

;( function( w, $, Array, Date ) {

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
     * @param global.counter {number} counts of events since last time the fire()-Function got
     * called
     */

    /**
     * Name of the After-Plugin in jQuery
     * @type {string}
     */
    var pluginNameAfter = "afterOn";
    /**
     * Name of the Smart-Plugin in jQuery
     * @type {string}
     */
    var pluginNameSmart = "smartOn";
    /**
     * Name of the Every-Plugin in jQuery
     * @type {string}
     */
    var pluginNameEvery = "everyOn";
    /**
     * Name of the Every-Plugin in jQuery
     * @type {string}
     */
    var pluginNameDelay = "delayOn";

    /**
     * Default Delay if not set on definition
     * @type {number}
     */
    var defaultDelay = 300;

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
            "number" === typeof defaultEventDelay ? defaultEventDelay : defaultDelay;

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
             * @returns {object}
             */
            getElementGlobal = function( $ele ) {
                var key,
                    keys = $ele.data( "smartOnEventKeys" ) || {};
                $ele.data( "smartOnEventKeys", keys );
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
    $.fn[ pluginNameAfter ] = event(
        pluginNameAfter,
        function( fire, delay, global ) {
            w.clearTimeout( global.t );
            global.t = w.setTimeout( function() {
                fire();
            }, delay );
        }
    );

    /**
     * Define smartOn Plugin
     * triggers the handler only every delay (ms)
     * @type {smartOn}
     */
    $.fn[ pluginNameSmart ] = event(
        pluginNameSmart,
        function( fire, delay, global ) {
            if ( !global.t || global.t === -1 ) {
                global.t = w.setTimeout( function() {
                    fire();
                    w.clearTimeout( global.t );
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
    $.fn[ pluginNameEvery ] = event(
        pluginNameEvery,
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
    $.fn[ pluginNameDelay ] = event(
        pluginNameDelay,
        function( fire, delay, global ) {
            w.setTimeout( function() {
                fire();
            }, delay );
        }
    );
} )( window, jQuery, Array, Date );
