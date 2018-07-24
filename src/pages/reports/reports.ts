import { Component, NgZone } from '@angular/core';
//import { ReportListPage } from '../reports/report-list/report-list'
import { NavController, LoadingController } from 'ionic-angular';
import { GroupListPage } from './group-list/group-list';
import { ReportService, ProfileService, GroupService, ProfileRequest, GroupRequest } from 'sunbird';

@Component({
  selector: 'reports-page',
  templateUrl: 'reports.html'
})
export class ReportsPage {
  report: string = 'users';
  otherUsers;
  currentUser: {};
  groups;
  currentGroups: {};

  constructor(private navCtrl: NavController,
    public reportService: ReportService,
    public profileService: ProfileService,
    public groupService: GroupService,
    public ngZone: NgZone,
    public loading: LoadingController
  ) {

  }

  async populateUsers() {
    let that = this;

    return new Promise<Array<any>>((resolve, reject) => {
      let profileRequest: ProfileRequest = {
        local: true
      };
      this.profileService.getAllUserProfile(profileRequest)
      .then((data) => {
        let users = JSON.parse(data)
        
        that.profileService.getCurrentUser(data => {
          let currentUser = JSON.parse(data);
          users = that.filterOutCurrentUser(users, currentUser);
          resolve([currentUser, users]);
        }, error => {
          console.error("Error", error);
          reject(error);
        })
      })
      .catch((error) => {
        console.log("Something went wrong while fetching user list", error);
        reject(error);
      });
    });
  }

  async populateGroups() {
    let that = this;

    return new Promise<any>((resolve, reject) => {

      let groupRequest: GroupRequest = {
        uid : ""
      }

      that.groupService.getAllGroup(groupRequest)
      .then((groups) => {
        if (groups.result) {
          resolve(groups.result);
        } else {
          reject();
        }
      })
    });
  }

  ionViewWillEnter() {
    let loader = this.loading.create({
        spinner: "crescent"
    });
    loader.present();
    let users, cUser, groups;
    this.populateUsers()
    .then(array => {
      cUser = array[0];
      users = array[1];
      return this.populateGroups();
    })
    .then(data => {
      groups = data;
      this.ngZone.run(() => {
        this.groups = groups;
        this.otherUsers = users;
        this.currentUser = cUser;
        loader.dismiss();
      });
    })
    .catch(err => {
      loader.dismiss();
    });
  }

  filterOutCurrentUser(userList, currentUser) {
    return userList.filter(user => {
      return user.uid != currentUser.uid
    })
  }

  goToUserReportList(uid: string) {
    this.navCtrl.push(GroupListPage, {
      isFromUsers: true,
      uids: [uid]
    });
  }
  
  goToGroupUserReportList(uids: Array<string>) {
    this.navCtrl.push(GroupListPage, {
      isFromGroups: true,
      uids: uids
    });
  }
}
