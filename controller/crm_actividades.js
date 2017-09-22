'use strict';


var app_angular= angular.module('PedidosOnline');

app_angular.controller("actividadesController",['Conexion','$scope', '$routeParams',function (Conexion,$scope,$routeParams) {
	$scope.Search;
	$scope.registro=[];
	$scope.registro.rowid=1000;
	$scope.registro.tipo='Cobro';
	$scope.registro.tema='Prueba';
	$scope.registro.ind_prioridad='Alta';
	$scope.registro.rowid_estado='1001';
	$scope.registro.descripcion='adsasdasdasd';
	$scope.registro.tipo_relacion='Otros';
	$scope.registro.fecha_inicial='//Date1462301285000';
	$scope.registro.fecha_final='//Date1462992485000';
	//CRUD.insert('crm_actividades',$scope.registro);

	$scope.terceroSelected;
	$scope.terceroDeTercero=$routeParams.personId;
	CRUD.select('select * from erp_terceros ',
		function(elem)
		{
			$scope.list_tercero.push(elem);
			if ($scope.terceroDeTercero!=undefined   && elem.rowid==$scope.terceroDeTercero) 
			{
				$scope.terceroSelected=elem
				//$scope.Search=$scope.terceroSelected.razonsocial;
				$('#fc_create').click();
			}
		})
	
	

	
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	
	$scope.list_tercero=[];
	
	$scope.horario=[];
	$scope.CurrentDate=function(){
		$scope.day;
		$scope.DayNow=Date.now();
		$scope.YearS=$scope.DayNow.getFullYear();
		$scope.MonthS=$scope.DayNow.getMonth()+1;
		if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
		$scope.DayS=$scope.DayNow.getDate();
		$scope.HourS=$scope.DayNow.getHours();
		$scope.MinuteS=$scope.DayNow.getMinutes();
		if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
		$scope.day=$scope.YearS+'/'+$scope.MonthS+'/'+$scope.DayS+' '+$scope.HourS+':'+$scope.MinuteS;
		return $scope.day;
	}
	$scope.selectedDate=function(day){
		$scope.day;
		$scope.DayNow=new Date(day);
		$scope.YearS=$scope.DayNow.getFullYear();
		$scope.MonthS=$scope.DayNow.getMonth()+1;
		if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
		$scope.DayS=$scope.DayNow.getDate();
		$scope.HourS=$scope.DayNow.getHours();
		$scope.MinuteS=$scope.DayNow.getMinutes();
		if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
		$scope.day=$scope.YearS+'-'+$scope.MonthS+'-'+$scope.DayS;
		return $scope.day;
	}
	$scope.getHour=function(day){
		$scope.day;
		$scope.DayNow=new Date(day);
		$scope.YearS=$scope.DayNow.getFullYear();
		$scope.MonthS=$scope.DayNow.getMonth()+1;
		
		$scope.DayS=$scope.DayNow.getDate();
		$scope.HourS=$scope.DayNow.getHours();
		$scope.MinuteS=$scope.DayNow.getMinutes();
		if ($scope.MinuteS<10) {$scope.MinuteS='0'+$scope.MinuteS}
		if ($scope.HourS<10) {$scope.HourS='0'+$scope.HourS}
		$scope.day=$scope.HourS+':'+$scope.MinuteS;
		return $scope.day;
	}
	$scope.ultimoRegistro=[];
	$scope.events=[];
	$scope.actividades=[];
	$scope.eventSources=[];
	$scope.fechainicial;
	$scope.fechafinal;
	$scope.NuevoEvento=[];
	$scope.listActividadTipo=[];
	$scope.listActividadTipoRelacion=[];
	$scope.listActividadPrioridad=[];
	$scope.listEstadoActividad=[];
	$scope.actividadesDia=[];
	$scope.actividadSelected=[];
	$scope.actividad=[];
	CRUD.select('select * from m_estados where  tipo_estado="ACTIVIDAD"',function(elem){$scope.listEstadoActividad.push(elem)});
	CRUD.select('select * from m_metaclass where  class_code="ACTIVIDAD.TIPO.RELACION" and tipo_reg_nombre="Cliente"',function(elem){$scope.listActividadTipoRelacion.push(elem)});
	CRUD.select('select * from m_metaclass where  class_code="ACTIVIDAD.PRIORIDAD"',function(elem){$scope.listActividadPrioridad.push(elem)});
	CRUD.select('select * from m_metaclass where  class_code="ACTIVIDAD.TIPO"',function(elem){$scope.listActividadTipo.push(elem)});
	$scope.RefrescarVista=function(){


		$scope.eventSources=[];
		$scope.events=[];
		CRUD.selectAllinOne('select rowid,  fecha_inicial, fecha_final,tema,ind_prioridad from crm_Actividades',
		function(elem){
			for (var i = 0; i < elem.length; i++) {
				$scope.actividades.push(elem[i]);
				//hora Inicial
				$scope.fechainicial=new Date(elem[i].fecha_inicial);
				//Hora Final
				$scope.fechafinal=new Date(elem[i].fecha_final);
				if (elem[i].ind_prioridad=='Alta') {
					$scope.events.push({id:elem[i].rowid,title:elem[i].tema,start:new Date(elem[i].fecha_inicial),end:new Date(elem[i].fecha_final),color:'red'})	
				}
				else if (elem[i].ind_prioridad=='Media') {
					$scope.events.push({id:elem[i].rowid,title:elem[i].tema,start:new Date(elem[i].fecha_inicial),end:new Date(elem[i].fecha_final),color:'orange'})	
				}
				else{
					$scope.events.push({id:elem[i].rowid,title:elem[i].tema,start:new Date(elem[i].fecha_inicial),end:new Date(elem[i].fecha_final),color:'blue'})	
				}
			}
			$scope.eventSources=$scope.events;
			angular.element('#calendar1').fullCalendar('removeEvents');
			angular.element('#calendar1').fullCalendar( 'addEventSource', $scope.eventSources )
			angular.element('#calendar1').fullCalendar('rerenderEvents');
		})
	}
	$scope.abrirModal=function(){
		$('#fc_create').click();
	}
	var options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 18000000};
	var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	$scope.Latitude='';
    $scope.Longitud='';
    function onSuccess(position)
    {
    }
    function onError(error)
    {
        Mensajes("Por favor habilitar la Ubicacion.",'information');
    }
    function rand_code(chars, lon){
		var code = "";
		for (var x=0; x < lon; x++)
		{
			var rand = Math.floor(Math.random()*chars.length);
			code += chars.substr(rand, 1);
		}
		return code;
	}

	var caracteres = "0123456789abcdefghijklmnopqrstvwxyz";
	$scope.GuardarAc=function()
	{
		$scope.ultimoRegistro=[];
		CRUD.select('select max(rowid) as rowid from crm_actividades',function(elem){
			$scope.NuevoEvento.rowid=elem.rowid+1;
			$scope.NuevoEvento.usuario_creacion=$scope.sessiondate.nombre_usuario;
			$scope.NuevoEvento.relacionado_a=$scope.terceroSelected.razonsocial;
			$scope.NuevoEvento.sincronizado='false';
			$scope.NuevoEvento.fecha_inicial=$scope.selectedDate($scope.horario.fechaInicial)+' '+$scope.getHour($scope.horario.horaInicial) ;
			$scope.NuevoEvento.fecha_final=$scope.selectedDate($scope.horario.fechaFinal)+' '+$scope.getHour($scope.horario.horaFinal) ;
			$scope.NuevoEvento.fecha_creacion=$scope.CurrentDate();
			$scope.NuevoEvento.longitud=$scope.Longitud;
			$scope.NuevoEvento.latitud=$scope.Latitude;
			$scope.NuevoEvento.codigo_reg=rand_code(caracteres,20);
			CRUD.insert('crm_actividades',$scope.NuevoEvento)
			$scope.NuevoEvento=[];
			$scope.RefrescarVista();
		})
        $('#CerrarModalActiviadad').click();
        Mensajes('Actividad Nueva Creada','success','');
	}
	$scope.guardarActividad=function(){
		var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
		$scope.Latitude='';
	    $scope.Longitud='';
	    function onSuccess(position)
	    {
	    	$scope.Latitude=position.coords.latitude;
            $scope.Longitud= position.coords.longitude;
            $scope.GuardarAc();
	    }
	    function onError(error)
	    {
			$scope.GuardarAc();
	    }
	}
	$scope.onchangeFecha=function(parm)
	{
		$scope.params=[];
		$scope.params.fecha1=$scope.horario.fechaInicial;
		$scope.params.fecha2=$scope.horario.fechaFinal;
		$scope.params.hora1=$scope.horario.horaInicial;
		$scope.params.hora2=$scope.horario.horaFinal;
		if (parm=='Inicial') {
			
			if ($scope.params.fecha2!=undefined) {
				$scope.params.fecha1=$scope.selectedDate($scope.params.fecha1)
				$scope.params.fecha2=$scope.selectedDate($scope.params.fecha2)
				$scope.params.fecha1=$scope.params.fecha1.replace('-','')
				$scope.params.fecha2=$scope.params.fecha2.replace('-','')
				$scope.params.fecha1=$scope.params.fecha1.replace('-','')
				$scope.params.fecha2=$scope.params.fecha2.replace('-','')
				if ($scope.params.fecha1>$scope.params.fecha2) {
					Mensajes('Fecha Inicial No puede ser Mayor','error','');
					document.getElementById("fechaInicial").valueAsDate = null;
					$scope.horario.fechaInicial='';
				}	
			}
		}else if (parm=='Final') {
			if ($scope.params.fecha1!=undefined) {
				$scope.params.fecha1=$scope.selectedDate($scope.params.fecha1)
				$scope.params.fecha2=$scope.selectedDate($scope.params.fecha2)
				$scope.params.fecha1=$scope.params.fecha1.replace('-','')
				$scope.params.fecha2=$scope.params.fecha2.replace('-','')
				$scope.params.fecha1=$scope.params.fecha1.replace('-','')
				$scope.params.fecha2=$scope.params.fecha2.replace('-','')
				if ($scope.params.fecha1>$scope.params.fecha2) {
					Mensajes('Fecha Final No puede ser menor','error','');
					document.getElementById("fechaFinal").valueAsDate = null;
					$scope.horario.fechaFinal='';
				}	
			}
		}else if (parm=='HInicial') {
			
			if ($scope.params.hora2!=undefined) {
				if ($scope.params.fecha2==undefined || $scope.params.fecha1==undefined) {
					Mensajes('Seleccionar Fechas Primero','error','');
					$scope.horario.horaInicial='';
					return
				}
				$scope.params.fecha1=$scope.selectedDate($scope.params.fecha1)
				$scope.params.fecha2=$scope.selectedDate($scope.params.fecha2)
				$scope.params.fecha1=$scope.params.fecha1.replace('-','')
				$scope.params.fecha2=$scope.params.fecha2.replace('-','')
				$scope.params.fecha2=$scope.params.fecha2.replace('-','')
				$scope.params.fecha1=$scope.params.fecha1.replace('-','')
				if ($scope.params.fecha1==$scope.params.fecha2) {
					$scope.params.hora1=$scope.getHour($scope.params.hora1);
					$scope.params.hora2=$scope.getHour($scope.params.hora2);
					$scope.params.hora2=$scope.params.hora2.replace(':','')
					$scope.params.hora1=$scope.params.hora1.replace(':','')
					if ($scope.params.hora1>$scope.params.hora2) {
						Mensajes('Hora inicial no puede ser Mayor el mismo dia','error','');
						$scope.params.hora1=$scope.horario.horaInicial='';
						return
					}	
				}
			}
		}else if (parm=='HFinal') {
			if ($scope.params.hora1!=undefined) {
				if ($scope.params.fecha2==undefined || $scope.params.fecha1==undefined) {
					Mensajes('Seleccionar Fechas Primero','error','');
					$scope.horario.horaFinal='';
					return
				}
				$scope.params.fecha1=$scope.selectedDate($scope.params.fecha1)
				$scope.params.fecha2=$scope.selectedDate($scope.params.fecha2)
				$scope.params.fecha1=$scope.params.fecha1.replace('-','')
				$scope.params.fecha2=$scope.params.fecha2.replace('-','')
				$scope.params.fecha2=$scope.params.fecha2.replace('-','')
				$scope.params.fecha1=$scope.params.fecha1.replace('-','')
				if ($scope.params.fecha1==$scope.params.fecha2) {
					$scope.params.hora1=$scope.getHour($scope.params.hora1);
					$scope.params.hora2=$scope.getHour($scope.params.hora2);
					$scope.params.hora2=$scope.params.hora2.replace(':','')
					$scope.params.hora1=$scope.params.hora1.replace(':','')
					if ($scope.params.hora1>$scope.params.hora2) {
						Mensajes('Hora Final no puede ser menor  el mismo dia','error','');
						$scope.params.hora1=$scope.horario.horaFinal='';
					}	
				}
				
			}
		}
	}
	//Variables Auxiliares
	var started;
    var categoryClass;
    var ended;
	$scope.eventSources=$scope.events;
	$scope.calOptions={
		editable:true,
		selectable: true,
		selectHelper: true,
		header:{
			left:'prev,next today',
			center:'title',
			right:'month,agendaWeek,agendaDay',
			
		},
		select:function(start,end,allDay){
			$('#fc_View').click();
			$scope.ConsultarDia(end);

		},
        eventClick: function (calEvent, jsEvent, view) {
            $('#fc_ViewEvent').click();
            $scope.actividadesDia=[];
			$scope.actividad=[];
			CRUD.select("select * from vw_actividades_usuario where rowid= '"+calEvent.id+"' ",function(elem){
				
				if (elem.canal=='null') 
				{
					elem.condicion=false;
				} 
				$scope.actividad=elem;
			});
            //CRUD.selectParametro('crm_actividades','rowid',calEvent.id,function(elem){$scope.actividadSelected.push(elem);$scope.actividad=$scope.actividadSelected[0]});


        }
	}
	$scope.ActualizarActividad=function()
	{
		var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
		$scope.Latitude='';
	    $scope.Longitud='';
	    function onSuccess(position)
	    {
	    	$scope.Latitude=position.coords.latitude;
            $scope.Longitud= position.coords.longitude;
            CRUD.Updatedynamic("update crm_actividades set longitud='"+$scope.Longitud+"',latitud='"+$scope.Latitude+"',sincronizado='false',tema='"+$scope.actividad.tema+"',relacionado_a='"+$scope.actividad.relacionado_a+"',ind_prioridad='"+$scope.actividad.ind_prioridad+"',descripcion='"+$scope.actividad.descripcion+"',rowid_estado='"+$scope.actividad.rowid_estado+"'  where rowid='"+$scope.actividad.rowid+"'");
			$scope.RefrescarVista();
			$('#closemodalact').click();
	    }
	    function onError(error)
	    {
			CRUD.Updatedynamic("update crm_actividades set sincronizado='false',tema='"+$scope.actividad.tema+"',relacionado_a='"+$scope.actividad.relacionado_a+"',ind_prioridad='"+$scope.actividad.ind_prioridad+"',descripcion='"+$scope.actividad.descripcion+"',rowid_estado='"+$scope.actividad.rowid_estado+"'  where rowid='"+$scope.actividad.rowid+"'");
			$scope.RefrescarVista();
			$('#closemodalact').click();
	    }

	}
	$scope.ConsultarDia=function(day){
		var Day=new Date(day);
		var YearS=Day.getFullYear();
		var MonthS=Day.getMonth()+1;
		if (MonthS<10) {MonthS='0'+MonthS}
		var DayS=Day.getDate();
		if (DayS<10) {DayS='0'+DayS}
		
		day=YearS+''+MonthS+''+DayS;
		$scope.actividadesDia=[];
		//var query="select  tema,descripcion,fecha_inicial,fecha_final ,replace(fecha_inicial,'-','') as fecha_inicialF,replace(fecha_final,'-','') as fecha_finalF from crm_actividades ";
		CRUD.select("select*from vw_actividades_dia",function(elem){
			var f1 = elem.fecha_inicialF.slice(0,8);
			var f2 = elem.fecha_finalF.slice(0,8);
			f1.replace(' ','');
			f2.replace(' ','');
			if (f1<=day) {
				if (f2>=day) {
					if (elem.canal=='null') 
					{
						elem.condicion=false;
					}
					$scope.actividadesDia.push(elem);
				}
			}
		})
	}
}]);

