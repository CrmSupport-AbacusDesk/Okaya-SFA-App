
app.controller('dms_controller', function ($scope, $rootScope, searchSelect, $ionicModal, $state, myRequestDBService, myAllSharedService, $ionicLoading, $cordovaSQLite, $ionicPopup, $timeout, $ionicActionSheet, $cordovaImagePicker, Camera, $cordovaFileTransfer, $cordovaGeolocation, $cordovaToast, $location, $window, $ionicPlatform, $ionicHistory, $ionicModal, $stateParams, $ionicScrollDelegate, $ionicPopover) {
  
  console.log("********* IN DMS CONTROLLER *************");
  
  $scope.loginData = myAllSharedService.loginData;
  console.log($scope.loginData);
  
  $scope.goToBackPageHandler = function()
  {
    $ionicHistory.goBack();
  }
  
  $scope.currentPage = 1;
  $scope.isSearchBarOpen = false;
  $scope.isRequestInProcess;
  $scope.noMoreListingAvailable = false;
  
  $scope.onSeachActionHandler = function(type) {
    if(type == 'open') {
      $scope.isSearchBarOpen = true;
      setTimeout(() => {
        $('#searchData').focus();
      }, 1000);
    }
    if(type == 'close') {
      $scope.data.search = '';
      $scope.isSearchBarOpen = false;
      $scope.billinglistdata();
      $scope.getSFA_primary_order('onLoad');
    }
  }
  
  $scope.onSetCurrentPageHandler = function()
  {
    $scope.currentPage = 1;
    $scope.getPendingOrderList = [];
    $scope.onPageScrollTopHandler();
    $scope.noMoreListingAvailable = false;
  }
  $scope.onPageScrollTopHandler = function() {
    $ionicScrollDelegate.scrollTop();
  }
  
  $scope.data = {};
  $scope.search = {};
  
  /////////////////// SFA PENDING ORDER START/////////////////
  $scope.getPendingOrderList=[];
  $scope.tmpOrderList = [];
  $scope.noMoreItemsAvailable = false;
  
  $scope.getSFA_primary_order=function(targetSRC)
  {
    // console.log("*******GET SFA PRIMARY ORDER LIST FUNCTION ********");
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });
    console.log(targetSRC);
    $scope.isRequestInProcess = true;
    $scope.data.page=$scope.currentPage;
    myRequestDBService.orpPostServiceRequest('/invoice/getPendingOrderList',$scope.data)
    .then(function (response) {
      // console.log(response);
      console.log(response.data);
      $ionicLoading.hide();
      $scope.getPendingOrderList=$scope.getPendingOrderList.concat(response.data);
      $scope.tmpOrderList=$scope.getPendingOrderList;
      $scope.isRequestInProcess = false;
      if(targetSRC == 'onLoad' || targetSRC == 'onRefresh') {
        $scope.onPageScrollTopHandler();
      }
      if(targetSRC == 'scroll') {
        console.log('scroll called');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
      if(targetSRC == 'onRefresh')
      {
        $scope.$broadcast('scroll.refreshComplete');
        $cordovaToast.show('Refreshed Successfully', 'short', 'bottom').then(function (success) {
        }, function (error) {
        });
      }
      if(!response.data || response.data.length == 0) {
        $scope.noMoreItemsAvailable = true;
        $scope.noMoreListingAvailable = true;
      }
      $scope.currentPage += 1;
      // $scope.$broadcast('scroll.infiniteScrollComplete');
      // $ionicLoading.hide();
      
    });
  }
  if ($location.path() == '/tab/sfa-primary-order-list')
  {
    // console.log("*****SFA PRIMARY ORDER LIST *******");
    $scope.getSFA_primary_order('onLoad');
  }
  $scope.filterOrderListList = function(search)
  {
    search = search.toLowerCase();
    console.log(search);
    $scope.getPendingOrderList = [];
    console.log($scope.getPendingOrderList);
    console.log($scope.tmpOrderList);
    $scope.getPendingOrderList = $scope.tmpOrderList.filter(row=>row.dr_code.includes(search) || row.order_no.toLowerCase().includes(search) || row.dr_name.toLowerCase().includes(search));
    console.log($scope.getPendingOrderList);
    console.log(searchArray);
  }
  /////////////////// SFA PENDING ORDER END/////////////////
  
  ////////  SFA PENDING ORDER DETAIL PAGE /////////////
  $scope.getPendingOrderDetailData = function () {
    
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });
    
    console.log($scope.data.orderId);
    myRequestDBService.orpPostServiceRequest('/invoice/getPendingOrderDetail',$scope.data.orderId).then(function(response) {
      
      console.log(response.data);
      
      $scope.orderDetail = response.data;
      
      $ionicLoading.hide();
      
    }, function (err) {
      
      $ionicLoading.hide();
      console.error(err);
    });
  }
  
  if ($location.path() == '/tab/sfa-pending-order-detail') {
    
    $scope.data.orderId = myAllSharedService.drTypeFilterData.orderId;
    $scope.getPendingOrderDetailData();
    
    $ionicPopover.fromTemplateUrl('add-status', {
      scope: $scope,
    }).then(function (popovers) {
      $scope.data.statusModel = popovers;
    });
  }
  
  $scope.onGoToOrderDetailPage = function (orderId) {
    myAllSharedService.drTypeFilterData.orderId = orderId;
    $state.go('tab.sfa-pending-order-detail');
  }
  ////////  SFA PENDING ORDER DETAIL PAGE END /////////////
  
  
  $scope.leadListFilter = false;
  $scope.sec_order = {};
  $scope.dr_status = {};
  
  $scope.filter = function (value) {
    console.log($scope.leadListFilter);
    $scope.leadListFilter = value;
    console.log($scope.data.orderCreatedBy);
    console.log($scope.data);
    
    if ($scope.data.orderCreatedBy == 'me') {
      $scope.sec_order.type = 'dr_status';
    } else if ($scope.data.orderCreatedBy == 'myTeam') {
      $scope.sec_order.type = 'dr_name';
    }
  }
  
  ///////////////  SFA BILLING LIST //////////////////////
  $scope.onGoToBillingDetailPage = function(orderId)
  {
    myAllSharedService.billingdetail = orderId;
    $state.go('tab.billing-detail');
  }
  $scope.billinglist=[];
  $scope.billingdetail=[];
  
  $scope.filterBillingList = function(search)
  {
    search = search.toLowerCase();
    // $scope.tmpbillingList=$scope.billinglist;
    console.log($scope.billinglist);
    
    console.log(search);
    $scope.billinglist = [];
    console.log($scope.billinglist);
    console.log($scope.tmpbillingList);
    
    $scope.billinglist = $scope.tmpbillingList.filter(row=>row.customer_code.includes(search) || row.customr_name.toLowerCase().includes(search) || row.sale_order_no.includes(search) || row.bill_doc.includes(search));
    
    console.log($scope.billinglist);
    
    
    console.log(searchArray);
    
  }
  $scope.billinglistdata = function () {
    fetchingRecords = true;
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });
    myRequestDBService.orpPostServiceRequest('/invoice/getInvoiceList','')
    .then(function (result)
    {
      console.log(result);
      
      $scope.billinglist = result.data;
      $scope.tmpbillingList=$scope.billinglist;
      $ionicLoading.hide();
      
      fetchingRecords = false;
      
    }, function (errorMessage) {
      console.log(errorMessage);
      window.console.warn(errorMessage);
      $ionicLoading.hide();
      fetchingRecords = false;
    });
  }
  
  if($location.path() == '/tab/sfa-billing-list')
  {
    console.log("hello");
    $scope.billinglistdata();
  }
  
  if($location.path() == '/tab/billing-detail') {
    
    console.log("hello");
    console.log(myAllSharedService.billingdetail);
    $scope.data = myAllSharedService.billingdetail;
    console.log($scope.data);
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>'
    });
    fetchingRecords = true;
    
    myRequestDBService.orpPostServiceRequest('/invoice/getInvoiceDetail',$scope.data)
    .then(function (result)
    {
      console.log(result);
      $ionicLoading.hide();
      
      $scope.billingdetail = result.data;
      console.log($scope.billingdetail);
      fetchingRecords = false;
      
    }, function (errorMessage) {
      console.log(errorMessage);
      window.console.warn(errorMessage);
      $ionicLoading.hide();
      fetchingRecords = false;
    });
  }
  ////////////  SFA BILLING LIST END ////////////////////////
  
  /////////////  SFA STOCK START ///////////////////////
  $scope.productStock = [];
  $scope.getStockData = function(branchCode)
  {
    console.log(branchCode);
    $scope.suggestiveList = [];
    $scope.branchCode=branchCode;
    
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner icon="android"></ion-spinner>',
      duration: 100
    });
    
    myRequestDBService.sfaPostServiceRequest('/App_SharedData/getProductStockData',{'branch':$scope.branchCode})
    .then(function(response)
    {
      console.log(response);
      $scope.productStock = response.data;
      $scope.tmpstockList=$scope.productStock;
      $ionicLoading.hide();
    }, function (err)
    {
      $ionicLoading.hide();
      console.error(err);
    });
  }
  
  $scope.suggestiveList = [];
  $scope.getSuggestiveData = function()
  {
    $scope.suggestiveList = [];
    
    if($scope.search.master_search.length)
    {
      myRequestDBService.sfaPostServiceRequest("/App_SharedData/getSuggestiveData",{search : $scope.search.master_search}).then(function(response)
      {
        console.log(response);
        
        if(response.status=='Success')
        {
          $scope.suggestiveList = response.data;
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
    else
    {
      $scope.productPriceList = [];
      $scope.getStockData();
    }
    
  }
  
  $scope.user_branchh=[];
  // $scope.userlist=[];
  $scope.getAllBranch=function()
  {
    console.log('***** GET ALL BRANXHES *********');
    // console.log(myAllSharedService.loginData.user_branch);
    // console.log(typeof myAllSharedService.loginData['user_branch']);
    // console.log($scope.loginData['user_branch']);
    // $scope.user_branchh.push($scope.loginData['user_branch']);
    $scope.userlist=$scope.loginData['user_branch'];
    // // console.log($scope.userlist.length);
    // console.log(typeof $scope.userlist);
    // console.log($scope.userlist);
    // console.log($scope.user_branchh);
    // console.log($scope.user_branchh[0]);
    // var bname=$scope.user_branchh[0];
    // console.log(bname);
    // console.log(bname[0]['branch_name']);
    // console.log(JSON.stringify(myAllSharedService.loginData['user_branch']));
    // $scope.user_branch=myAllSharedService.loginData['user_branch'];
    // console.log($scope.user_branch);
    // var entries=Object.entries($scope.user_branch);
    // console.log(typeof entries);
    // console.log(entries);
    // myRequestDBService.orpPostServiceRequest('/Invoice/getAssignBranch').then(function(response) {
    //   console.log(response);
    //   $scope.userlist=response.data;
    // });
    // for (let i = 0; i < $scope.user_branchh.length; i++) 
    // {
    //   console.log('in loop');
    //   console.log($scope.user_branchh[0]);
    //   // $scope.userlist.push(userlist[i]);
    // }
    // console.log($scope.userlist);
    // $scope.user_branch.forEach(e => {
    //   console.log(e);
    // });
    // console.log($scope.user_branch);
  }

  $scope.array=[];
  // $scope.branchName='';
  $scope.showBname=false;
  $scope.showBranchName=function(e)
  {
    console.log(e);
    // $scope.obj=Object.assign({},$scope.user_branch);
    // console.log($scope.obj);
    console.log($scope.userlist);
    // $scope.array.push(Object.entries($scope.userlist));
    // console.log($scope.array);
    for (let  i= 0;  i< $scope.userlist.length; i++) {
      // console.log("inside loop");
      if($scope.userlist[i]['branch_code'] == e)
      {
        console.log("find Code");
        $scope.branchName=$scope.userlist[i]['branch_name']
        $scope.showBname=true;
        console.log("after Filter branch Name is "+$scope.branchName);
      }
    }
    
  }
  
  if($location.path() == '/tab/stock')
  {
    // $scope.getStockData();
    console.log(myAllSharedService.loginData['user_branch']);
    // 
    $scope.user_branch=myAllSharedService.loginData['user_branch'];
    console.log($scope.user_branch);
    console.log(Object.assign({},$scope.user_branch));
    let obj=Object.assign({},$scope.user_branch);
    console.log(obj[0]);
    let obj2=Object.assign({},obj[0]);
    console.log(obj2['branch_code']);
    $scope.bCode=obj2['branch_code'];
    $scope.data.branch=obj2['branch'];
    console.log($scope.branch);
    console.log($scope.bCode);

    $scope.getStockData($scope.bCode);
    $scope.getAllBranch();
  }
  /////////////  SFA STOCK START END ///////////////////////
  
  ////////  SFA STOCK START ///////////
  $scope.isSearchBarOpen = false;
  
  $scope.onSeachActionHandler = function(type, target) {
    if(type == 'open') {
      $scope.isSearchBarOpen = true;
      setTimeout(() => {
        $('#searchData').focus();
      }, 1000);
    }
    if(type == 'close') {
      $scope.data.search = '';
      $scope.isSearchBarOpen = false;
      console.log($scope.branch);
      $scope.onSetCurrentPageHandler();
      // if(target == 'followUp') {
      //     $scope.getFollowUpListData('onLoad')
      // }
      // if(target == 'checkIn') {
      //     $scope.getCheckInListData('onLoad')
      // }
    }
  }
  
  $scope.tmpstockList=[];
  $scope.filterstock = function(search)
  {
    search = search.toLowerCase();
    // $scope.tmpstockList=$scope.productStock;
    console.log($scope.productStock);
    
    console.log(search);
    $scope.productStock = [];
    console.log($scope.productStock);
    console.log($scope.tmpstockList);
    
    $scope.productStock = $scope.tmpstockList.filter(row=>row.product_description.includes(search) || row.product_code.toLowerCase().includes(search));
    
    console.log($scope.productStock);
    
    
    // console.log(searchArray);
    
  }
  
  $scope.stock_popover='';
  
  $ionicModal.fromTemplateUrl('stock-model', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.stock_popover = modal;
  });
  
  $scope.stockModel = function() {
    console.log("Open stock Popever");
    $scope.stock_popover.show();
  };
  $scope.stockCloseModel = function() {
    $scope.stock_popover.hide();
  };
  ///////  SFA STOCK END /////////////
  
  
})





