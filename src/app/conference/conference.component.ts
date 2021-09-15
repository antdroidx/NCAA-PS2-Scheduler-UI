import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { EventEmitter } from 'stream';
import { Conference } from '../conference';
import { ConferenceService } from '../conference.service';
import { ScheduleService } from '../schedule.service';
import { School } from '../school';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.css']
})
export class ConferenceComponent implements OnInit {

  // selectedState: any = [
  //   {'code': 'ND', 'users': 324, 'org type' :'Service Provider'}, 
  //   {'code': 'WA', 'users': 454, 'org type' :'Manufacturer'}, 
  //   {'code':'AZ', 'users': 234, 'org type' :'Service Provider'}, 
  //   {'code' : 'AK', 'users': 544, 'org type' :'Manufacturer'},
  //   {'code' : 'CT', 'users': 544, 'org type' :'Manufacturer'},
  //   {'code' : 'DC', 'users': 544, 'org type' :'Manufacturer'},
  // ];

  selectedStates?: Array<string>;

  @Input() conference!: Conference;
  @Output() updated = new EventEmitter<boolean>();

  confSchools: School[] = [];
  divSchools: School[][] = [];

  constructor(private scheduleService: ScheduleService, public conferenceService: ConferenceService) { }

  panelOpenState = false;

  ngOnInit(): void {
    this.loadSchools();
  }

  setStates(schools: School[]): void {
    schools.forEach(school => {
      //add check if school already exists?
      this.selectedStates!.push(school.state);
    });
  }

  loadSchools(): void {
    this.selectedStates = [];
    if (this.conference.divisions !== null) {
      this.getSchoolsByDivision();
    }
    else {
      this.getSchoolsByConference();
    }
  }

  getSchoolsByConference(): void {
    this.scheduleService.getSchoolsByConference(this.conference.name).subscribe((data: School[]) => {
      console.log(data);
      this.confSchools = data;
      this.setStates(this.confSchools);
    });
  }

  getSchoolsByDivision(): void {
    this.conferenceService.getSchoolsByDivision(this.conference.name, this.conference.divisions[0]).subscribe((data: School[]) => {
      console.log(data);
      this.divSchools[0] = data;
      this.setStates(this.divSchools[0]);
    });
    this.conferenceService.getSchoolsByDivision(this.conference.name, this.conference.divisions[1]).subscribe((data: School[]) => {
      console.log(data);
      this.divSchools[1] = data;
      this.setStates(this.divSchools[1]);
    });
  }

  onClick(selectedSchool: School): void {
    if (this.conferenceService.getSelectedSchool() !== undefined) {
      if (this.conferenceService.getSelectedSchool() === selectedSchool) {
        this.conferenceService.setSelectedSchool(undefined);
      } else if (this.conferenceService.getSelectedSchool()?.conference.name === selectedSchool.conference.name && this.conferenceService.getSelectedSchool()?.division === selectedSchool.division) {
        this.conferenceService.setSelectedSchool(selectedSchool);
      }
      else {
        this.swap(selectedSchool)
      }
    } else {
      this.conferenceService.setSelectedSchool(selectedSchool);
    }
  }

  swap(selectedSchool: School): void {
    let tempConf: Conference;
    let tempDiv: string;
    let tempNcaaDiv: string;

    tempConf = selectedSchool.conference;
    tempDiv = selectedSchool.division;
    tempNcaaDiv = selectedSchool.ncaaDivision;

    selectedSchool.conference = this.conferenceService.getSelectedSchool()!.conference;
    selectedSchool.division = this.conferenceService.getSelectedSchool()!.division;
    selectedSchool.ncaaDivision = this.conferenceService.getSelectedSchool()!.ncaaDivision;

    this.conferenceService.getSelectedSchool()!.conference = tempConf;
    this.conferenceService.getSelectedSchool()!.division = tempDiv;
    this.conferenceService.getSelectedSchool()!.ncaaDivision = tempNcaaDiv;

    this.conferenceService.swapSchools(this.conferenceService.getSelectedSchool()!.tgid, selectedSchool.tgid).subscribe((data: any) => {
      console.log(data);
      this.updated.emit(true);
      this.conferenceService.setSelectedSchool(undefined);
      //this.loadSchools();
    })
  }

  getContrast: any = function (hexcolor: string) {
    if (hexcolor === '') {
      return 'black';
    }
    // If a leading # is provided, remove it
    if (hexcolor.slice(0, 1) === '#') {
      hexcolor = hexcolor.slice(1);
    }

    // If a three-character hexcode, make six-character
    if (hexcolor.length === 3) {
      hexcolor = hexcolor.split('').map(function (hex) {
        return hex + hex;
      }).join('');
    }

    // Convert to RGB value
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);

    // Get YIQ ratio
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Check contrast
    return (yiq >= 128) ? 'black' : 'white';

  };


}
