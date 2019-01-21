import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExpansionPanelsModule } from 'ng2-expansion-panels';
import { ProfilePage } from './profile';
import { GuestProfilePage } from './guest-profile/guest-profile';
import { GuestEditProfilePage } from './guest-edit.profile/guest-edit.profile';
import { OverflowMenuComponent } from './overflowmenu/menu.overflow.component';
import { ContainerService } from 'sunbird';
import { SettingsPageModule } from '../settings/settings.module';
import { UserSearchComponent } from './user-search/user-search';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../../component/components.module';
import { IonicImageLoader } from 'ionic-image-loader';
import { ImagePicker } from './imagepicker/imagepicker';
import { CategoriesEditPageModule } from '../categories-edit/categories-edit.module';

@NgModule({
  declarations: [
    ProfilePage,
    GuestProfilePage,
    GuestEditProfilePage,
    OverflowMenuComponent,
    UserSearchComponent,
    ImagePicker
  ],
  entryComponents: [
    ProfilePage,
    GuestProfilePage,
    GuestEditProfilePage,
    OverflowMenuComponent,
    ImagePicker,
    UserSearchComponent
  ],

  imports: [
    IonicPageModule.forChild(ProfilePage),
    SuperTabsModule.forRoot(),
    SettingsPageModule,
    TranslateModule.forChild(),
    IonicImageLoader,
    TagInputModule,
    BrowserAnimationsModule,
    ExpansionPanelsModule,
    DirectivesModule,
    ComponentsModule,
    CategoriesEditPageModule
  ],
  exports: [
    ProfilePage,
    GuestProfilePage,
    GuestEditProfilePage
  ],
  providers: [
    ContainerService,
    DatePipe
  ]
})
export class ProfilePageModule { }
