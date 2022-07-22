app.controller('supportCtrl', function ($scope, $rootScope, searchSelect, $ionicModal, $state, myRequestDBService, myAllSharedService, $ionicLoading, $cordovaSQLite, $ionicPopup, $timeout, $ionicActionSheet, $cordovaImagePicker, Camera, $cordovaFileTransfer, $cordovaGeolocation, $cordovaToast, $location, $window, $ionicPlatform, $ionicHistory, $ionicModal,$stateParams, $ionicScrollDelegate, $ionicPopover) {
      
      $scope.loginData = myAllSharedService.loginData;
      console.log(myAllSharedService.loginData);
      $scope.support_filter = {};
      $scope.data = {};
    $scope.isSearchActive = false;

      $scope.suportData = {};
      $scope.dateFormat = function (date) {
            return moment(date).format("DD MMM YYYY")
      }
      $scope.minDate = moment().format('YYYY-MM-DD');
      $scope.todayDate = moment().format('YYYY-MM-DD');
      console.log($scope.todayDate);
      $scope.goToBackPageHandler = function () {
            $ionicHistory.goBack();
      }
      
      $scope.onGoToSupportAdd = function () {
            $state.go('tab.orp_support_add');
      }
      
      $scope.onGoToSupportDetail = function (id) {
            console.log(id);
            myAllSharedService.supportDetailId = id;
            console.log(myAllSharedService.supportDetailId);
            $scope.getSupportDetail(myAllSharedService.supportDetailId);
      }
      
      $scope.onGoToSupportPromiseUpdate = function (id) {
            console.log(id);
            myAllSharedService.PromiseUpdateDetailId = id;
            $state.go('tab.orp_support_promise_update');
      }
      
      $scope.onChangeSupportStatus = function (id) {
            console.log(id);
            myAllSharedService.PromiseUpdateDetailId = id;
            $state.go('tab.orp_support_status_change');
      }
      
      $scope.goToStep = function(step)
      {
            console.log(step);
            $scope.activeStape = step;
      }
      
      $scope.getDepartment = function()
      {
            $ionicLoading.show({
                  template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>'
            });
            
            myRequestDBService.sfaPostServiceRequest("/Support/departmentList","").then(function(response)
            {
                  console.log(response);                  
                  $scope.departmentList = response;                  
                  $ionicLoading.hide();                  
            },
            function (err)
            {
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Something went wrong !!'
                  });
                  console.error(err);
            });
      }
      
      $scope.userList = [];
      $scope.getUserList = function()
      {
            $ionicLoading.show({
                  template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>'
            });
            
            myRequestDBService.sfaPostServiceRequest("/Support/requestToUserList","").then(function(response)
            {
                  console.log(response);
                  $scope.userList = response;
                  $ionicLoading.hide();
            },
            function (err)
            {
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Something went wrong !!'
                  });
                  console.error(err);
            });
      }
      
      $scope.getUserInfo = function (id)
      {
            console.log(id);
            var index = $scope.userList.findIndex(row => row.id == id);
            console.log(index);
            console.log($scope.userList);
            if (index != -1) {
                  $scope.suportData.user_code = $scope.userList[index]['emp_code'];
                  $scope.suportData.user_id = $scope.userList[index]['id'];
                  $scope.suportData.user_name = $scope.userList[index]['name'];
            }
            console.log($scope.suportData);
      }
      
      $scope.supportList = [];
      $scope.getSupportHistory = function()
      {
            console.log($scope.data);
            $ionicLoading.show({
                  template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>'
            });
            
            myRequestDBService.sfaPostServiceRequest("/Support/getSupportHistoryList",$scope.data).then(function(response)
            {
                  console.log(response);
                  
                  $scope.supportList = response.data;
                  console.log($scope.supportList);
                  $ionicLoading.hide();
                  
            },
            function (err)
            {
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Something went wrong !!'
                  });
                  console.error(err);
            });
      }
      
      $scope.saveSupportData = function()
      {
            console.log($scope.suportData);
            
            
            if(!$scope.suportData.department)
            {
                  $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Select a complaint department !!'
                  });
            }
            else if(!$scope.suportData.escalation_description)
            {
                  $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Complaint Escalation Description required !!'
                  });
            }
            else
            {
                  
                  $ionicLoading.show({
                        template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>'
                  });
                  myRequestDBService.sfaPostServiceRequest("/Support/saveSupportData",{data:$scope.suportData}).then(function(response)
                  {
                        console.log(response);
                        $scope.suportData ={};
                        if(response.status == 'Success')
                        {
                              $state.go('tab.orp_support_list');
                              $ionicLoading.hide();
                        }
                        else
                        {
                              $ionicLoading.hide();
                        }
                        
                        
                        console.log(response);
                        
                        $scope.suportData ={};
                        
                  },
                  function (err)
                  {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                              title: 'Error!',
                              template: 'Something went wrong !!'
                        });
                        console.error(err);
                  });
            }
            
            
            
      }
      
      $scope.supportDetailData = {};
      $scope.getSupportDetail = function(id)
      {
            $ionicLoading.show({
                  template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>'
            });
            
            myRequestDBService.sfaPostServiceRequest("/Support/getSupportHistoryDetail/"+id).then(function(response)
            {
                  console.log(response);
                  if (response.status == 'Success') {
                        $scope.supportDetailData = response.data;
                        console.log($scope.supportDetailData);
                        myAllSharedService.supportDetailData = $scope.supportDetailData;
                        // alert($scope.supportDetailData.department);
                        $state.go('tab.orp_support_detail');
                        $ionicLoading.hide();
                  }
                  else
                  {
                        $ionicLoading.hide();
                  }
                  
            },
            function (err)
            {
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Something went wrong !!'
                  });
                  console.error(err);
            });
      }
      
      $scope.UpdatePromise = function()
      {
            console.log($scope.data);
            
            
            if(!$scope.data.promise_date)
            {
                  $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Promise Date required !!'
                  });
            }
            else if(!$scope.data.promise_action)
            {
                  $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Promise Action required !!'
                  });
            }
            else
            {
                  if ($scope.data.promise_date) 
                  {
                        $scope.data.promise_date = moment($scope.data.promise_date).format('YYYY-MM-DD');
                  }
                  $ionicLoading.show({
                        template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>'
                  });
                  myRequestDBService.sfaPostServiceRequest("/Support/addPromiseInfo",$scope.data).then(function(response)
                  {
                        console.log(response);
                        $scope.data ={};
                        if(response.msg == 'success')
                        {
                              $state.go('tab.orp_support_detail');
                              $ionicLoading.hide();
                        }
                        else
                        {
                              $ionicLoading.hide();
                        }
                        console.log(response);
                        $scope.data ={};
                  },
                  function (err)
                  {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                              title: 'Error!',
                              template: 'Something went wrong !!'
                        });
                        console.error(err);
                  });
            }
      }
      
      $scope.changeSupportStatus = function()
      {
            console.log($scope.data);
            
            
            if(!$scope.data.status)
            {
                  $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Status required !!'
                  });
            }
            else if(!$scope.data.status_remark)
            {
                  $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Status Remark required !!'
                  });
            }
            else
            {
                  $ionicLoading.show({
                        template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>'
                  });
                  myRequestDBService.sfaPostServiceRequest("/Support/updateSupportStatus",$scope.data).then(function(response)
                  {
                        console.log(response);
                        $scope.data ={};
                        if(response.msg == 'success')
                        {
                              $state.go('tab.orp_support_detail');
                              $ionicLoading.hide();
                        }
                        else
                        {
                              $ionicLoading.hide();
                        }
                        console.log(response);
                        $scope.data ={};
                  },
                  function (err)
                  {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                              title: 'Error!',
                              template: 'Something went wrong !!'
                        });
                        console.error(err);
                  });
            }
      }
      
      $scope.onModifyTypeHandler = function (supportFor,subTab) {
            console.log(supportFor , subTab);
            $scope.data.supportFor = supportFor;
            $scope.data.subTab = subTab;
            console.log($scope.data);
            $scope.getSupportHistory();
      }
      
      if($location.path() == '/tab/orp_support_list')
      {
            console.log($scope.data);
            $scope.data.supportFor = 'My';
            if ($scope.data.supportFor = 'My') {
                  $scope.data.subTab = 'Open'
            }
            $scope.getSupportHistory();
      }
      
      if($location.path() == '/tab/orp_support_add')
      {
            $scope.getDepartment();
            console.log(myAllSharedService.loginData.loginName);
            $scope.suportData.requested_by = myAllSharedService.loginData.loginName;
            console.log($scope.suportData.requested_by);
            // $ionicPopover.fromTemplateUrl('add-support-status', {
            //       scope: $scope,
            // }).then(function(popovers) {
            //       $scope.data.statusModel = popovers;
            // });
      }
      
      if($location.path() == '/tab/orp_support_detail')
      {
            $scope.supportDetailData = myAllSharedService.supportDetailData;
            console.log($scope.supportDetailData);
            console.log(myAllSharedService.supportDetailId);
            $scope.getSupportDetail(myAllSharedService.supportDetailId);
      }
      
      if($location.path() == '/tab/orp_support_promise_update' || $location.path() == '/tab/orp_support_status_change')
      {
            $scope.data.id = myAllSharedService.PromiseUpdateDetailId;
      }
      
})