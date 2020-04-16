import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationModule } from '@ngui/application';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReplayUploadModule } from './common/replay-upload/replay-upload.module';
import { AttachmentsService } from '@ngui/ui-attachments';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApplicationModule,
    BrowserAnimationsModule,
    ReplayUploadModule
  ],
  providers: [AttachmentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
