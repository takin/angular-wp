angular.module('techtalk',['ngRoute','ngAnimate'])
.config(['$locationProvider','$routeProvider','$httpProvider',function($locationProvider, $routeProvider, $httpProvider) {

	$routeProvider.when('/', {
		controller: 'HomeCtrl',
		templateUrl: 'app/public/views/page-category.html'
	})
	.when('/category/:category',{
		controller: 'CategoryCtrl',
		templateUrl: 'app/public/views/page-category.html'
	})
	.when('/:category/:content', {
		controller: 'ContentCtrl',
		templateUrl: 'app/public/views/page-content.html'
	})

	$locationProvider.hashPrefix('!');
	$locationProvider.html5Mode(true);

}])
.run(function ($rootScope){

})
.factory('TechtalkAPI', function ($http, $q, $timeout, $rootScope){

	var _api = 'http://techtalk.web.id/wp-json/';
	var categories = [];
	var posts = [];
	var tags = [];
	var x = '<p>Setelah sekian lama ditunggu, akhirnya pada 8 September kemarin NodeJS Foundation merilis versi baru dari NodeJS. Versi baru ini sekaligus juga menandai awal dari bergabungnya kembali tim NodeJS dengan tim IO.js. Tim IOjs sendiri adalah mantan tim pengembang NodeJS yang sempat membuat versi sendiri. Ada beberapa hal menarik dari rilis [&hellip;]</p> <div class="sharedaddy sd-sharing-enabled"><div class="robots-nocontent sd-block sd-social sd-social-icon-text sd-sharing"><h3 class="sd-title">Share this:</h3><div class="sd-content"><ul><li class="share-facebook"><a rel="nofollow" data-shared="sharing-facebook-3" class="share-facebook sd-button share-icon" href="http://www.techtalk.web.id/yang-baru-dari-nodejs/?share=facebook" target="_blank" title="Bagikan pada Facebook"><span>Facebook</span></a></li><li class="share-twitter"><a rel="nofollow" data-shared="sharing-twitter-3" class="share-twitter sd-button share-icon" href="http://www.techtalk.web.id/yang-baru-dari-nodejs/?share=twitter" target="_blank" title="Klik untuk berbagi pada Twitter"><span>Twitter</span></a></li><li class="share-google-plus-1"><a rel="nofollow" data-shared="sharing-google-3" class="share-google-plus-1 sd-button share-icon" href="http://www.techtalk.web.id/yang-baru-dari-nodejs/?share=google-plus-1" target="_blank" title="Klik untuk berbagi via Google+"><span>Google</span></a></li><li class="share-pinterest"><a rel="nofollow" data-shared="sharing-pinterest-3" class="share-pinterest sd-button share-icon" href="http://www.techtalk.web.id/yang-baru-dari-nodejs/?share=pinterest" target="_blank" title="Klik untuk berbagi pada Pinterest"><span>Pinterest</span></a></li><li class="share-linkedin"><a rel="nofollow" data-shared="sharing-linkedin-3" class="share-linkedin sd-button share-icon" href="http://www.techtalk.web.id/yang-baru-dari-nodejs/?share=linkedin" target="_blank" title="Klik untuk berbagi di Linkedln"><span>LinkedIn</span></a></li><li class="share-end"></li></ul></div></div></div><div class=\'sharedaddy sd-block sd-like jetpack-likes-widget-wrapper jetpack-likes-widget-unloaded\' id=\'like-post-wrapper-99022185-3-55f7819ead49a\' data-src=\'//widgets.wp.com/likes/#blog_id=99022185&amp;post_id=3&amp;origin=www.techtalk.web.id&amp;obj_id=99022185-3-55f7819ead49a\' data-name=\'like-post-frame-99022185-3-55f7819ead49a\'><h3 class=\'sd-title\'>Menyukai ini:</h3><div class=\'likes-widget-placeholder post-likes-widget-placeholder\' style=\'height:55px\'><span class=\'button\'><span>Suka</span></span> <span class="loading">Memuat...</span></div><span class=\'sd-text-color\'></span><a class=\'sd-link-color\'></a></div>';
	var contents = [{id:1, category:'blog', author:'Syamsul Muttaqin', date:'17 September 2015', thumb: 'app/public/images/thumb-1.jpg', title:'Testing',content:x},{id:2, category:'berita', author:'Foo Bar', date:'17 Agustus 2015', thumb: 'app/public/images/thumb-2.jpg', title:'Coba',content:x}];

	return {
		getCategories: function(){
			var deffered = $q.defer();
			$http.get(_api + 'taxonomies/category/terms').success(function(res){
				deffered.resolve(res);
			}, function(){
				deffered.reject('Failed to load categories');
			});
			return deffered.promise;
		},
		getPosts: function(){
			var deffered = $q.defer();
			$http.get(_api + 'posts').success(function(res){
				deffered.resolve(res);
			}, function(){
				deffered.reject('Failed to load posts');
			});
			return deffered.promise;
		},
		categoryPosts: function(category){
			var deffered = $q.defer();
			$http.get(_api + 'posts?filter[category_name]='+category).success(function(res){
				deffered.resolve(res);
			}, function(){
				deffered.reject('Failed to load posts');
			});
			return deffered.promise;
		}
	}

})
.controller('HomeCtrl', ['$scope','$timeout','TechtalkAPI',function ($scope, $timeout, TechtalkAPI){
    $timeout(function(){
    	TechtalkAPI.getPosts().then(function(res){
        	$scope.items = res;
    	})
    },300);
}])
.controller('CategoryCtrl', ['$scope','$rootScope', '$routeParams', '$timeout','TechtalkAPI',function ($scope, $rootScope, $routeParams, $timeout, TechtalkAPI){
	$timeout(function(){
		TechtalkAPI.categoryPosts($routeParams.category).then(function(res){
			$scope.items = res;
		});
	},300);
}])
.controller('ContentCtrl', ['$scope','TechtalkAPI','$routeParams','$timeout', function ($scope, TechtalkAPI, $routeParams, $timeout){
	$timeout(function(){
	$scope.post = TechtalkAPI.post($routeParams.content);
}, 300);
}])
.directive('searchBox', function() {
	return {
		restrict: 'E',
		template: '<form><input ng-model="search" type="text" /></form>',
		controller: function($scope){

		}
	}
})
.directive('randomGlossary', function($timeout){
	return {
		restrict: 'E',
		templateUrl: 'app/public/views/widget-random-glossary.html',
		controller: function($scope){

		}
	}
})
.directive('socialButton', function(){
	return {
		restrict: 'E',
		templateUrl: 'app/public/views/widget-social-button.html',
		link: function(scope){
			scope.testing = function(){
				console.log('testing');
			}
		}
	}
})
.directive('navigation', ['TechtalkAPI','$window',function(TechtalkAPI, $window){
	return {
		restrict: 'E',
		link: function(scope, element, attrs){
			TechtalkAPI.getCategories().then(function(res){
				scope.categories = res.filter(function(item){
					return item.ID !== 1;
				});
			});

			angular.element($window).bind('scroll', function(){
				var sp = this.scrollY / this.scrollMaxY;
				element.children().css({'background':'rgba(139,195,74,'+sp+')'});
			});
			// scope.categories = [{id:1,name:'Home',slug:''},{id:1,name:'Blog',slug:'blog'},{id:1,name:'Berita',slug:'berita'}];			
		},
		// controller: function($scope){



			// $scope.categories = [{id:1,name:'Home',slug:''},{id:1,name:'Blog',slug:'blog'},{id:1,name:'Berita',slug:'berita'}];
			// $http.get('http://www.techtalk.web.id/wp-json/taxonomies/category/terms').success(function(response){
				// var res = response.filter(function(item){
					// item.slug = 'category/' + item.slug;
					// do not include Uncategorize
					// return item.ID !== 1;
				// });
				// res.unshift({ID:1, name:'Home', slug:''});
				// $scope.categories = res;
			// });
		// },
		templateUrl: 'app/public/views/widget-menu.html'
	}
}]);