import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-card',
  templateUrl: './help-card.component.html',
  styleUrls: ['./help-card.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class HelpCardComponent {

  constructor(
    private router: Router
  ){}
  
  open(page: string) {
    this.router.navigate(["help", page]);
  }

}
