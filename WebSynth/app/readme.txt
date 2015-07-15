Testing
-------
This project is setup to debug using the built-in dev server and under
a subdirectory named 'WebSynth'. The purpose of this is to be sure
the application runs correctly whether run in the root of a web server
or under some subdirectory.  Do not hard code absolute URLs for either
root or the 'WebSynth' subdirectory.

Naming convenctions
--------------------
As recommended by the Angular team:

	Controllers:		PascalCase
	Everything else:	camelCase


Adding new controllers, services, etc
-------------------------------------
Each type has a template in it's respective directory. 

Examples:
	controller: controllers/controller-template.js
	service:	services/service-template.js
	etc...


RequireJS
---------
The app and it's dependencies are managed by RequireJS.  When adding new
controllers, services, etc be sure to add references to these scripts
in /app/scripts/main.js in order for RequireJS to pick them up.


jQuery
------
Avoid using jQuery unless absolutely necessary.  Use bootstrap whenever possible.


Routing
-------
The app uses ui-router for finer state management rather than raw URL
based routing.  See https://github.com/angular-ui/ui-router for more info.
