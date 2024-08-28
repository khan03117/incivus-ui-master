import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RuleService } from 'src/app/_services/rule.service';

@Component({
  selector: 'app-rule-matrix-show',
  templateUrl: './rule-matrix-show.component.html',
  styleUrls: ['./rule-matrix-show.component.less']
})
export class RuleMatrixShowComponent {
  apiResponse: any = {};
  constructor(
    private ruleService: RuleService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.apiResponse = {
      "_id": "66c08bfb3016f7541994746b",
      "customRuleId": "66c6df601b966f67d2d9df53",
      "creativeType": "DISPLAY",
      "customRuleRangesResponse": [
        {
          "_id": "66c05f2e514ae2078ef819d2",
          "name": "Creative Effectiveness Score",
          "customRuleRangeScores": [
            {
              "name": "low",
              "from": 20,
              "to": 30,
              "condition": "<="
            },
            {
              "name": "medium",
              "from": 30,
              "to": 50,
              "condition": "<="
            },
            {
              "name": "high",
              "from": 50,
              "to": 100,
              "condition": "<="
            }
          ]
        },
        {
          "_id": "66c05f38514ae2078ef819d3",
          "name": "Recall Score",
          "customRuleRangeScores": [
            {
              "name": "low",
              "from": 0,
              "to": 30,
              "condition": "<="
            },
            {
              "name": "medium",
              "from": 30,
              "to": 50,
              "condition": "<="
            },
            {
              "name": "high",
              "from": 50,
              "to": 100,
              "condition": "<="
            }
          ]
        },
        {
          "_id": "66c05f40514ae2078ef819d4",
          "name": "Cognitive Load",
          "customRuleRangeScores": [
            {
              "name": "low",
              "from": 0,
              "to": 30,
              "condition": "<="
            },
            {
              "name": "medium",
              "from": 30,
              "to": 50,
              "condition": "<="
            },
            {
              "name": "high",
              "from": 50,
              "to": 100,
              "condition": "<="
            }
          ]
        },
        {
          "_id": "66c05f47514ae2078ef819d5",
          "name": "Ad Copy Effectiveness",
          "customRuleRangeScores": [
            {
              "name": "low",
              "from": 0,
              "to": 30,
              "condition": "<="
            },
            {
              "name": "medium",
              "from": 30,
              "to": 50,
              "condition": "<="
            },
            {
              "name": "high",
              "from": 50,
              "to": 100,
              "condition": "<="
            }
          ]
        }
      ],
      "customRuleWeightsResponse": [
        {
          "_id": "66c065f2514ae2078ef819e0",
          "name": "Recall Score",
          "weight": 30
        },
        {
          "_id": "66c065fd514ae2078ef819e1",
          "name": "Cognitive Load",
          "weight": 30
        },
        {
          "_id": "66c06608514ae2078ef819e2",
          "name": "Ad Copy Effectiveness",
          "weight": 40
        },
        {
          "_id": "66c06632514ae2078ef819e3",
          "name": "Design Complexity",
          "weight": 10
        },
        {
          "_id": "66c06647514ae2078ef819e4",
          "name": "Ad Copy Complexity",
          "weight": 90
        },
        {
          "_id": "66c0667e514ae2078ef819e5",
          "name": "Attention",
          "weight": 20
        },
        {
          "_id": "66c06685514ae2078ef819e6",
          "name": "Text Readability",
          "weight": 40
        },
        {
          "_id": "66c0668d514ae2078ef819e7",
          "name": "Persuasiveness",
          "weight": 40
        }
      ]
    }
  }


}
