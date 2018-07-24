import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ReportService, ProfileService, ReportSummary } from 'sunbird';

@IonicPage()
@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
})
export class TablePage {
  assessmentData;
  columns = [
    {
      name: 'Question (Marks)',
      prop: 'qtitle'
    }, {
      name: 'Time',
      prop: 'timespent'
    }, {
      name: 'Result',
      prop: 'result'
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public reportService: ReportService,
    public profileService: ProfileService,
    public loading: LoadingController,
    public zone: NgZone) {
  }

  convertTotalTime(time: number): string {
    var mm = Math.floor(time / 60);
    var ss = Math.floor(time % 60);
    return (mm > 9 ? mm : ("0" + mm)) + ":" + (ss > 9 ? ss : ("0" + ss));
  }

  ionViewWillEnter() {

    let loader = this.loading.create({
        spinner: "crescent"
    });
    loader.present();

    let that = this;

    let reportSummary: ReportSummary = this.navParams.get('report');
    
    that.reportService.getDetailReport([reportSummary.uid], reportSummary.contentId)
    .then(reportsMap => {
      let data = reportsMap.get(reportSummary.uid);
      let rows = data.reportDetailsList.map(row => {
        return {
          "qtitle": row.qtitle,
          "result": row.score + '/' + row.maxScore,
          "timespent": that.convertTotalTime(row.timespent),
          "qdesc": row.qdesc,
          "score": row.score,
          "maxScore": row.maxScore
        }
      })
      data['uiRows'] = rows;
      data['uiTotalTime'] = that.convertTotalTime(data['totalTime']);
      that.zone.run(() => {
        loader.dismiss();
        data['showResult'] = true;
        that.assessmentData = data;
      });
    })
    .catch(err => {
      console.log(err);
      loader.dismiss();
    });
    
  }

  goBack() {
    this.navCtrl.pop();
  }

}