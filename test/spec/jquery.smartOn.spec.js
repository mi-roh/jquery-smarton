( function( $, QUnit ) {

	"use strict";

	var $testCanvas = $( "#testCanvas" );
	var $fixture = null;
	var functions = [
		"afterOn",
		"smartOn",
		"everyOn",
		"delayOn"
	];

	QUnit.module( "jQuery Boilerplate", {
		beforeEach: function() {

			// fixture is the element where your jQuery plugin will act
			$fixture = $( "<div/>" );

			$testCanvas.append( $fixture );
		},
		afterEach: function() {

			// we remove the element to reset our plugin job :)
			$fixture.remove();
		}
	} );

	QUnit.test( "is inside jQuery library", function( assert ) {

		for (var i in functions) {
			assert.equal( typeof $.fn[functions[i]], "function", functions[i] + " is function and inside of jquery.fn" );
		}
	} );

	QUnit.test( "returns jQuery functions after called (chaining)", function( assert ) {
		for (var i in functions) {
			assert.equal(
				typeof $fixture[functions[i]]().on,
				"function",
				"'on' function must exist after call " + functions[i] + "()");
		}
	} );

}( jQuery, QUnit ) );
