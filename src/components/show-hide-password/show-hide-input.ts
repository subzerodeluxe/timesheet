import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[show-hide-input]'
})
export class ShowHideInput
{
  @Input() type: string;

  constructor(public el: ElementRef){
    this.type = 'password';
  }

  changeType(type:string) {
    this.type = type;
    this.el.nativeElement.children[0].type = this.type;
  }
}
