import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RuleService } from 'src/app/_services/rule.service';

@Component({
  selector: 'app-rule-matrix-show',
  templateUrl: './rule-matrix-show.component.html',
  styleUrls: ['./rule-matrix-show.component.less']
})
export class RuleMatrixShowComponent implements OnInit {
  ruleId: string | null = null;
  creativeType: string | null = 'DISPLAY';
  apiResponse: any = [];
  customRuleWeightsResponse: any = {};

  constructor(
    private ruleService: RuleService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Subscribe to route parameter changes
    this.route.paramMap.subscribe(params => {
      this.ruleId = params.get('ruleId');
      this.creativeType = params.get('creativeType');
      console.log('Updated ruleId:', this.ruleId);
      console.log('Updated creativeType:', this.creativeType);

      // Make sure to call the API only if both parameters are available
      if (this.ruleId && this.creativeType) {
        this.fetchRuleData(this.ruleId, this.creativeType);
      }
    });
  }

  fetchRuleData(ruleId: string, creativeType: string) {
    this.ruleService.showRule(ruleId, creativeType).subscribe(
      (data: any) => {
        this.apiResponse = data.data;
        this.customRuleWeightsResponse = Object.entries(data.customRuleWeightsResponse).map(([key, value]) => {
          return {
            name: key,
            scores: value
          };
        });
      },
      (error) => {
        console.error('Error fetching rule data:', error);
      }
    );
  }
}
