import { boardList } from './../../../config/framework.filters';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { FrameworkDetailsRequest, CategoryRequest, FrameworkService, ProfileService, Profile, FormService, SharedPreferences } from 'sunbird';
import { FormRequest } from 'sunbird/services/form/bean';
import { resolve } from 'path';
import { FormAndFrameworkUtilService } from '../formandframeworkutil.service';

/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@Component({
  selector: 'page-guest-edit.profile',
  templateUrl: 'guest-edit.profile.html'
})

export class GuestEditProfilePage {

  tabBarElement: any;
  guestEditForm: FormGroup;
  profile: any = {};
  categories: Array<any> = [];
  syllabusList: Array<any> = []
  boardList: Array<any> = [];
  gradeList: Array<string> = [];
  subjectList: Array<string> = [];
  mediumList: Array<string> = [];
  userName: string = '';
  selectedLanguage: string;
  frameworks: Array<any> = [];
  frameworkId: string = '';

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(private navCtrl: NavController,
    private fb: FormBuilder,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private frameworkService: FrameworkService,
    private profileService: ProfileService,
    private translate: TranslateService,
    private events: Events,
    private formService: FormService,
    private preference: SharedPreferences,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService
  ) {
    this.profile = this.navParams.get('profile');

    /* Initialize form with default values */
    this.guestEditForm = this.fb.group({
      syllabus: [this.profile.syllabus && this.profile.syllabus[0] || [], Validators.required],
      name: [this.profile.handle || '', Validators.required],
      boards: [this.profile.board || [], Validators.required],
      grades: [this.profile.grade || []],
      subjects: [this.profile.subject || []],
      medium: [this.profile.medium || []]
    });


    //language code
    this.preference.getString('selected_language_code', (val: string) => {
      if (val && val.length) {
        this.selectedLanguage = val;
      }
    });
  }

  ionViewWillEnter() {
    this.getSyllabusDetails();
  }


  getSyllabusDetails() {
    let loader = this.getLoader();
    loader.present();

    this.formAndFrameworkUtilService.getSyllabusList()
      .then((result) => {
        if (result && result !== undefined && result.length > 0) {
          result.forEach(element => {
            //renaming the fields to text, value and checked
            let value = { 'name': element.name, 'code': element.frameworkId };
            this.syllabusList.push(value);
          });

          loader.dismiss();
          if (this.profile && this.profile.syllabus && this.profile.syllabus[0] !== undefined) {
            this.formAndFrameworkUtilService.getFrameworkDetails(this.profile.syllabus[0])
              .then(catagories => {
                this.categories = catagories;

                this.resetForm(0);
                this.guestEditForm.patchValue({
                  boards: this.profile.board || []
                });

                this.resetForm(1);
                this.guestEditForm.patchValue({
                  medium: this.profile.medium || []
                });

                this.resetForm(2);
                this.guestEditForm.patchValue({
                  grades: this.profile.grade || []
                });

                this.resetForm(3);
                this.guestEditForm.patchValue({
                  subjects: this.profile.subject || []
                });

              });
          }
        } else {
          loader.dismiss();

          this.getToast(this.translateMessage('NO_DATA_FOUND')).present();
        }
      });

  }

  /**
   * This will internally call framework API
   * @param {string} currentCategory - request Parameter passing to the framework API
   * @param {string} list - Local variable name to hold the list data
   */
  getCategoryData(req: CategoryRequest, list): void {

    this.formAndFrameworkUtilService.getCategoryData(req, this.frameworkId).
      then((result) => {
        this[list] = result;
        if (list != 'gradeList') {
          this[list] = _.orderBy(this[list], ['name'], ['asc']);
        }
        console.log(list + " Category Response: " + this[list]);
      })
  }

  checkPrevValue(index = 0, currentField, prevSelectedValue = [], ) {

    if (index === 0) {
      this[currentField] = this.syllabusList;
    } else if (index === 1) {
      this.frameworkId =  prevSelectedValue[0];
      this.formAndFrameworkUtilService.getFrameworkDetails(this.frameworkId)
        .then(catagories => {
          this.categories = catagories;

          let request: CategoryRequest = {
            currentCategory: this.categories[0].code,
          }
          this.getCategoryData(request, currentField);
        });

    } else {
      let request: CategoryRequest = {
        currentCategory: this.categories[index - 1].code,
        prevCategory: this.categories[index - 2].code,
        selectedCode: prevSelectedValue
      }
      this.getCategoryData(request, currentField);
    }

  }

  resetForm(index: number = 0): void {
    console.log("Reset Form Index - " + index);
    switch (index) {
      case 0:
        this.guestEditForm.patchValue({
          boards: [],
          grades: [],
          subjects: [],
          medium: []
        });
        this.checkPrevValue(1, 'boardList', [this.guestEditForm.value.syllabus]);
        break;

      case 1:
        this.guestEditForm.patchValue({
          grades: [],
          subjects: [],
          medium: []
        });
        this.checkPrevValue(2, 'mediumList', this.guestEditForm.value.boards);
        break;

      case 2:
        this.guestEditForm.patchValue({
          subjects: [],
          grades: [],
        });
        this.checkPrevValue(3, 'gradeList', this.guestEditForm.value.medium);
        break;
      case 3:
        this.guestEditForm.patchValue({
          subjects: [],
        });
        this.checkPrevValue(4, 'subjectList', this.guestEditForm.value.grades);
        break;
    }
  }

  /**
   * Call on Submit the form
   */
  onSubmit(): void {
    let loader = this.getLoader();
    loader.present();
    let formVal = this.guestEditForm.value;
    let req: Profile = {
      age: -1,
      day: -1,
      month: -1,
      standard: -1,
      board: formVal.boards,
      grade: formVal.grades,
      subject: formVal.subjects,
      medium: formVal.medium,
      uid: this.profile.uid,
      handle: formVal.name,
      isGroupUser: false,
      language: "en",
      avatar: "avatar",
      profileType: this.profile.profileType,
      createdAt: this.profile.createdAt,
      syllabus: [formVal.syllabus]
    }

    this.profileService.updateProfile(req,
      (res: any) => {
        console.log("Update Response", res);

        // Publish event if the all the fields are submitted
        if (formVal.syllabus.length && formVal.boards.length && formVal.grades.length && formVal.medium.length && formVal.subjects.length) {
          this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: true });
        } else {
          this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: false });
        }
        this.events.publish('refresh:profile');
        this.events.publish('refresh:onboardingcard');

        loader.dismiss();
        this.getToast(this.translateMessage('PROFILE_UPDATE_SUCCESS')).present();
        this.navCtrl.pop();
      },
      (err: any) => {
        loader.dismiss();
        this.getToast(this.translateMessage('PROFILE_UPDATE_FAILED')).present();
        console.log("Err", err);
      });
  }

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @returns {string} translatedMsg - Translated Message
   */
  translateMessage(messageConst: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }

  /** It will returns Toast Object
   * @param {message} string - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }
}