import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreateFolderComponent {
  folderList:string[] = ['Folder A', 'Folder B', 'Folder C', 'Folder D'];
  createFolderForm = new FormGroup({  
    folderName: new FormControl(''),
    selectedFolder: new FormControl('')
  });
  cancel(){
    console.log('Close modal');
  }
  createFolder(){
    console.log('Create folder action');
  }
}
