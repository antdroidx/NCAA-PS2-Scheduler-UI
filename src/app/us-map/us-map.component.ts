import { Component, OnInit, SimpleChanges, OnChanges, Input } from '@angular/core';
import { MapStates } from './map.service';
@Component({
  selector: 'app-us-map',
  templateUrl: './us-map.component.html',
  styleUrls: ['./us-map.component.css']
})
export class UsMapComponent implements OnChanges, OnInit { 
  @Input()
  states!: Array<string>;
  @Input()
  enableTooltip?: boolean;
  @Input()
  toolTipObject: any;
  @Input()
  colors:any = {
    unfill: '#b6b6b6',
    fill: '#518a38'
  }
  // showToolTip: boolean;
  change: any;
  showToolTip?: boolean;
  constructor(public mapStates: MapStates){}
  ngOnInit(){ 
    this.setUnfillColor();
    this.colorStates();
  }

  colorStates(): void{
    this.states.forEach(state => {
      document.getElementById(state)!.style.fill = this.colors.fill;
    });
  }
  
  ngOnChanges(changes: SimpleChanges){
      this.setUnfillColor();
      this.colorStates();
  } 
  setUnfillColor(){ 
    Object.keys(this.mapStates.statelist).forEach(id => { 
      document.getElementById(id)!.style.fill = this.colors.unfill; 
    }); 
  }
  // mouseEnter(ttid: any, e: any, id: string){ 
  //     document.getElementById(id)!.style['stroke-width']= "1.999999";  
  //     if(this.enableTooltip){ 
  //       this.toolTipObject = this.createToolTipData(event, id);
  //       this.positionToolTip(e, ttid); 
  //     }
  // }
  // mouseLeave(ttid: any, e: any, id: string){
  //     document.getElementById(id)!.style['stroke-width']= "0.970631";  
  //     if(this.enableTooltip){
  //       this.showToolTip = false;
  //       this.toolTipObject = {};
  //     }
  // }
  createToolTipData(event: Event | undefined,id: string | number){ 
      let selectedstate  = JSON.parse(JSON.stringify(this.change.currentValue));
      selectedstate = selectedstate.filter((data: { code: any; }) => {
              return data.code === id
            })[0]; 
      if(selectedstate && selectedstate.code === id){
        this.showToolTip = true;
        selectedstate['state'] = this.mapStates.statelist[id];
        delete selectedstate.code;
        return Object.keys(selectedstate).map((key, value) => {
          return [key, selectedstate[key]]; 
        });
      } 
      return null;
  }
  positionToolTip(e: { clientX: number; clientY: number; }, ttid: string){ 
    document.getElementById(ttid)!.style.left = `${e.clientX+2}px`; 
    document.getElementById(ttid)!.style.top = `${e.clientY+2}px`;  
  }
}
// #518a38 fill
// #e2e2e2 unfill