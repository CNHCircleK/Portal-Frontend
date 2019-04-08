# Portal

A web application intended to replace the CNH Circle K Monthly Report Form submission process that is currently handled through Excel sheets and email. Data shall be centralized, accessible by a back-end API, authorized only for CNH Circle K members.

## NPM Scripts

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Documentation

The /documentation folder contains an Angular breakdown generated by Compodoc. Open as a webpage to see things such as module structure, components, directives, routes, etc.

### Back-end Integration

The front-end of the portal interacts with [the back-end that handles data storage](https://github.com/CNHCircleK/Online-MRF/tree/master/routes). This current commit of the front-end corresponds to the commit f95c9c1 (March 4) on the back-end. We probably should have organized versioning and coupling a bit better.

### Structure

As a high-level overview compared to Compodoc's generated documentation, the general structure of the project is as follows:
 
    .
    ├── assets/Mockups			# Mockups for UI/UX
    ├── dist 					# Distribution files (`ng build --prod` to generate)
    ├── e2e						# End-2-end testing stuff. Haven't actually touched
    ├── documentation 			# Compodoc's generated documentation (`npm run compodoc` to generate)
    ├── src 					# Source files for the whole project
    │   ├── app 					# Meat of the app (`@app/...`)
    │   │   ├── core 					# Main project module: other modules, reusable guards/services/directives/etc.
    │   │   ├── modules					# Define modules here (current actually just separate components, no modules yet)
    │   │   ├── app.component 			# Defines main app component (i.e. all components actually rendered thru here)
    │   │   └── app.module.ts 			# Actual main module defined by Angular (bootstrapped to the project)
    │   ├── assets					# Project assets (`@assets/...`)
    │   ├── environments			# Environment stuff. I defined api_config for ease of use (`@env/...`)
    │   ├── styles 					# Project/global styles (e.g. customizing Angular material)
    │   ├── themes					# Define themes to be used in SASS files here (`@themes/...`)
    │   ├── index.html 				# Blank template, Angular project bootstraped by main.ts
    │   └── other files 			# Angular stuff?
    └── etc.					# Check out Angular and NPM stuff (angular.json, package.json)


Modules contains mostly page-granular components (a module for a CERF, a module for Divisions page, etc.). This and the core folder will contain most of the code for the project.

### Next Steps

Before more API updates and implementing new things, some plans I haven't finished yet:

:point_right: Finish restructuring services and data in a Typescript way (classes, encapsulated component-instanced services)

:point_right: Create actual modules for lazy-loading and cleanliness (looking a Compodoc's module structure...)

:point_right: Member ID piping (present member name on the form but internally store their ID? Note members with same name)

:point_right: Signup/login end-to-end tuning (e.g. signing up should automatically login OR route to login page)

:point_right: MRF events table + imported events (right now it displays... nothing)

:point_right: Display author in CERFs list table and change CERF status display (i.e. "Draft" or "Submitted") depending on if user is secretary or not

:point_right: Connect Administration tab to the backend

:point_right: Finish Clubs and Divisions tabs for LTGs and District Secretary respectively (i.e. making clubs/divisions, appointing LTGs/presidents)

:point_right: MRF List view for Secretaries, LTGs, and District Secretaries (i.e. LTGs should be able to see latest MRF from all clubs in division OR navigate by club)

### Future Implementations

:memo: Trends

:memo: Excel sheet integration (importing to smooth the transition, exporting for offline use?)

:memo: Document versioning (like Google Docs)

:memo: Master Record Sheet support

## Hello World Assignment

Angular is a monolith, but to get started with navigating this project, here are some basic tasks to attempt:

### Create a Hello World page

1. Create a component, this doesn't have to be a separate module (yet), in /modules. Follow the structure of something simple like /modules/faqs (ignore the .spec.ts file, that's for unit testing)
2. In app module, import it and declare it
3. In routing module, add it as a route (no guards or resolver or anything needed)
4. In app.component, add it as a tab to the sidebar (this is done dynamically, just slap it into the links array and define what access will see it in refreshView())
5. Try running the app, logging in, and navigating to it
6. Remove all traces you've made