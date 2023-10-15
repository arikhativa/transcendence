import { Component, OnInit  } from '@angular/core';
import { ItemService } from './item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
	
	items : any = ["a", "b", "c"];

	constructor(private service : ItemService) { 
	}
	ngOnInit(): void {
		this.service.getItems().subscribe(
		  (data : any) => {
			this.items[0] = data[0].name;

		  },
		  (error) => {
			console.error(error);
		  }
		);
	  }
}
