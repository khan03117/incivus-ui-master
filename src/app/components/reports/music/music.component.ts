import { Component, ViewEncapsulation, Input } from '@angular/core';
import { STROKE_COLOR } from '../constants/report-constants';
// import WaveSurfer from 'wavesurfer.js';
// import Regions from 'wavesurfer.js/dist/plugins/regions.esm.js';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class MusicComponent {
  @Input() public data:any;
  score:number = 55;
  scoreClass = STROKE_COLOR.LOW;
  showMood: boolean = false;
  showGenre: boolean = true;
  showEmotion: boolean = false;
  finalGenre: any = {};
  genreKeys: any = [];
  finalMoodList: any = [];
  moodKeys: any = [];
  finalInstrumentList: any = {};
  instrumentKeys: any = [];
  musicTime: any = [];
  runTimeSec: number = 0;
  instrumentData: any = [];
  genreData: any = [];
  moodData: any = [];
  emotionsData: any = [];
  musicElements: any;
  isLoading: boolean = true;
  moodColor: any = ['#366A21', '#FBD50D', '#FF8F2D', '#00549A', '#39B3EA'];
  genreColor: any = ['#00549A', '#637434', '#39B3EA', '#366A21', '#FBD50D'];
  instrumentColor: any = ['#FFE140', '#4DC1A4', '#E6B56B', '#366A21', '#FBD50D']

  constructor(
    // private wavesurfer: WaveSurfer
  ){}
  
  ngOnInit(){
      this.scoreClass = (this.score < 46) ? STROKE_COLOR.LOW : (this.score < 71) ? STROKE_COLOR.MEDIUM : STROKE_COLOR.HIGH;
      console.log(this.data);
      this.runTimeSec = this.data.runTime;
      if( this.data.data.music) {
        this.formatMusicData(this.data.data.music);
      }
  }

  switchBtnClick = (type:string) => {
    switch(type){
      case "mood":
        this.showMood = true;
        this.showGenre = false;
        this.showEmotion = false;
        break;
      case "emotion":
        this.showMood = false;
        this.showGenre = false;
        this.showEmotion = true;
        break;
      default:
        this.showMood = false;
        this.showGenre = true;
        this.showEmotion = false;
    }
  }

  converObjectToArray(object: any) {
    let objArray = [];
    for (var i in object) {
      objArray.push({ 'key': i, 'value': object[i] });
    }

    return this.sortJSON(objArray, 'value', '321');

  }

  sortJSON(arr: any, key: any, way: any) {
    return arr.sort((a: any, b: any) => {
      var x = a[key]; var y = b[key];
      if (way === '123') { 
        return ((x < y) ? -1 : ((x > y) ? 1 : 0)); 
      } else { 
        return ((x > y) ? -1 : ((x < y) ? 1 : 0)); 
      }
    });
  }

  formatMusicData(musicData: any) {
    // this.genreData
    let time = [];
    let genreData = [];
    let moodData = [];
    let instrumentData = [];

    if (musicData && musicData.segmentList) {

      if (musicData.topGenres) {
        let finalGenreTemp = this.converObjectToArray(musicData.topGenres);
        this.finalGenre = finalGenreTemp.slice(0, 4);
        this.genreKeys = this.finalGenre.map((genre: any) => { return genre.key; });
      }

      if (musicData.topMoods) {
        let finalMoodListTemp = this.converObjectToArray(musicData.topMoods);
        this.finalMoodList = finalMoodListTemp.slice(0, 4);
        this.moodKeys = this.finalMoodList.map((mood:any) => { return mood.key; });
      }

      if (musicData.instrumentPresence) {
        let finalInstrumentListTemp = this.converObjectToArray(musicData.instrumentPresence);
        this.finalInstrumentList = finalInstrumentListTemp.slice(0, 4);
        this.instrumentKeys = this.finalInstrumentList.map((instrument: any) => { return instrument.key; })
      }
      
      let self = this;
      let segmentListCount = musicData.segmentList.length;
      let parentIndex = 0;
      let difference = 0;
      let endSegment = 0;
      musicData.segmentList.forEach((segment: any, index: number) => {
        parentIndex = index;
        if (index === 0) {
          self.musicTime.push(segment.start);
          self.musicTime.push(segment.end);
          difference = segment.end - segment.start;
        } else {
          self.musicTime.push(segment.end);
        }
        if ((segmentListCount - 1) === index) {
          if (segment.end < self.runTimeSec) {
            if (segment.end + difference >= self.runTimeSec) {
              self.musicTime.push(self.runTimeSec);
            } else {
              let remaining = self.runTimeSec - segment.end;
              let remPart = Math.ceil(remaining / difference);
              let newEnd = segment.end;
              for (let i = 1; i <= remPart; i++) {
                newEnd = newEnd + difference;
                if (newEnd > self.runTimeSec) {
                  self.musicTime.push(self.runTimeSec);
                } else {
                  self.musicTime.push(newEnd);
                }
              }
            }
          }
        }
        if (segment.instrumentDetails && self.instrumentKeys.length > 0) {
          self.instrumentKeys.forEach((instrumentKey: any, index: number) => {
            if (!self.instrumentData[index]) {
              self.instrumentData[index] = [];
            }
            if (parentIndex === 0) {
              self.instrumentData[index].push((segment.instrumentDetails[instrumentKey]).toFixed(2));
              self.instrumentData[index].push((segment.instrumentDetails[instrumentKey]).toFixed(2));
            } else {
              self.instrumentData[index].push((segment.instrumentDetails[instrumentKey]).toFixed(2));
            }
            if ((segmentListCount - 1) === parentIndex) {
              let deltaIndex = self.musicTime.length - self.instrumentData[index].length;
              if (deltaIndex >= 1) {
                for (let i = 1; i <= deltaIndex; i++) {
                  self.instrumentData[index].push((segment.instrumentDetails[instrumentKey]).toFixed(2));
                }
              }
            }
          });
        }
        if (segment.genreDetails && self.genreKeys.length > 0) {
          self.genreKeys.forEach((genreKey: any, index: number) => {
            if (!self.genreData[index]) {
              self.genreData[index] = [];
            }
            if (parentIndex === 0) {
              self.genreData[index].push((segment.genreDetails[genreKey]).toFixed(2));
              self.genreData[index].push((segment.genreDetails[genreKey]).toFixed(2));
            } else {
              self.genreData[index].push((segment.genreDetails[genreKey]).toFixed(2));
            }
            if ((segmentListCount - 1) === parentIndex) {
              let deltaIndex = self.musicTime.length - self.genreData[index].length;
              if (deltaIndex >= 1) {
                for (let i = 1; i <= deltaIndex; i++) {
                  self.genreData[index].push((segment.genreDetails[genreKey]).toFixed(2));
                }
              }
            }
          });
        }
        if (segment.moodDetails && Object.keys(segment.moodDetails).length > 0 && self.moodKeys.length > 0) {
          self.moodKeys.forEach((moodKey: any, index: number) => {
            if (!self.moodData[index]) {
              self.moodData[index] = [];
            }
            if (parentIndex === 0) {
              self.moodData[index].push((segment.moodDetails[moodKey]).toFixed(2));
              self.moodData[index].push((segment.moodDetails[moodKey]).toFixed(2));
            } else {
              self.moodData[index].push((segment.moodDetails[moodKey]).toFixed(2));
            }
            if ((segmentListCount - 1) === parentIndex) {
              let deltaIndex = self.musicTime.length - self.moodData[index].length;
              if (deltaIndex >= 1) {
                for (let i = 1; i <= deltaIndex; i++) {
                  self.moodData[index].push((segment.moodDetails[moodKey]).toFixed(2));
                }
              }
            }
          });
        }
        if (segment.arousal) {
          if (!self.emotionsData[0]) { self.emotionsData[0] = [] }
          if (parentIndex === 0) {
            self.emotionsData[0].push(segment.arousal.toFixed(2));
            self.emotionsData[0].push(segment.arousal.toFixed(2));
          } else {
            self.emotionsData[0].push(segment.arousal.toFixed(2));
          }
          if ((segmentListCount - 1) === parentIndex) {
            let deltaIndex = self.musicTime.length - self.emotionsData[0].length;
            if (deltaIndex >= 1) {
              for (let i = 1; i <= deltaIndex; i++) {
                self.emotionsData[0].push(segment.arousal.toFixed(2));
              }
            }
          }
        }
        if (segment.valence) {
          if (!self.emotionsData[1]) { self.emotionsData[1] = [] }
          if (parentIndex === 0) {
            self.emotionsData[1].push(segment.valence.toFixed(2));
            self.emotionsData[1].push(segment.valence.toFixed(2));
          } else {
            self.emotionsData[1].push(segment.valence.toFixed(2));
          }
          if ((segmentListCount - 1) === parentIndex) {
            let deltaIndex = self.musicTime.length - self.emotionsData[1].length;
            if (deltaIndex >= 1) {
              for (let i = 1; i <= deltaIndex; i++) {
                self.emotionsData[1].push(segment.valence.toFixed(2));
              }
            }
          }
        }

      });

      this.musicElements = musicData;
      this.isLoading = false;
      // this.loadAudio();

    }

  }

  getChartData(type: string): any {
    let self = this;
    if (type === 'genre') {
      return {
        time: this.musicTime,
        data: this.genreData,
        keys: this.genreKeys,
        chartType: 'line',
        colors: this.genreColor
      };
    } else if (type === 'mood') {
      return {
        time: this.musicTime,
        data: this.moodData,
        keys: this.moodKeys,
        chartType: 'line',
        colors: this.moodColor
      };
    } else if (type === 'instruments') {
      return {
        time: this.musicTime,
        data: this.instrumentData,
        keys: this.instrumentKeys,
        chartType: 'line',
        colors: this.instrumentColor
      };
    } else if (type === 'emotion') {
      return {
        time: this.musicTime,
        data: this.emotionsData,
        keys: ['arousal', 'valence'],
        chartType: 'area',
        colors: ['#FFAE5B', '#5D6D60']
      };
    } else if (type === 'radar') {
      return {
        time: this.getMoodsRadarData(),
        data: Object.keys(this.musicElements.allMoods).map(function (key, index) { return self.musicElements.allMoods[key].toFixed(2) }),
        chartType: 'radar',
        colors: ['#FF972E']
      };
    }

  }

  //Object.keys(this.musicElements.allMoods).map(function(key, index) { return key+": "+self.musicElements.allMoods[key].toFixed(2)}) 

  getMoodsRadarData() {
    let allMoodsKey = Object.keys(this.musicElements.allMoods);
    let moodsTime: any = [];
    allMoodsKey.forEach((moodKey, index) => {
      moodsTime.push([moodKey, this.musicElements.allMoods[moodKey].toFixed(2)]);
    });
    return moodsTime;

  }

  getColor(index: number, type: string) {
    if (type === 'genre') {
      return this.genreColor[index];
    } else if (type === 'mood') {
      return this.moodColor[index];
    }
  }

  getMoodClass(key: any) {
    let index = this.moodKeys.indexOf(key);
    if (index >= 0) {
      return this.moodColor[index];
    } else {
      return '#E9E9E9';
    }
  }

  getGenreClass(key: string) {
    let index = this.genreKeys.indexOf(key);
    if (index >= 0) {
      return this.genreColor[index];
    } else {
      return '#E9E9E9';
    }
  }

  // loadAudio() {
  //   let self = this;
  //   setTimeout(function () {
  //     self.wavesurfer = WaveSurfer.create({
  //       container: '#waveform',
  //       waveColor: '#4B4B4BD6',
  //       progressColor: '#000',
  //       plugins: [
  //         Timeline.create({
  //           container: "#wave-timeline"
  //         }),
  //         Region.create({
  //           regionsMinLength: 2,
  //           regions: [{
  //             start: self.musicElements.mostRepresentativeSegment.startTime,
  //             end: self.musicElements.mostRepresentativeSegment.endTime,
  //             loop: true,
  //             color: 'hsla(200, 50%, 70%, 0.4)',
  //             drag: false
  //           }]
  //         })
  //       ]
  //     });
  //     self.wavesurfer.on('ready', function () {
  //       document.getElementById('playBtn').style.display = 'block';
  //       document.getElementById('pauseBtn').style.display = 'none';
  //     });
  //     self.wavesurfer.load(self.musicElements.audioFileUrl);
  //   }, 500);
  // }

  // playAudio() {
  //   this.wavesurfer.play();
  //   document.getElementById('playBtn').style.display = 'none';
  //   document.getElementById('pauseBtn').style.display = 'block';
  // }

  // pauseAudio() {
  //   this.wavesurfer.pause();
  //   document.getElementById('playBtn').style.display = 'block';
  //   document.getElementById('pauseBtn').style.display = 'none';
  // }
  
}
