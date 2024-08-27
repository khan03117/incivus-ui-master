import { Directive, ElementRef, Input, Renderer2, RendererStyleFlags2 } from '@angular/core';

@Directive({
  selector: '[myHighlight]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mousemove)': 'onMouseMovement($event)',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class HighlightDirective {
    private _defaultColor = 'blue';
    private el: HTMLElement;

    @Input('myHighlight') highlightColor: string;

    constructor(el: ElementRef, private renderer: Renderer2) { this.el = el.nativeElement; }

    onMouseEnter() { console.log('mouse enter'); }
    onMouseLeave(e:any) {
        let nextElement = this.el.nextElementSibling;
        this.renderer.setStyle(nextElement, 'top', 'unset');
        this.renderer.setStyle(nextElement, 'left', 'unset');
    }

    
    onMouseMovement(e:any) {
        const nextElement = this.el.nextElementSibling;
        const gridContainer = document.querySelector<HTMLElement>(".grid-content-container");
        const tooltip = nextElement;
          const clientLeft : any =
              (e.pageX + tooltip?.clientWidth + 10 < document.body.clientWidth)
                  ? (e.pageX - 15)
                  : (document.body.clientWidth - 50 - tooltip?.clientWidth!);
          const clientTop : any=
              (e.pageY + tooltip?.clientHeight + 10 < document.body.clientHeight)
                  ? (e.pageY + 30)
                  : (document.body.clientHeight + 30 - tooltip?.clientHeight!);
                  
          this.renderer.setStyle(nextElement, 'top',(clientTop - gridContainer?.offsetTop!)+'px');
          this.renderer.setStyle(nextElement, 'left', (clientLeft - gridContainer?.offsetLeft!) + 10 + "px");
    }

}