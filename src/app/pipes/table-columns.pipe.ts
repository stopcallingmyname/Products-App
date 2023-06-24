import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tablecolumns',
})
export class TableColumnsPipe implements PipeTransform {
  transform(data: any[], columns: string[]): any[] {
    if (!data || !columns) {
      return [];
    }
    return data.map((item) => {
      const filteredItem: any = {};
      columns.forEach((column) => {
        filteredItem[column] = item[column];
      });
      return filteredItem;
    });
  }
}
