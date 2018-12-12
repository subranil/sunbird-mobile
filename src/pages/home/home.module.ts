import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { AnnouncementListComponent } from './announcement-list/announcement-list';
import { AnnouncementDetailComponent } from './announcement-detail/announcement-detail';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { GenieSDKServiceProvider } from 'sunbird';
import { FrameworkModule } from 'sunbird';
import { IonicImageLoader } from 'ionic-image-loader';
import { ComponentsModule } from '../../component/components.module';
import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [
    HomePage,
    AnnouncementListComponent,
    AnnouncementDetailComponent
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    TranslateModule.forChild(),
    HttpClientModule,
    ComponentsModule,
    FrameworkModule,
    IonicImageLoader
  ],
  providers: [
    HttpClient,
    GenieSDKServiceProvider,
    SocialSharing
  ],
  exports: [
    HomePage
  ],
  entryComponents: [
    AnnouncementListComponent,
    AnnouncementDetailComponent
  ]
})
export class HomePageModule {

}
