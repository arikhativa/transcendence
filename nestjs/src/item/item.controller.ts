import { Controller, Get } from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from '@prisma/client';

@Controller('items')
export class ItemController {
	constructor(
		private itemService: ItemService,
	) {}
	@Get()
	getAll(): Promise<Item[]> {
		return this.itemService.getAll();
	}
}
