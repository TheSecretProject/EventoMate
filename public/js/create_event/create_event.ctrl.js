(function($){  

	'use strict';

	angular
		.module("EventoMate")
		.controller("CreateEventController", CreateEventController)

	function CreateEventController($scope, $routeParams, $location, security, ngDialog, CreateEventService) {
		var vm = this

		//Method Bindables
		vm.createEvent = createEvent
		vm.addSection = addSection
		vm.removeSection = removeSection
		vm.selectWidget = selectWidget

		//Properties
		vm.eventId
		vm.title
		vm.address
		vm.startTime
		vm.endTime
		vm.location
		vm.description
		vm.sections
		vm.eventService
		vm.security

		init()

		function init() {
			vm.eventService = CreateEventService
			vm.sections = []
			vm.security = security
		}

		function createEvent() {

			console.log("create event")

			if (!vm.security.userValid){
				var loginDialog = ngDialog.open({
					template: 'loginDialog',
					controller: "AuthenticationController"
				})	
				
				loginDialog.closePromise.then(function(data){
					if (data.value == "register") {
						var registerDialog = ngDialog.open({template: 'registerDialog'})
						registerDialog.closePromise.then(function(data){
							createEvent()
						})
					}
					else {
						createEvent()
					}
				})
			}

			if ($scope.createEventForm.$valid) {
				vm.eventData = JSON.stringify({
					"title": vm.title,
					"address": vm.location.formatted_address,
					"lat": vm.location.geometry.location.lat(),
					"lng": vm.location.geometry.location.lng(),
					"start_date": $scope.dateRangeStart,
					"finish_date": $scope.dateRangeEnd,
					"description": vm.description,
					"sections": vm.sections
				})

				console.log(vm.eventData)
				
				vm.eventService.create(vm.eventData)
				.then(function(response) {
					if (response.errors === undefined) {
						$location.path('/dashboard')
					}
				})
				.catch(function(error){
						console.log(error)
				})
			}
		}

		function addSection(type) {
			if (vm.sections.length < 3){
				var section = {"type": type}
				vm.sections.push(section)
			}
		}

		function removeSection(type) {
			vm.sections.pop()
		}

		function selectWidget(type) {
			vm.sections[vm.sections.length - 1].type = type
		}

		//Default datapicker settings 
		$scope.endDateBeforeRender = endDateBeforeRender
		$scope.endDateOnSetTime = endDateOnSetTime
		$scope.startDateBeforeRender = startDateBeforeRender
		$scope.startDateOnSetTime = startDateOnSetTime

		function startDateOnSetTime () {
		  $scope.$broadcast('start-date-changed');
		}

		function endDateOnSetTime () {
		  $scope.$broadcast('end-date-changed');
		}

		function startDateBeforeRender ($dates) {
		  if ($scope.dateRangeEnd) {
		    var activeDate = moment($scope.dateRangeEnd);
		    $dates.filter(function (date) {
		      return date.localDateValue() >= activeDate.valueOf()
		    }).forEach(function (date) {
		      date.selectable = false;
		    })
		  }
		}

		function endDateBeforeRender ($view, $dates) {
		  if ($scope.dateRangeStart) {
		    var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

		    $dates.filter(function (date) {
		      return date.localDateValue() <= activeDate.valueOf()
		    }).forEach(function (date) {
		      date.selectable = false;
		    })
		  }
		}

	}
})()