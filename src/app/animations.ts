import {  animate, style, trigger, state, transition, keyframes } from '@angular/animations';


export const walkthrough = trigger('bounce', [
  state('*', style({
      transform: 'translateX(0)'
  })),
  transition('* => rightSwipe', animate('700ms ease-out', keyframes([
    style({transform: 'translateX(0)', offset: 0}),
    style({transform: 'translateX(-65px)',  offset: 0.3}),
    style({transform: 'translateX(0)',     offset: 1.0})
  ]))),
  transition('* => leftSwipe', animate('700ms ease-out', keyframes([
    style({transform: 'translateX(0)', offset: 0}),
    style({transform: 'translateX(65px)',  offset: 0.3}),
    style({transform: 'translateX(0)',     offset: 1.0})
  ])))
]);

export const infinitePulse = trigger('shake', [
  state('small',style({ transform: 'scale(1)', offset: 0 })),
  state('big', style({ transform: 'scale(1.2)', offset: 0.5 })),
  transition('small => big', animate('750ms 500ms ease')),
  transition('big => small', animate('750ms 500ms ease'))
]);
