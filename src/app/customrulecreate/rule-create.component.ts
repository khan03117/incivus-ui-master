import { Component, OnInit } from '@angular/core';
import { RuleService } from '../_services/rule.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Brand {
  id: string;
  title: string;
}

interface RuleObj {
  _id?: string;
  name: string;
  market: string[];
  userId: string;
  brandNames: string[];
  channels: string[];
  isDefault: boolean;
}



interface Channel {
  id: string;
  title: string;
  selected?: boolean;
}

interface Range {
  _id: string;
  name: string;
}

interface Score {
  name: string;
  from: string;
  to: string;
  condition: string;
}




interface RulesRangesDto {
  _id: string;
  rangeNames: string;
  ruleRangesScores: Score[]

}


@Component({
  selector: 'app-roule-create',
  templateUrl: './rule-create.component.html',
  styleUrls: ['./rule-create.component.less'],
})
export class RuleCreateComponent implements OnInit {
  formGroup: FormGroup;
  checkedIds: Set<string> = new Set();
  toggleCheckbox(rangeId: string, event: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.checkedIds.add(rangeId);
    } else {
      this.checkedIds.delete(rangeId);
    }
  }
  isChecked(rangeId: string): boolean {
    return this.checkedIds.has(rangeId);
  }
  getFieldValue(id: string, idx: number, key: string) {
    const arr = this.creative == "VIDEO" ? 'videoruleRangeScores' : 'ruleRangeScores'
    const index = this.rangeScores.findIndex((obj: { _id: string; }) => obj._id === id);
    return this.rangeScores[index][arr][idx][key];
  }
  scoreSaved: boolean = false;
  clientId: string = "";
  brands: Brand[] = [];
  selectedBrands: string[] = [];
  selectedChannels: string[] = [];
  ruleWeights: any = [];
  dropdownSettings = {};
  weights: any = [];
  stepOne = false;
  creative = "DISPLAY";
  saved = "";
  ruleId = "";
  ranges: any = [];
  rangeScores: any = [];
  channels: Channel[] = [];
  conditions: any = [{ title: 'more than or equal to', id: "<=" }, { title: "less than", 'id': "<" }, { title: "more than", id: ">" }];

  ruleObj: RuleObj = {
    name: '',
    userId: this.clientId,
    market: ['All'],
    brandNames: this.selectedBrands,
    channels: this.selectedChannels,
    isDefault: false,
  };

  constructor(
    private ruleService: RuleService,
    private fb: FormBuilder
  ) { }

  validateWeight(itm: any): void {
    const totalWeight = itm.scores.reduce((sum: number, score: any) => {
      return sum + (parseFloat(score.weight) || 0);
    }, 0);

    itm.invalidWeight = totalWeight !== 100;
  }
  changeSaveScore() {
    this.scoreSaved = false;
  }
  saveScores() {
    this.scoreSaved = true;
  }
  getScores(rscore: any) {
    return this.creative === 'VIDEO' ? rscore.videoruleRangeScores : rscore.ruleRangeScores;
  }

  ngOnInit() {
    let user = this.ruleService.getUser();
    this.clientId = user.client.id;
    this.ruleService.rangesScores().subscribe(
      (response: any) => {
        this.ranges = response;
        this.rangeScores = JSON.parse(JSON.stringify(response));
      },
      error => {
        console.error(error);
      }
    );
    this.channels = [
      { id: 'TIKTOK', title: 'TIKTOK' },
      { id: 'YOUTUBE', title: 'YOUTUBE' },
      { id: 'META', title: 'META' }
    ];
    this.ruleService.getBrandGuideline(this.clientId).subscribe(
      (response: any) => {
        const arr = response.client.brandDetails.map((itm: any) => {
          return {
            id: itm.masterBrand.name,
            title: itm.masterBrand.name
          }
        });
        this.brands = arr;
      }
    )
    this.ruleService.getRuleWeight().subscribe(
      (response: any) => {
        this.weights = Object.keys(response.data).map(key => (
          {
            name: key,
            scores: response.data[key]
          }
        ));

      },
      (err) => {
        console.log(err)
      }
    )
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onSubmit() {

    this.ruleObj.brandNames = this.selectedBrands;
    this.ruleObj.channels = this.selectedChannels;
    this.ruleObj.isDefault = !!this.ruleObj.isDefault;
    this.ruleObj.userId = this.clientId;
    this.ruleService.createRule(this.ruleObj).subscribe(
      response => {
        if (response._id) {
          this.ruleId = response._id;
          this.stepOne = true;
        }
      },
      error => {
        console.error('Error creating rule', error);
      }
    );
    console.log(this.rangeScores);
  }
  onRuleCreate() {
    this.ruleWeights = this.weights.flatMap((category: any) =>
      category.scores.map((score: any) => ({
        weightNames: score._id,
        weight: score.weight
      }))
    );
    const allRangeScores = this.ranges.map((rscore: any) => {
      console.log(rscore)
      if (this.checkedIds.has(rscore._id)) {
        const index = this.rangeScores.findIndex((r: { _id: any; }) => r._id == rscore._id);
        const scores = this.creative === 'VIDEO' ? 'videoruleRangeScores' : 'ruleRangeScores';
        return {
          rangeNames: rscore._id,
          ruleRangesScores: this.rangeScores[index][scores]
        };
      } else {
        // If not checked, keep the incoming ruleRangesScores
        return {
          rangeNames: rscore._id,
          ruleRangesScores: rscore.ruleRangeScores
        };
      }
    });
    const obj = {
      'ruleWeights': this.ruleWeights,
      'rulesRanges': allRangeScores,
      'creativeType': this.creative,
      'customRuleId': this.ruleId
    }
    console.log(obj)
    this.ruleService.saveRuleWeight(obj).subscribe(
      (resp: any) => {
        if (resp.code === 200) {
          this.saved = "Rule score saved successfully for " + this.creative + " creative type";
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
    console.log(obj)
  }

  handleCreative(type: string) {
    this.creative = type;
  }
}
