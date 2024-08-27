import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RuleService } from '../_services/rule.service';



@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.less'],
  encapsulation: ViewEncapsulation.None
})

export class RulesComponent implements OnInit {
  rules: any = [];

  constructor(
    private ruleService: RuleService,
  ) { }

  ngOnInit(): void {
    this.ruleService.getAllRules().subscribe(
      (response) => {
        this.rules = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
