app_angular.controller("configController",['Conexion','$scope','$route',function (Conexion,$scope,$route) {
	$scope.sincronizacion=window.localStorage.getItem("TIPO_SINCRONIZACION");
	if ($scope.sincronizacion==null || $scope.sincronizacion==undefined || $scope.sincronizacion==NaN) {
		$scope.sincronizacion='AUTOMATICA';
	}
	$scope.$watch('sincronizacion',function(a,b){
		//TIPO_SINCRONIZACION=$scope.sincronizacion;
	})
	$scope.Guardar=function()
	{
		localStorage.removeItem('TIPO_SINCRONIZACION');
		localStorage.setItem('TIPO_SINCRONIZACION',$scope.sincronizacion); 
		Mensajes('Guardado Correctamente','success');
	}
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	$scope.empresa="";
	if ($scope.sessiondate.codigo_empresa==10) 
	{
		$scope.empresa="Produccion REYMON ";
	}
	else if ($scope.sessiondate.codigo_empresa==12) 
	{
		$scope.empresa="Pruebas REYMON";
	}
	else 
	{
		$scope.empresa="Desconocido";
	}
}]);
