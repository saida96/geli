import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CourseDetailComponent} from './course-detail.component';
import {CourseOverviewComponent} from './course-overview/course-overview.component';
import {FileViewComponent} from './file-view/file-view.component';
import {DownloadCourseDialogComponent} from './download-course-dialog/download-course-dialog.component';
import {UploadUnitCheckboxComponent} from './download-course-dialog/downloadCheckBoxes/upload-unit-checkbox.component';
import {LectureCheckboxComponent} from './download-course-dialog/downloadCheckBoxes/lecture-checkbox.component';
import {UnitCheckboxComponent} from './download-course-dialog/downloadCheckBoxes/unit-checkbox.component';
import {CourseDetailRoutingModule} from './course-detail-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {LectureModule} from '../../lecture/lecture.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CourseDetailRoutingModule,
    LectureModule,
    FormsModule,
  ],
  declarations: [
    CourseDetailComponent,
    CourseOverviewComponent,
    FileViewComponent,
    DownloadCourseDialogComponent,
    LectureCheckboxComponent,
    UnitCheckboxComponent,
    UploadUnitCheckboxComponent,
  ],
  entryComponents: [
    DownloadCourseDialogComponent,
  ],
  exports: [
    CourseDetailComponent,
    DownloadCourseDialogComponent,
    LectureCheckboxComponent,
    UnitCheckboxComponent,
  ]
})
export class CourseDetailModule {
}
