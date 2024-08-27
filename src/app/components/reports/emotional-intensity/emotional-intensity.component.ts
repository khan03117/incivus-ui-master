import { Component, ViewEncapsulation, Input } from '@angular/core';
import { MusicComponent } from '../music/music.component';
import { ColorComponent } from './color/color.component';
import { Options } from 'ngx-slider-v2';

@Component({
  selector: "app-emotional-intensity",
  templateUrl: "./emotional-intensity.component.html",
  styleUrls: ["./emotional-intensity.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class EmotionalIntensityComponent {
  @Input() public data?: any;
  modalData: any = "";
  isLoading: boolean = true;
  panels = [
    {
      name: "Music emotion:",
      subTitle: "Energetic",
      disabled: false,
      isExpanded: false,
      isValid: false,
      componentName: MusicComponent,
      data: null,
    },
    {
      name: "Human facial emotion:",
      subTitle: "Happy, Anger, Neutral",
      disabled: true,
      isExpanded: false,
      isValid: false,
      data: null,
    },
    {
      name: "Color emotion:",
      subTitle: "Reliability, Elegance, Glamorous",
      disabled: false,
      isExpanded: false,
      isValid: false,
      componentName: ColorComponent,
      data: null,
    },
    {
      name: "Ad copy emotion:",
      subTitle: "Positive",
      disabled: true,
      isExpanded: false,
      isValid: false,
      componentName: null,
      data: null,
    },
  ];

  tickLegendValues: any = {
    "10": "Mild",
    "30": "Mild",
    "50": "Moderate",
    "70": "Strong",
    "90": "Strongest",
  };

  value: number = 5;
  options: Options = {
    floor: 0,
    ceil: 100,
    step: 0.1,
    vertical: true,
    ticksArray: [10, 30, 50, 70, 90],
    showSelectionBar: false,
    getLegend: (value: number): string => {
      return `${this.tickLegendValues[value]}`;
    },
  };

  constructor() {
    this.data = "";
  }

  ngOnInit() {
    if (this.data) {
      let musicData = this.data.data.music;
      if (musicData) {
        let topMoods = Object.keys(musicData.topMoods);
        this.panels[0].subTitle =
          topMoods.length > 0 ? topMoods.join(", ") : "NA";
        this.panels[0].data = this.data;
      } else {
        this.panels[0].subTitle = "NA";
        this.panels[0].data = this.data;
        this.panels[0].disabled = true;
      }
      let humanEmotion = this.data.data.humanEmotions;
      humanEmotion =
        humanEmotion && humanEmotion.length > 0 ? humanEmotion.slice(0, 3) : [];
      this.panels[1].subTitle =
        humanEmotion.length > 0 ? humanEmotion.join(", ") : "NA";
      let colorEmotion = this.data.data.colorEmotion;
      colorEmotion =
        colorEmotion && colorEmotion.length > 0 ? colorEmotion : "NA";
      this.panels[2].subTitle = colorEmotion;
      if (
        this.data.data.colorAppearances &&
        this.data.data.colorAppearances.length > 0
      ) {
        this.panels[2].data = this.data.data.colorAppearances;
      } else {
        this.panels[2].disabled = true;
      }
      let adCopyEmotion = this.data.data.adCopyEmotion;
      adCopyEmotion =
        adCopyEmotion && adCopyEmotion.length > 0 ? adCopyEmotion : "NA";
      this.panels[3].subTitle = adCopyEmotion;
      this.isLoading = false;
    }
  }
}
