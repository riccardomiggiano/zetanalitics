/*global QUnit*/

sap.ui.define([
	"zetanalitics/controller/ViewMain.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ViewMain Controller");

	QUnit.test("I should test the ViewMain controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
