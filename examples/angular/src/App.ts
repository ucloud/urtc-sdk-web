import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { RoomComponent } from './pages/room';
import { StreamInfoComponent } from './components/stream-info';

@Component({
  selector: 'app-root',
  template: `
    <div class="App">
      <app-room-page></app-room-page>
      <br />
      <a href="https://github.com/ucloud/urtc-sdk-web" target="_blank" rel="noopener noreferrer">
        API 文档请看这里
      </a>
    </div>
  `,
  styleUrls: ['./App.css']
})
class AppComponent {}

@NgModule({
  declarations: [
    StreamInfoComponent,
    RoomComponent,
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
