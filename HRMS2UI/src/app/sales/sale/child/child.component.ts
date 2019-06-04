import { Component, OnInit } from '@angular/core';

import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

export interface myinterface {
    remove(index: number);
}

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent {

  items : Object[];
  public index: number;
  public selfRef: ChildComponent;

  //interface for Parent-Child interaction
  public compInteraction: myinterface;

  constructor(
              private service: DataService) {
  }
	ngOnInit() {
      this.service.getAll('/course').subscribe(data => {
      this.items = data.items;
    });
  }
  removeMe(index) {
    this.compInteraction.remove(index)
  }

}