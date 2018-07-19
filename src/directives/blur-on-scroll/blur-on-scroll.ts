import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[blur-on-scroll]', // Attribute selector,
  host: {
    '(ionScroll)': 'onContentScroll($event)',
    '(window:resize)': 'onWindowResize($event)'
  }
})
export class BlurOnScrollDirective {

  hoursBox: any;
  translateAmt: any;
  hoursBoxHeight: any;
  testContent: any;


  constructor(public element: ElementRef, public renderer: Renderer2){

  }

 

  ngAfterViewInit() {

    this.hoursBox = this.element.nativeElement.getElementsByClassName('total-hours-box')[0];
    // this.testContent = this.element.nativeElement.getElementsByClassName('test')[0];
    console.log(this.hoursBox);

    this.renderer.setStyle(this.hoursBox, 'opacity', '1');
    // this.renderer.setStyle(this.testContent, 'opacity', '0.5');
  }

  onContentScroll(ev) {
    
    console.log(ev);
    ev.domWrite(() => {
        this.updateBlur(ev);
    });

    this.resetStyles();
  } 

  updateBlur(ev) {
    console.log('Er wordt gescrolt');
    if (ev.scrollTop > 0) {
      this.translateAmt = ev.scrollTop / 2;
      console.log(this.translateAmt);
    } else {
      this.renderer.setStyle(this.hoursBox, 'opacity', '0');
      console.log('Begin punt');
     // this.translateAmt = 0;
    }

    // this.resetStyles();
  
  }

  resetStyles() {
    this.renderer.setStyle(this.hoursBox, 'opacity', '1');
    // this.renderer.setStyle(this.testContent, 'opacity', '0.5');
  }

  


}
