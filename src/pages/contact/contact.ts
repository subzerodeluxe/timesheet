import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  items: any = [];
  itemExpandHeight: number = 100;

  constructor(public navCtrl: NavController) {

      this.items = [{
            month: 'Juli 2018',
            weeks: [{ expanded: false,
            weekNumber: 29,
            fullDate: '16 augustus t/m 23 augustus 2018',
            totalHours: 37.5
            }, 
            { expanded: false,
              weekNumber: 30,
              fullDate: '26 augustus t/m 31 augustus 2018',
              totalHours: 20
            },
            { expanded: false,
              weekNumber: 31,
              fullDate: '3 september t/m 7 september 2018',
              totalHours: 35
            }]},
            {
              month: 'Augustus 2018',
              weeks: [{ expanded: false,
                weekNumber: 32,
                fullDate: '10 september t/m 14 september 2018',
                totalHours: 37.5
                }, 
                { expanded: false,
                  weekNumber: 33,
                  fullDate: '17 september t/m 21 september 2018',
                  totalHours: 20
                },
                { expanded: false,
                  weekNumber: 34,
                  fullDate: '24 september t/m 28 september 2018',
                  totalHours: 35
                }]
            }
          ];
  }
 
  expandItem(item, week){
      console.log('Week: ', week); 
      console.log('Item: ', item);

      this.items[0].weeks.map((listItem) => {
          console.log(listItem);
          if(item == listItem){
              listItem.expanded = !listItem.expanded;
          } else {
              listItem.expanded = false;
          }

          return listItem;

      });

  }
 
}
