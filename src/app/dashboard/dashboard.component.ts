import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AppServices } from '../_services/app.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})

export class DashboardComponent implements OnInit {
  authResponse: any = {};

  constructor(
    private appService: AppServices, 
    private router: Router,
    private storageService: StorageService
  ){}

  ngOnInit(): void {
  }
}
