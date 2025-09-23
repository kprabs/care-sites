import { Component } from '@angular/core';
import { TilesComponent } from './tiles/tiles.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TilesComponent],
  template: `<app-tiles></app-tiles>`
})
export class AppComponent {}
