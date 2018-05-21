# jQuery SmartOn

### A Plugin to add Smart-On-Actions

This Plugin contains several jQuery-Functions that make the ```.on()``` function more powerfull. 

All functions have the same parameters like ```.on()``` with an aditional fith parameter called ```delay```. 

Containing: 

- ```.smartOn()``` Triggers the event only every ```deley```ms while the Elements gets triggered
- ```.afterOn()``` Triggers the event after the event wasn't triggert for ```delay```ms 
- ```.everyOn()``` Triggers the event every ```delay```times the event gets triggert
- ```.delayOn()``` Triggers the event with an delay of ```delay```ms

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="dist/jquery.smartOn.min.js"></script>
	```

3. Call the plugin:

	```javascript
	$(window).smartOn('scroll', function() {
		// While windows.scroll gets triggert, this function will only be calles every 10ms.
	}, 10);
	```



## Demo

Check [demo/index.html](https://github.com/mi-roh/jquery-smarton/blob/master/demo/index.html) for a demonstration.

## License

[MIT License](https://github.com/mi-roh/jquery-smarton/blob/master/license.txt) © Micha Rohde
