var app = angular.module('todoapp', ['ionic']);

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

app.controller('ListaCtrl', function($scope) {

  // Creamos una variable tarefas que es un arreglo
  $scope.tarefas = [
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

  // Metodo concluir para activar el boton, indice es la posicion del objeto dentro del arreglo
  $scope.concluir = function(indice) {
    $scope.tarefas(indice).feita = true;
  }

  $scope.apagar = function(indice) {
    $scope.tarefas.splice(indice, 1);
  }

});
