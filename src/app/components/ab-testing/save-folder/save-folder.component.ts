import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-save-folder',
  templateUrl: './save-folder.component.html',
  styleUrls: ['./save-folder.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SaveFolderComponent {
  saveFolderForm = new FormGroup({  
    folderName: new FormControl(''),
    reportName: new FormControl('')
  });
  cancel(){
    console.log('Close modal');
  }
  createFolder(){
    console.log('Create folder action');
  }
}
