// Creamos una variable llamada app
var app = angular.module('todoapp', ['ionic']);

// Creamos el metodo config donde van a estar los estados
app.config(function($stateProvider, $urlRouterProvider) {

  // Crear el estado list
  $stateProvider.state('list', {
    //  cache:Se utiliza para actualizar mi lista cuando ingreso una nueva tarefa
    cache: false,
    url: '/list',
    templateUrl: 'templates/lista.html'
  });

  // Crear el estado new
  $stateProvider.state('new', {
    url: '/new',
    templateUrl: 'templates/novo.html',
    controller: 'NovoCtrl'
  });

  // Crear el estado edit
  $stateProvider.state('edit', {
    url: '/edit/:indice',
    pageTitle: 'Editar',
    templateUrl: 'templates/novo.html',
    controller: 'EditCtrl'
  });

  // Crear el estado login
  $stateProvider.state('login', {
    url: '/login',
    pageTitle: 'Login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  });


  // El estado inicial sera login
  $urlRouterProvider.otherwise('/login');
  
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

app.controller('ListaCtrl', function($scope, $state, TarefaService, TarefaWebService) {

  // Creamos una variable tarefas que es un arreglo y le asignamos los valores creados arriba en tarefas
  // $scope.tarefas = TarefaWebService.lista();

  TarefaWebService.lista().then(function(dados) {
    $scope.tarefas = dados;
  });

  // Metodo concluir para activar el boton, indice es la posicion del objeto dentro del arreglo
  $scope.concluir = function(indice, tarefa) {
    tarefa.feita = true;
    TarefaWebService.concluir(indice, tarefa).then(function() {
        TarefaWebService.lista().then(function(dados) {
          $scope.tarefas = dados;
        });     
     });
  }

  $scope.apagar = function(indice) {
    TarefaWebService.apagar(indice).then(function() {
      TarefaWebService.lista().then(function(dados) {
          $scope.tarefas = dados;
      });
    });
  }

  $scope.editar = function(indice) {
    $state.go('edit', {indice : indice});
  }
});

// Crear un nuevo controller llamado NovoCtrl
app.controller('NovoCtrl', function($scope, $state, TarefaWebService) {

  $scope.tarefa = {

    // input type="text" ng-model="texto", el texto sale de esta sentencia
    "texto" : '',
    "data" : new Date(),
    "feita" : false
  };

  // Funcion salvar
  $scope.salvar = function() {

      // esto es para salvar mis datos
      TarefaWebService.inserir($scope.tarefa).then(function() {

        // Este es el estado que quiero cargar al guardar mis datos
        $state.go('list');
      });
  }
});

// Crear un nuevo controller llamado EditCtrl
app.controller('EditCtrl', function($scope, $state, $stateParams, TarefaWebService) {

  $scope.indice = $stateParams.indice;
  //$scope.tarefa = angular.copy(TarefaService.obtem($scope.indice));
  TarefaWebService.obtem($scope.indice).then(function(dados) {
    $scope.tarefa = dados;
  })

  // Funcion salvar
  $scope.salvar = function() {

      // esto es para salvar mis datos
      TarefaWebService.alterar($scope.indice, $scope.tarefa).then(function() {

        // Este es el estado que quiero cargar al guardar mis datos
        $state.go('list');
      }); 
  }
});

// Crear un nuevo controller llamado login
app.controller('LoginCtrl', function($scope, $http, $state, $ionicHistory, $ionicPopup) {
  $scope.usuario = {};
  $scope.login = function() {

    $http.post('http://localhost:3004/api/usuario', $scope.usuario)
      .then(function(response){

      if(response.status == 200){
        window.localStorage.setItem('usuario', JSON.stringify(response.data));

        $ionicHistory.nextViewOptions({

          // Con esto se desactiva el boton <Back
          disableBack: true
         });
        $state.go('list');
      }
    }, function(response){
        $ionicPopup.alert(
          {
              title: 'Falha no acesso',
              template: 'Usuario invalido'
          });
    });
  }
});

// Crear un servicio llamado TarefaService, hay varios metodos para crearlo, vamos a usar factory
app.factory('TarefaService', function() {

    // Variable tarefas que es un arreglo
    var tarefas = JSON.parse(window.localStorage.getItem('db_tarefas') || '[]');

    function persistir() {
      window.localStorage.setItem('db_tarefas', JSON.stringify(tarefas));
    }

    return {

      lista: function() {
        return tarefas;
      },

      obtem: function(indice) {
        return tarefas[indice];
      },

      inserir: function(tarefa) {
        tarefas.push(tarefa);
        persistir();
      },

      alterar: function(indice, tarefa){
        tarefas[indice] = tarefa;
        persistir();
      },

      concluir: function(indice){
        tarefas[indice].feita = true;
        persistir();
      },

      apagar: function(indice) {
        tarefas.splice(indice,1);
        persistir();
      }
    }
});

// Crear un servicio llamado TarefaWebService, hay varios metodos para crearlo, vamos a usar factory
//  Adicionar un servicio $q
app.factory('TarefaWebService', function($http, $q) {

  // Crear una variable llamada url que es mi url local 
  var url = 'http://localhost:3004/api/tarefa';

  // Crear una variable llamada config
  var config = {
    headers: {'Authorization': JSON.parse(window.localStorage.getItem('usuario')).token}
  }

  return {

    lista: function() {

      // Crear una variable deferido
      var deferido = $q.defer();

      $http.get(url, config).then(function(response) {
        // data es la variable que contiene los datos de mi retorno de mi servidor
        deferido.resolve(response.data);
      });

      return deferido.promise;
    },

    obtem: function(indice) {

      // Crear una variable deferido
      var deferido = $q.defer();

      $http.get(url + '/' + indice).then(function(response) {
        // data es la variable que contiene los datos de mi retorno de mi servidor
        deferido.resolve(response.data);
      });

      return deferido.promise;
    },

    inserir: function(tarefa) {

      var deferido = $q.defer();
      $http.post(url, tarefa).then(function() {
        deferido.resolve();
      });
      return deferido.promise;
    },

    alterar: function(indice, tarefa){

      var deferido = $q.defer();

      $http.put(url + '/' + indice, tarefa).then(function() {
        deferido.resolve();
      });
      return deferido.promise;
    },

    concluir: function(indice, tarefa){
      var deferido = $q.defer();

      $http.put(url + '/' + indice, tarefa).then(function() {
        deferido.resolve();
      });
      return deferido.promise;
    },

    apagar: function(indice) {

      var deferido = $q.defer();

      $http.delete(url + '/' + indice).then(function() {
        deferido.resolve();
      });
      return deferido.promise;
    }
  }
});