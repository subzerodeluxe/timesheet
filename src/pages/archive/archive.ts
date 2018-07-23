import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage({
  name: 'archive'
})
@Component({
  selector: 'page-archive',
  templateUrl: 'archive.html',
})
export class ArchivePage {
  archiveAugust: any = [];
  archiveSeptember: any = [];
  itemExpandHeight: number = 100;

  constructor(public navCtrl: NavController, public authProvider: AuthProvider) {

      this.archiveAugust = [{
            month: 'Augustus 2018',
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
            }]}
          ];
        
      this.archiveSeptember = [
            {
              month: 'September 2018',
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
              }];
  }

  ionViewCanEnter() {
    return this.authProvider.authenticated();
  }

 
  expandItem(item, week){
      if (week.month === "Augustus 2018") {
        console.log(week.month);
        this.loop(this.archiveAugust, item);
      } else {
        console.log(week.month);
        this.loop(this.archiveSeptember, item);
      }
  }

  loop(array, item) {

    array[0].weeks.map((listItem) => {
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
