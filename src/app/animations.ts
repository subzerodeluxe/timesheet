import {  animate, style, trigger, state, transition, keyframes, query, stagger } from '@angular/animations';


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


export const staggerAnimation = trigger('staggerAnimation', [
  transition('* => *', [
    query('.schedule-item', style({ opacity: 0, transform: 'translateX(-40px)' }), { optional: true }),
    query('.schedule-item', stagger('500ms', [
      animate('800ms 0.9s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
    ]), { optional: true }),
    query('.schedule-item', [
      animate(1000, style('*'))
    ], { optional: true })
  ])
])

export const loadHoursAnimation = trigger('staggerAnimation', [
  transition('* => *', [
    query('.hour-section', style({ opacity: 0, transform: 'translateX(-40px)' }), { optional: true }),
    query('.hour-section', stagger('500ms', [
      animate('800ms 0.9s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
    ]), { optional: true }),
    query('.hour-section', [
      animate(1000, style('*'))
    ], { optional: true })
  ])
])

export const showNoActivitiesMessage = trigger('staggerAnimation', [
  transition('* => *', [
    query('.schedule-data', style({ opacity: 0, transform: 'translateX(-40px)' }), { optional: true }),
    query('.schedule-data', stagger('500ms', [
      animate('800ms 0.9s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
    ]), { optional: true }),
    query('.schedule-data', [
      animate(1000, style('*'))
    ], { optional: true })
  ])
])