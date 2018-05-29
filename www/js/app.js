// Creamos una variable llamada app
var app = angular.module('todoapp', ['ionic']);

// Creamos el metodo config donde van a estar los estados
app.config(function($stateProvider, $urlRouterProvider) {

  // Crear el estado list
  $stateProvider.state('list', {
    url         : '/list',
    templateUrl : 'templates/lista.html'
  });

  // Crear el estado new
  $stateProvider.state('new', {
    url         : '/new',
    templateUrl : 'templates/novo.html',
    controller  : 'NovoCtrl'
  });

  // Crear el estado edit
  $stateProvider.state('edit', {
    url         : '/edit:indice',
    templateUrl : 'templates/novo.html',
    controller  : 'EditCtrl'
  });

  // Esto lo hago por si no se tiene un estado inicial, el cargara el estado list
  $urlRouterProvider.otherwise('/list');
  
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

// Crear una variable tarefas y agregamos la siguiente informacion que es un arreglo
var tarefas = [
  {
    "texto" : "Realizar as atividades do curso",
    "data"  : new Date(),
    "feita" : false
  },
  {
    "texto" : "Passera com o cachorro",
    "data"  : new Date(),
    "feita" : true
  }
];

app.controller('ListaCtrl', function($scope, $state) {

  // Creamos una variable tarefas que es un arreglo y le asignamos los valores creados arriba en tarefas
  $scope.tarefas = tarefas

  // Metodo concluir para activar el boton, indice es la posicion del objeto dentro del arreglo
  $scope.concluir = function(indice) {
    $scope.tarefas(indice).feita = true;
  }

  $scope.apagar = function(indice) {
    $scope.tarefas.splice(indice, 1);
  }

  $scope.editar = function(indice) {
    $state.go('edit', {indice : indice});
  }
});

// Crear un nuevo controller llamado NovoCtrl
app.controller('NovoCtrl', function($scope, $state) {

  $scope.tarefa = {

    // input type="text" ng-model="texto", el texto sale de esta sentencia
    "texto" : '',
    "data"  : new Date(),
    "feita" : false
  };

  // Funcion salvar
  $scope.salvar = function() {

      // esto es para salvar mis datos
      tarefas.push($scope.tarefa);

      // Este es el estado que quiero cargar al guardar mis datos
      $state.go('list');
  }
});

// Crear un nuevo controller llamado EditCtrl
app.controller('EditCtrl', function($scope, $state, $stateParams) {

  $scope.indice = $stateParams.indice;
  $scope.tarefa = tarefas[$scope.indice];

  // Funcion salvar
  $scope.salvar = function() {

      // esto es para salvar mis datos
      tarefas[$scope.indice] =  $scope.tarefa;

      // Este es el estado que quiero cargar al guardar mis datos
      $state.go('list');
  }
});