var app_angular= angular.module('PedidosOnline');

app_angular.controller("TercerosController",['Conexion','$scope','$http',function (Conexion,$scope,$http) {
	// body...
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	$scope.usuario=$scope.sessiondate.nombre_usuario;
    $scope.codigoempresa=$scope.sessiondate.codigo_empresa;
    $scope.direccionMaps;
	$scope.correoDescripcion=[];
	$scope.terceros = [];
	$scope.terceroSeleccionado=[];
	$scope.terceroDetalles=[];
    CRUD.select('select*from erp_terceros order by razonsocial LIMIT 50',function(elem) {$scope.terceros.push(elem)});
    
	$scope.ConsultarDatos =function(tercero){
		$scope.terceroSeleccionado=tercero;
	}
	$scope.abrirModal=function(tercero){
		$('#terceroOpenModal').click();
		$scope.ConsultarDatos(tercero);
	}
	$scope.abrirModalEmail=function(){
		$('#terceroOpenModalEmail').click();
	}
	$scope.Refrescar =function(){
    	CRUD.selectAll('select*from erp_terceros order by razonsocial LIMIT 50',function(elem) {$scope.terceros.push(elem)});
		$scope.Search = '';
	}
	
	$scope.enviarCorreo=function(){
		$scope.correoDescripcion.para=$scope.terceroDetalles.email;
		$scope.url='http://demos.pedidosonline.co/Mobile/enviarCorreo?usuario='+$scope.usuario+'&codigo_empresa=' + $scope.codigoempresa + '&datos=' + JSON.stringify($scope.correoDescripcion);
	}
	$scope.Request=function(url){
        
        var responsePromise =$http.get(url);
        responsePromise.success(function(data) {
        	Mensajes('Correo Enviado Correctamente','success','');
        });
        responsePromise.error(function() {
            function error(err) {Mensajes('Error al Subir El Pedido','error','');return }
        });
    }
}]);



