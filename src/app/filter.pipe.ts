import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if(!items) return [];
        if(!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter( it => {
            if(it.metadata && it.metadata.name && !it.metadata.groupName) {
                var projectName = it.metadata.title ? it.metadata.title.toLowerCase() : '';
                var videoName = it.metadata.name ? it.metadata.name.toLowerCase() : '';
                var brand = it.metadata.brand ? it.metadata.brand.toLowerCase() : "";
                var country = it.metadata.country ? it.metadata.country.toLowerCase() : "";
                var productBrand = it.metadata.productBrand ? it.metadata.productBrand.toLowerCase() : "";
                return country.indexOf(searchText) !== -1 || projectName.indexOf(searchText) !== -1 || videoName.indexOf(searchText) !== -1 || brand.indexOf(searchText) !== -1 || productBrand.indexOf(searchText) !== -1;
            } else if(it.metadata && it.metadata.name && it.metadata.groupName) {
                var projectName = it.metadata.title ? it.metadata.title.toLowerCase() : '';
                return projectName.indexOf(searchText) !== -1;
            } else if(it.companyName){
                var companyName = it.companyName ? it.companyName.toLowerCase() : '';
                return companyName.indexOf(searchText) !== -1;
            } else if(it.firstName){
                var firstName = it.firstName ? it.firstName.toLowerCase() : '';
                var lastName = it.lastName ? it.lastName.toLowerCase() : '';
                return firstName.indexOf(searchText) !== -1 || lastName.indexOf(searchText) !== -1;
            } else if(it.key) {
                var key = it.key ? it.key.toLowerCase() : '';
                return  key.indexOf(searchText) !== -1;
            } else if(it.title) {
                var title = it.title ? it.title.toLowerCase() : '';
                return  title.indexOf(searchText) !== -1;
            } else if(it.metadata && it.metadata.title) {
                var title = it.metadata.title ? it.metadata.title.toLowerCase() : '';
                return  title.indexOf(searchText) !== -1;
            } else if( typeof it === "string") {
                return it.toLowerCase().indexOf(searchText) !== -1;
            } else {
                return '';
            }
        });
    }
}
