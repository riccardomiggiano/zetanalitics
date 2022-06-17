sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, ChartFormatter, Format) {
		"use strict";

		return Controller.extend("zetanalitics.controller.ViewMain", {
			onInit: function () {

				const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
	
				let json = {
					filters: {
						anno: "2022"
					},
					vizPropertiesBar:{
						categoryAxis: {
							color: "black",
							axisLine:{
								size: 5,
								visible: true
							},
							axisTick:{
								shortTickVisible:true,
								
							},
							title:{
								text : oResourceBundle.getText("titleCategory")
							}
						},
						general:{
							background:{
								color: "#ADD8E6"
							}
						},
						interaction:{
							nonInteractiveMode:false
						},
						legend:{
							title: {
								visible: true,
								text: oResourceBundle.getText("titleLegend")
							}
						},
						plotArea:{
							background:{
								color: "#116ADB"
							}
						},
						title:{
							text: oResourceBundle.getText("negoziazioniTitolo")
						},
						valueAxis: {
							title: {
								text :oResourceBundle.getText("titleValue")
							}
						}

					},
					vizPropertiesPie:{
						title:{
							text: oResourceBundle.getText("PieChartTitle")
						},	
					},
					vizPropertiesColumn:{
						title:{
							text: oResourceBundle.getText("ColumnChartTitle")
						},	
					},
					vizPropertiesStackedColumn:{
						title:{
							text: oResourceBundle.getText("StackedColumnTitle")
						},	
					},
					vizPropertiesFrameRadar:{
						title:{
							text: oResourceBundle.getText("FrameRadarTitle")
						},	
					},
					
				};



				this.getView().setModel(new sap.ui.model.json.JSONModel(json));

				
				let oVizFrameBar = this.getView().byId("oVizFrameBar");
				let oPopOver = this.getView().byId("idPopOver");
				oPopOver.connect(oVizFrameBar.getVizUid());
				
				let oVizFramePie = this.getView().byId("oVizFramePie");
				oPopOver.connect(oVizFramePie.getVizUid());

				
				let oVizFrameColumn = this.getView().byId("oVizFrameColumn");
				oPopOver.connect(oVizFrameColumn.getVizUid());

				Format.numericFormatter(ChartFormatter.getInstance());
				let formatPattern = ChartFormatter.DefaultPattern;
				oPopOver.setFormatString(formatPattern.STANDARDFLOAT);


			},
			onPressFilter:function(){
				let filter = [];
				let flatDataBar = this.getView().byId("flatDatabar");
				let flatDataPie = this.getView().byId("flatDatapie");
				let flatDataColumn = this.getView().byId("flatDataColumn");
				let flatDataStackedColumn = this.getView().byId("flatDataStackedColumn");
				let flatDataRadar = this.getView().byId("flatDataRadar");
				let filters = this.getView().getModel().getProperty("/filters");

				if (filters.anno){
					filter.push(new sap.ui.model.Filter("Annodiriferimento", "EQ", filters.anno));
					
				}

				flatDataBar.getBinding("data").filter(filter);
				flatDataPie.getBinding("data").filter(filter);
				flatDataColumn.getBinding("data").filter(filter);
				flatDataStackedColumn.getBinding("data").filter(filter);	
				flatDataRadar.getBinding("data").filter(filter);	

			},
			onReadData:function(){

			}
		});

	});
