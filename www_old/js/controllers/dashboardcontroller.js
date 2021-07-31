
app.controller('dashboardCtrl', function ($scope, $rootScope, searchSelect, $ionicModal, $state, myRequestDBService, myAllSharedService, myRequestDBService, $ionicLoading, $cordovaSQLite, $ionicPopup, $ionicScrollDelegate, $timeout, $ionicActionSheet, $cordovaImagePicker, Camera, $cordovaFileTransfer, $cordovaGeolocation, $cordovaToast, $location, $window, $ionicPlatform, $ionicHistory, $ionicModal,$stateParams, $ionicPopover,$cordovaAppVersion) {
    
    $scope.goToBackPageHandler = function () {
        $ionicHistory.goBack();
    }
    $scope.dash_filter = {};
    
    $scope.isRequestInProcess;
    $scope.dashboardData = {};
    $scope.team_name = '';
    $scope.team_designation = '';
    $scope.team_emp_code = '';
    $scope.team_branch_name = '';
    $scope.bottomDashboardData = {};
    $scope.salesuserlist = {};
    $scope.user_data = {};
    $scope.loginData = myAllSharedService.loginData;
    $scope.filter_Name = myAllSharedService.loginData.loginName;
    $scope.dashboarddata = {};
    $scope.primaryorder = {};
    $scope.secondaryorder = {};
    $scope.top30 = {};
    $scope.top30order = {};
    $scope.top30activity = {};
    $scope.modelwiseopen='week';
    // $scope.modelplanopen='order';
    // $scope.modelcategoryopen='week';
    $scope.modelplan='week';
    $scope.leadTabs='All';
    $scope.userTabs='MY';
    $scope.statewise = {};
    $scope.categorywise = {};
    $scope.currentDate = moment().format('DD-MM-YYYY');
    $scope.currentMonth = moment().format('MM');
    $scope.currentYear = moment().format('YYYY');
    $scope.startDate = '1' + '-' + $scope.currentMonth + '-' + $scope.currentYear;
    
    console.log($scope.startDate);
    $scope.user_filter = '';
    console.log(myAllSharedService.loginData);
    console.log($scope.currentDate);
    console.log($scope.currentMonth);
    
    $scope.uploadURL = uploadURL;
    console.log($scope.loginData);
    
    $scope.SELECTED_TAB_DATA = function(selected_tab)
    {
        $scope.onModifyhandler('order');
        $scope.onModifycategoryhandler();
        $scope.AllLead('All');
        $scope.alldashboarddata();
        $scope.primaryorderdata();
        $scope.seconadryorderdata();
        $scope.topdealers();
        $scope.categorywisechart();
        $scope.get_latest_activity();
        
        console.log($scope.dash_filter);
        console.log(myAllSharedService.loginData.team_List);
        if ($scope.dash_filter.date_from && $scope.dash_filter.date_to)
        {
            $scope.dash_filter.date_from = moment($scope.dash_filter.date_from).format('YYYY-MM-DD');
            $scope.dash_filter.date_to = moment($scope.dash_filter.date_to).format('YYYY-MM-DD');
        }
        else
        {
            $scope.dash_filter.date_from = null;
            $scope.dash_filter.date_to = null;
        }
        
        $scope.dash_filter.dashboard_type = selected_tab;
        
        if (myAllSharedService.loginData.team_List.length != 0) {
            // console.log('array filled');
            $scope.dealerWiseChart();
            $scope.direct_Indirect_Report();
            $scope.allBottomDashboardData();
        }
    }
    
    $scope.alldashboarddata= function() {
        
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>'
        });
        
        // $scope.data.date_from = moment($scope.dash_filter.date_from).format('YYYY-MM-DD');
        // $scope.data.date_to = moment($scope.dash_filter.date_to).format('YYYY-MM-DD');
        
        // var filter = { 'userId': id, 'date_from': id, 'date_to': id, };
        myRequestDBService.sfaPostreportRequest("/App_Dashboard/getTopDashboardCount/"+myAllSharedService.loginData.loginId,$scope.dash_filter).then(function (response) {
            console.log(response);
            $scope.dashboarddata=response['data'];
            $scope.user_data = response.data.user_list;
            console.log($scope.dashboarddata);
            console.log($scope.user_data);
            $ionicLoading.hide();
        });
    }
    
    $scope.direct_Indirect_Report= function() {
        myRequestDBService.sfaPostreportRequest("/App_Dashboard/Direct_indirect_reportee/" + myAllSharedService.loginData.loginId, $scope.dash_filter).then(function (response) {
            console.log(response);
            $scope.Direct_assigned_reportee = response.direct_assign;
            $scope.InDirect_assigned_reportee = response.indirect_assign;
        });
    }
    
    $scope.get_latest_activity = function() {
        myRequestDBService.sfaPostreportRequest("/App_Dashboard/get_latest_activity/" + myAllSharedService.loginData.loginId, $scope.dash_filter).then(function (response) {
            console.log(response);
            $scope.today_activity = response;
            console.log($scope.today_activity);
        });
    }
    
    $scope.allBottomDashboardData= function() {
        // console.log(user_type);
        // console.log(id);
        // console.log(myAllSharedService.loginData.loginId);
        myRequestDBService.sfaPostreportRequest("/App_Dashboard/getBottomDashboardData/" + myAllSharedService.loginData.loginId, $scope.dash_filter).then(function (response) {
            console.log(response);
            $scope.bottomDashboardData=response;
            console.log($scope.bottomDashboardData);
        });
    }
    
    $scope.primaryorderdata= function() {
        // console.log(myAllSharedService.loginData.loginId);
        // console.log(date);
        // console.log(id);
        myRequestDBService.sfaPostreportRequest("/App_Dashboard/orderCount/" + myAllSharedService.loginData.loginId + "/primary", $scope.dash_filter).then(function (response) {
            console.log(response);
            $scope.primaryorder=response;
            console.log($scope.primaryorder);
        });
    }
    
    $scope.seconadryorderdata= function() {
        console.log(myAllSharedService.loginData.loginId);
        myRequestDBService.sfaPostreportRequest("/App_Dashboard/orderCount/" + myAllSharedService.loginData.loginId + "/secondary", $scope.dash_filter).then(function (response) {
            console.log(response);
            $scope.secondaryorder=response;
        });
    }
    
    $scope.statewisechart= function(datetype) {
        console.log(myAllSharedService.loginData.loginId);
        myRequestDBService.sfaPostreportRequest("/App_Dashboard/stateWiseSale/"+myAllSharedService.loginData.loginId,{'date':datetype}).then(function (response) {
            console.log(response);
            $scope.statewise=response['data'];
            var element =[];
            var element1 =[];
            
            for (let index = 0; index < $scope.statewise.length; index++) {
                element.push($scope.statewise[index].name);
                element1.push($scope.statewise[index].order_count);
            }
            console.log(element);
            console.log(element1);
            $scope.labels=element;
            $scope.data=element1;
        });
    }
    
    $scope.categorywisechart= function() {
        // console.log(datetype);
        console.log(myAllSharedService.loginData.loginId);
        myRequestDBService.sfaPostreportRequest("/App_Dashboard/categoryWiseSale/" + myAllSharedService.loginData.loginId, $scope.dash_filter).then(function (response) {
            console.log(response);
            $scope.categorywise=response['data'];
            // var element2 =[];
            // var element3 =[];
            // console.log($scope.categorywise);
            // for (let index = 0; index < $scope.categorywise.length; index++) {
            //     element2.push($scope.categorywise[index].name);
            //     element3.push($scope.categorywise[index].order_count);
            // }
            
            // $scope.labels1=element2;
            // $scope.data1=[element3];
            
            // console.log(element3);
            // console.log(element2);
            // console.log();
            
            Highcharts.chart('ccontainer', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}</b>'
                },
                accessibility: {
                    announceNewData: {
                        enabled: false
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}:{point.y}'
                        }
                    }
                },
                series: [ 
                    {
                        data: $scope.categorywise
                    },
                ]
            });
        });
    }
    
    $scope.dealer_data=[];
    $scope.dealerWiseChart= function() {
        // console.log(myAllSharedService.loginData.loginId);
        myRequestDBService.sfaPostreportRequest("/App_Dashboard/productive_graph/" + myAllSharedService.loginData.loginId, $scope.dash_filter).then(function (response) {
            console.log(response);
            $scope.dealerWiseGraph=response['productive_graph'];
            console.log($scope.dealerWiseGraph);
            var order_element =[];
            var activity_element =[];
            var dealer_name =[];
            console.log($scope.dealerWiseGraph);
            for (let index = 0; index < $scope.dealerWiseGraph.length; index++) {
                order_element.push(parseInt($scope.dealerWiseGraph[index].order_count));
                activity_element.push(parseInt($scope.dealerWiseGraph[index].activity_count));
                dealer_name.push($scope.dealerWiseGraph[index].name);
            }
            
            Highcharts.chart('container', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    
                    categories:dealer_name,
                    
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ' millions'
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Total Activity',
                    data: activity_element
                }, {
                    name: 'Total Order',
                    data: order_element
                }]
            });
            
        });
    }
    
    $scope.lead_data = [];
    $scope.AllLead = function (status) {
        
        $scope.leadTabs=status;
        // console.log(user_type);
        $scope.lead_data = [];
        // console.log(id);
        // console.log(type);
        // var parameter = { function_name: 'DASHBOARD_LEAD_COUNT','status':status,'dashboard_type':$scope.dash_filter.tabSelected};
        
        $scope.dash_filter.function_name = "DASHBOARD_LEAD_COUNT";
        $scope.dash_filter.status = status;
        myRequestDBService.sfaPostServiceRequest("/Okaya_LMS/getPostData", $scope.dash_filter).then(function (response) {
            console.log(response);
            $scope.lead_data=response['data'];
            console.log($scope.lead_data);
            console.log($scope.lead_data);
            
            Highcharts.chart('container1', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                accessibility: {
                    announceNewData: {
                        enabled: true
                    }
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                    
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}'
                        }
                    }
                },
                
                tooltip: {
                    // headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                },
                series: [ 
                    {
                        data: $scope.lead_data
                    },
                ]
            });
        });
    }
    
    $scope.orderwisechart= function(datetype) {
        console.log(myAllSharedService.loginData.loginId);
        myRequestDBService.sfaPostreportRequest("/App_Dashboard/getOrderGraph/"+myAllSharedService.loginData.loginId+'/primary',{'graph_type':datetype}).then(function (response) {
            console.log(response);
            $scope.orderWise=response['data'];
            var element4 =[];
            var element5 =[];
            console.log($scope.orderWise);
            
            for (let index = 0; index < $scope.orderWise.length; index++) {
                element4.push($scope.orderWise[index].name);
                element5.push($scope.orderWise[index].order_count);
            }
            
            console.log(element4);
            console.log(element5);
            $scope.labels2=element4;
            $scope.data2=element5;
        });
    }
    
    $scope.topdealers= function() {
        console.log(myAllSharedService.loginData.loginId);
        myRequestDBService.sfaPostreportRequest("/App_Dashboard/topThirty/" + myAllSharedService.loginData.loginId, $scope.dash_filter).then(function (response) {
            console.log(response);
            $scope.top30=response;
            $scope.top30order = $scope.top30.orderWise;
            $scope.top30activity= $scope.top30.activityWise;
            console.log($scope.top30order);
            console.log($scope.top30activity);
            
        });
    }
    
    $scope.UserID =[];
    $scope.UserListData = [];
    $scope.getUserList = function ()
    {
        $scope.UserListData = myAllSharedService.loginData.team_List;
        console.log($scope.UserListData);
    }
    
    $scope.getUserList_id = function (evt,id)
    {
        console.log('xyz');
        console.log(evt);
        console.log(id);
        console.log($scope.UserListData);
        
        if (evt)
        {
            $scope.UserID.push(id);
        }
        else 
        {
            var index = $scope.UserID.findIndex(n=>n == id);
            $scope.UserID.splice(index, 1);
        }
        console.log($scope.UserID);
    }
    
    $scope.user_branch =[];
    $scope.getUserBranch = function ()
    {
        $scope.user_branch = myAllSharedService.loginData.user_branch;
        console.log($scope.user_branch);
        
    }
    
    $scope.onModifyhandler=function(){
        // console.log(type);
        // $scope.modelplanopen=type;
        $scope.topdealers();
    }
    
    $scope.onModifycategoryhandler=function(){
        // console.log(type);
        // $scope.modelcategoryopen=type;
        $scope.categorywisechart();
    }
    
    $scope.showAlert = function(){
        console.log("Open Popever");
        $scope.user_filter.show();
    };
    
    $scope.dashboardFilter = false;
    $scope.filter = function (value) {
        $scope.dashboardFilter = value;
        if($scope.dash_filter.dashboard_type=='Team')
        {
            $scope.dash_filter.type = 'User';
        }
        else
        {
            $scope.dash_filter.type = 'Branch';
        }
        console.log($scope.dash_filter.type);
        
        $scope.getUserList();
        $scope.getUserBranch();
    }
    
    $scope.clearFilter = function()
    {
        $scope.dash_filter.date_from = null;
        $scope.dash_filter.date_to = null;
        $scope.dash_filter.uid = null;
        $scope.dash_filter.branch = null;
        
        $scope.SELECTED_TAB_DATA($scope.dash_filter.dashboard_type)
        
        $scope.team_name = '';
        $scope.team_designation = '';
        $scope.team_emp_code = '';
        $scope.team_branch_name = '';
    }
    
    $scope.filterDetail = function(name,designation,emp_code)
    {
        console.log(name);
        $scope.team_name = name;
        $scope.team_designation = designation;
        $scope.team_emp_code = emp_code;
    }
    
    $scope.filterbranch = function(branch_name)
    {
        console.log(branch_name);
        $scope.team_branch_name = branch_name;
        console.log($scope.team_branch_name);
    }
    
    if ($location.path() == '/tab/report-dashboard') 
    {
        if (window.StatusBar) 
        {
            StatusBar.show();
            StatusBar.backgroundColorByHexString("#000");
            StatusBar.overlaysWebView(false);
        }
        
        if ($scope.loginData.loginId)
        {
            $scope.SELECTED_TAB_DATA('MY');
        }
        
        
        $ionicPopover.fromTemplateUrl('user-filter', {
            scope: $scope,
        }).then(function(popovers) {
            $scope.user_filter = popovers;
        });
    }
    
    
    
})



// $scope.onModifyproductivehandler=function(type){
//     console.log(type);
//     $scope.modelcategoryopen=type;
//     $scope.dealerWiseChart(type);
// }



// $scope.onModifystatehandler=function(type){
//     console.log(type);
//     $scope.modelwiseopen=type;
//     $scope.statewisechart(type);
// }

// $scope.onModifyTypeHandler=function(type){
//     console.log(type);
//     $scope.modelplan=type;
//     $scope.primaryorderdata(type);
//     $scope.seconadryorderdata(type);
//     $scope.topdealers();
// }

// $scope.onClickLeadTabs=function(id,type,tab){
//     console.log(type);
//     $scope.leadTabs=type;
//     $scope.AllLead(id,type,tab);
// }

// $scope.onUserTabs=function(id,user_type){
//     console.log(user_type);
//     console.log(id);
//     console.log(myAllSharedService.loginData.loginId);
//     $scope.userTabs=user_type;
//     if (myAllSharedService.loginData.team_List.length != 0) 
//     {
//         console.log('array filled');
//         $scope.onModifyproductivehandler('',myAllSharedService.loginData.loginId,user_type);
//         $scope.direct_Indirect_Report(myAllSharedService.loginData.loginId,user_type);
//         $scope.allBottomDashboardData(myAllSharedService.loginData.loginId,user_type);
//         // $scope.dealerWiseChart('',myAllSharedService.loginData.loginId,user_type);

//     }
//     $scope.AllLead('All');
//     $scope.alldashboarddata();
//     $scope.primaryorderdata('',myAllSharedService.loginData.loginId,user_type);
//     $scope.seconadryorderdata('',myAllSharedService.loginData.loginId,user_type);
//     $scope.topdealers();
//     $scope.categorywisechart('',myAllSharedService.loginData.loginId,user_type);
//     $scope.get_latest_activity(myAllSharedService.loginData.loginId,user_type);
// }

// $scope.allFilter=function()
// {

//     console.log($scope.dash_filter);
//     // console.log($scope.UserID);
//     // if (myAllSharedService.loginData.team_List.length != 0) 
//     // {
//     console.log('all filled');
//     //     $scope.onModifyproductivehandler('',user_type);
//     //     $scope.direct_Indirect_Report(user_type);
//     //     $scope.allBottomDashboardData(user_type);

//     // }
//     // $scope.AllLead('All',user_type);
//     $scope.alldashboarddata();
//     // $scope.primaryorderdata('',user_type);
//     // $scope.seconadryorderdata('',user_type);
//     // $scope.topdealers(user_type);
//     // $scope.categorywisechart('',user_type);
//     // $scope.get_latest_activity(user_type);


//     // console.log(id);
//     // $scope.alldashboarddata(id);
//     // $scope.primaryorderdata('',id);
//     // $scope.seconadryorderdata('',id);
//     // $scope.topdealers(id);
//     // $scope.categorywisechart('',id);
//     // $scope.allBottomDashboardData(id);
//     // $scope.dealerWiseChart(id);
// }

// $scope.LoadSessionData=function(val)
// {
//     console.log(val);
//     $scope.selectedVal=val;
// };