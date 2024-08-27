import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { AppServices } from './_services/app.service';
import { EventBusService } from './_shared/event-bus.service';
import { DynamicModalComponentService } from './common/services/dyamic-modal-component.service';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  isLoader = 0;
  longLoader = true;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  private ngUnsubscribe = new Subject<void>();
  eventBusSub?: Subscription;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private appService: AppServices,
    private router: Router,
    private dynamicService: DynamicModalComponentService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoggedIn = this.storageService.isLoggedIn();
      console.log("ngOninit loader", this.isLoader);

      this.longLoader = false;

      if (this.isLoggedIn) {
        const user = this.storageService.getUser();
        this.roles = user.roles;

        this.showAdminBoard = this.roles.includes("ROLE_ADMIN");
        this.showModeratorBoard = this.roles.includes("ROLE_MODERATOR");

        this.username = user.username;
      }
    }, 10);

    this.eventBusService.readEvent
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((action) => {
        if (action.name === "loader") {
          this.loadLoader(action.value);
        } else if (action.name === "startFull") {
          this.loadLoader("startFull");
        } else if (action.name === "stopLoader") {
          this.loadLoader(action.value);
        } else if (action.name === "logout") {
          this.logout();
        }
        console.log(" loader", this.isLoader, action);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadLoader(status: string) {
    if (status === "start") {
      this.isLoader++;
    } else if (status === "startFull") {
      this.isLoader++;
      this.longLoader = true;
    } else if (status === "stop") {
      this.isLoader--;
    } else {
      this.isLoader--;
      this.longLoader = false;
    }
    console.log("loadLoader loader", this.isLoader, status);
  }

  logout(): void {
    this.appService.logout().subscribe((res) => {
      console.log(res);
      this.storageService.clean();
      this.dynamicService.clearEverything();
      this.isLoader--;
      console.log("logout loader", this.isLoader);
      this.longLoader = false;
      this.router.navigate(["login"]);
    });
  }
}
