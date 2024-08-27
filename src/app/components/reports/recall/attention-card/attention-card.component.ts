import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { CarouselComponent, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-attention-card',
  templateUrl: './attention-card.component.html',
  styleUrls: ['./attention-card.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AttentionCardComponent {
  @Input() public isVideoReport?:boolean;
  @Input() public recallData?:any;
  @Input() public url?:string;

  @ViewChild('videoPlayerAttn') videoPlayerAttn!: ElementRef;
  @ViewChild('videoPlayerAttnHM') videoPlayerAttnHM!: ElementRef;

  carouselOptions: OwlOptions = {
    autoWidth: false,
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    margin : 16,
    responsive: {
      768: {
        items: 5
      }
    },
    nav: true,
    navText:['<span class="arrow-left"></span>', '<span class="arrow-right"></span>']
  };

  @ViewChild('videoCarousel', { static: true }) public videoSlides!: CarouselComponent;

  constructor(){
    this.isVideoReport = false;
    this.recallData = {};
    this.url = '';
  }

  handleVideoPlay() {
    this.videoPlayerAttnHM.nativeElement.play()
  }

  handleVideoPause() {
    this.videoPlayerAttnHM.nativeElement.pause()
  }

  handleVideoSeeked(evt: any) {
    console.log(evt);
    this.videoPlayerAttnHM.nativeElement.currentTime = evt.target.currentTime;
  }

  handleVideoSeek(time: number) {
    this.videoPlayerAttnHM.nativeElement.currentTime = time;
    this.videoPlayerAttn.nativeElement.currentTime = time;
  }
}
