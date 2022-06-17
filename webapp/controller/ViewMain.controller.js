sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format",
		"sap/ui/model/json/JSONModel",
		'sap/ui/model/FilterOperator',
		'sap/ui/model/Filter'
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, ChartFormatter, Format, JSONModel,FilterOperator, Filter) {
		"use strict";

		return Controller.extend("zetanalitics.controller.ViewMain", {
			onInit: function () {

				const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

				this.readData();
	
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
			readData:function(){

				this.oModel = this.getOwnerComponent().getModel("analiticosBase");

				const myFilters = [];

				const filterFiltri = new Filter({
					filters: [

						new Filter({
							path: 'IndicatorCode',
							operator: FilterOperator.EQ,
							value1: 'I004'
						}),

						new Filter({
							path: 'IndicatorCode',
							operator: FilterOperator.EQ,
							value1: 'I005'
						}),

						new Filter({
							path: 'IndicatorCode',
							operator: FilterOperator.EQ,
							value1: 'I006'
						}),

					],
					and: false
				});
				myFilters.push(filterFiltri);
				myFilters.push(	new Filter({
					path: 'WeekIndicator',
					operator: FilterOperator.EQ,
					value1: '000000'
				}),)
				myFilters.push(	new Filter({
					path: 'MonthIndicator',
					operator: FilterOperator.NE,
					value1: '00'
				}),)

				this.getView().setBusy(true);

				this.oModel.read('/AnaliticsSet', {
					filters: myFilters,
					success: oData => {
						const model = new JSONModel({
							AnaliticsSet:[],
							GraficoPorFecha:[],
						});
						this.getView().setModel(model, "analiticos");

						model.setProperty("/AnaliticsSet", oData.results);

						const results = this._getGraphicsData(oData.results);

						model.setProperty("/GraficoPorFecha", results.GraficoPorFecha);
						model.setProperty("/GraficoPorFechaAprobacion", results.GraficoPorFechaAprobacion);


						this.getView().setBusy(false);
					},
					error: e => {
						this.getView().setBusy(false);

						const errorMessage = JSON.parse(e.responseText).error.message.value
						MessageToast.show(errorMessage);
					}
				});


			},
			_getGraphicsData:function (aResults) {

				const oInput = {
					GraficoPorFecha : ['I004','I005', 'I006'],
					GraficoPorFechaAprobacion : ['I007','I008', 'I009'],
				}

				const oOutput = {
					GraficoPorFecha : [],
					GraficoPorFechaAprobacion : []
				}

				let graphicKey = "";

				aResults.forEach(e=>{

					graphicKey = this._arrayGetKey(oInput, e.IndicatorCode );

					if ( graphicKey && e.WeekIndicator === '000000' && e.MonthIndicator !== '00') {

						const oNewRecord = oOutput[graphicKey].find(d => {
							d.YearIndicator === e.YearIndicator &&
							d.MonthIndicator === e.MonthIndicator &&
							d.WeekIndicator === e.WeekIndicator &&
							d.Gsber === e.Gsber
						});

						if (oNewRecord) {

							oNewRecord[e.IndicatorCode] = e.Value;

						} else {

							const a = {

								YearIndicator: e.YearIndicator,
								MonthIndicator: e.MonthIndicator,
								WeekIndicator: e.WeekIndicator,
								Gsber: e.Gsber

							};
							a[e.IndicatorCode] = e.Value;


							oOutput[graphicKey].push(a);

						}

					}



				})
				return oOutput;



			},
			_arrayGetKey:function(oInput, indicatorCode){

				let out = null;

				Object.keys(oInput).forEach(key=> {

					if (oInput[key].some(value => value === indicatorCode)) {
						out = key;
					}
				})

				return out;

			}
		});

	});
