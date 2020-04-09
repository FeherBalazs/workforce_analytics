import { Component, ViewChild, ElementRef } from "@angular/core";
import {BackendApiService} from './backend-api.service';

declare var tableau: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {

  backend = {
    brand_and_content: 75,
    marketing_operations: 4,
    digital_marketing: 7,
    customer_care: 0, 
    indirect_retail: 100, 
    direct_retail: 0, 
    direct_sales: 12, 
    sales_system_support: 7, 
    market_share: 0.1734,
    status: false,
    modelled_market_share: 0.17,
    employee_number: 275,
    pred_BC: 0, 
    pred_MO: 0, 
    pred_DM: 0, 
    pred_CC: 0, 
    pred_IR: 0, 
    pred_DR: 0, 
    pred_DS: 0, 
    pred_SS: 0, 
  }

  constructor(
    private backendAPI: BackendApiService
  ) {}

  viz: any;
  viz2: any;
  viz3: any;
  viz4: any;
  
  @ViewChild("vizContainer", { static: true }) containerDiv: ElementRef;
  @ViewChild("vizContainer2", { static: true }) containerDiv2: ElementRef;
  @ViewChild("vizContainer3", { static: true }) containerDiv3: ElementRef;
  @ViewChild("vizContainer4", { static: true }) containerDiv4: ElementRef;

  ngAfterViewInit() {
    this.initTableau();
    this.initTableau3();
    this.initTableau4();
  }

  updateEmployeeNumber(event: any) {
    this.backend.employee_number = event.target.value;
  }

  updateModelledMarketShare(event: any) {
    this.backend.modelled_market_share = event.target.value;
  }

  updateBrand(event: any) {
    this.backend.brand_and_content = event.target.value;
    console.log(this.backend.brand_and_content);
  }

  updateMO(event: any) {
    this.backend.marketing_operations = event.target.value;
  }

  updateDM(event: any) {
    this.backend.digital_marketing = event.target.value;
  }

  updateCC(event: any) {
    this.backend.customer_care = event.target.value;
  }

  updateIR(event: any) {
    this.backend.indirect_retail = event.target.value;
  }

  updateDR(event: any) {
    this.backend.direct_retail = event.target.value;
  }

  updateDS(event: any) {
    this.backend.direct_sales = event.target.value;
  }

  updateSS(event: any) {
    this.backend.sales_system_support = event.target.value;
  }

  

  onSubmit() {
    this.updateMarketShare();
    this.initTableau2();
  }

  getDistribution() {
    this.backendAPI.getDistribution(this.backend)
    .subscribe(data => {
      this.backend.pred_BC = data.pred_BC;
      this.backend.pred_MO = data.pred_MO;
      this.backend.pred_DM = data.pred_DM;
      this.backend.pred_CC = data.pred_CC;
      this.backend.pred_IR = data.pred_IR;
      this.backend.pred_DR = data.pred_DR;
      this.backend.pred_DS = data.pred_DS;
      this.backend.pred_SS = data.pred_SS;
    })
  }

  updateMarketShare() {
    this.backendAPI.updateMarketShare(this.backend)
    .subscribe(data => {
      // this.backend.brand_and_content = data.brand_and_content;
      this.backend.market_share = data.market_share;
    })
  }

  initTableau() {
    // const containerDiv = document.getElementById("vizContainer");
    const vizUrl =
      "https://public.tableau.com/views/demo_15859349487090/Dashboard3?:display_count=y&publish=yes&:origin=viz_share_link";

    const options = {
      hideTabs: true,
      onFirstInteractive: () => {
        console.log("onFirstInteractive");
      },
      onFirstVizSizeKnown: () => {
        console.log("onFirstVizSizeKnown");
      }
    };
    this.viz = new tableau.Viz(
      this.containerDiv.nativeElement,
      vizUrl,
      options
    );
  }

  initTableau2() {
    if(typeof this.viz2 !== 'undefined') {
      this.viz2.dispose();
    }
    const vizUrl =
      "https://public.tableau.com/views/demo_market_share_by_time/ProjectingMarketShare?:display_count=y&publish=yes&:origin=viz_share_link"

    const options = {
      hideTabs: true,
      onFirstInteractive: () => {
        console.log("onFirstInteractive");
      },
      onFirstVizSizeKnown: () => {
        console.log("onFirstVizSizeKnown");
      }
    };
    this.viz2 = new tableau.Viz(
      this.containerDiv2.nativeElement,
      vizUrl,
      options
    );
  }


  initTableau3() {
    if(typeof this.viz3 !== 'undefined') {
      this.viz3.dispose();
    }
    const vizUrl =
      "https://public.tableau.com/views/demo_attrition_predicted/Dashboard1?:display_count=y&publish=yes&:origin=viz_share_link"

    const options = {
      hideTabs: true,
      onFirstInteractive: () => {
        console.log("onFirstInteractive");
      },
      onFirstVizSizeKnown: () => {
        console.log("onFirstVizSizeKnown");
      }
    };
    this.viz3 = new tableau.Viz(
      this.containerDiv3.nativeElement,
      vizUrl,
      options
    );
  }

  initTableau4() {
    if(typeof this.viz4 !== 'undefined') {
      this.viz4.dispose();
    }
    const vizUrl =
      "https://public.tableau.com/views/demo_attrition_predicted_turnover_rate/Dashboard2?:display_count=y&publish=yes&:origin=viz_share_link"

    const options = {
      hideTabs: true,
      onFirstInteractive: () => {
        console.log("onFirstInteractive");
      },
      onFirstVizSizeKnown: () => {
        console.log("onFirstVizSizeKnown");
      }
    };
    this.viz4 = new tableau.Viz(
      this.containerDiv4.nativeElement,
      vizUrl,
      options
    );
  }

}
