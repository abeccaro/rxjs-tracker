# rxjs-tracker
A tracker for rxjs observables that allows logging values at each operator and keeps track of subscription counts

## Install instructions

To install simply launch

`npm i @abeccaro/rxjs-tracker`

To track an Observable use the function `track` passing the observable and its name

`const trackedObservable = track(myObservable, 'My name');`

## Changelog

### Version 0.1.0

First release containing 
- a function to track observables
- a new type of Observable that logs debug data about them
- an option to enable or disable globally the tracking
