import { Component, OnInit } from '@angular/core';
import { AppServices } from '../_services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  

  constructor(private appService: AppServices) { }

  ngOnInit(): void {
    
  }
}
