import { Component } from '@angular/core';
import { AppServices } from 'src/app/_services/app.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/_services/storage.service';
import { MessageService } from 'src/app/_services/message.service';
import { map } from 'rxjs';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.less"],
})
export class HeaderComponent {
  selectedLanguage = "en-US";
  showNotification: boolean = false;
  userDetails: any = {};
  messageItems: any;
  isIncAdmin: boolean = false;
  isClAdmin: boolean = false;
  isServiceManager: boolean = false;

  constructor(
    private router: Router,
    private appService: AppServices,
    private storageService: StorageService,
    private message: MessageService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.userDetails = this.storageService.getUser();
      if (
        this.userDetails &&
        this.userDetails.roles &&
        this.userDetails.roles.includes("INCIVUS_ADMIN")
      ) {
        this.isIncAdmin = true;
      }
      if (
        this.userDetails &&
        this.userDetails.roles &&
        this.userDetails.roles.includes("CL_ADMIN")
      ) {
        this.isClAdmin = true;
      }
      if (
        this.userDetails &&
        this.userDetails.roles &&
        this.userDetails.roles.includes("SERVICE_MANAGER")
      ) {
        this.isServiceManager = true;
      }
      if (this.userDetails) {
        this.message.initMessageService(this.userDetails.id);
        this.retrieveMessages();
      }
    }, 10);
  }

  retrieveMessages() {
    let self = this;
    this.message
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes: any) =>
          changes.map((c: any) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        let totalMsg = data.length;
        // let nMsg = localStorage.getItem("newMessage");
        // this.newMessage = nMsg ? false : true;

        let messages = data.filter(function (a: any) {
          return self.checkDate(a.timeStamp);
        });

        this.messageItems = messages.sort(function (a: any, b: any) {
          return b.timeStamp - a.timeStamp;
        });
        console.log(this.messageItems);
        // if (this.messageItems.length > 0) {
        //   let prevMsgCount = localStorage.getItem("msgCount") ? parseInt(localStorage.getItem("msgCount")) : 0;
        //   if (prevMsgCount !== totalMsg) {
        //     // this.audioPlayer.nativeElement.play();
        //     localStorage.setItem("msgCount", '' + totalMsg);
        //     setTimeout(() => {
        //       this.newMessage = true;
        //       localStorage.removeItem("newMessage");
        //     }, 0);
        //   }

        // }
      });
  }

  checkDate(dateSent: string) {
    let currentDate = new Date();
    let dateSentF = new Date(dateSent);

    let diff = Math.floor(
      (Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ) -
        Date.UTC(
          dateSentF.getFullYear(),
          dateSentF.getMonth(),
          dateSentF.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
    return diff < 7;
  }

  hideNotification() {
    this.showNotification = false;
  }

  changeLanguage() {
    console.log("Language", this.selectedLanguage);
  }

  logout() {
    this.appService.logout().subscribe((data) => {
      if (data) {
        console.log(data);
        this.storageService.clean();
        this.router.navigate(["login"]);
      }
    });
  }

  openHelp() {
    let element = document.querySelectorAll(".ant-menu-item-selected");
    for (var i = 0; i < element.length; i++) {
      let htmlElement = element[i] as HTMLElement;
      htmlElement.classList.remove("ant-menu-item-selected");
      htmlElement.setAttribute("ng-reflect-nz-selected", "false");
    }
    this.router.navigate(["help"]);
  }
}
