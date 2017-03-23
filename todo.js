angular.module('app', ['ui.router'])

.component('todoList', {
	template: `
		<todo-form on-add-todos="$ctrl.add_todo(text)"></todo-form>
		<ul>
			<li ng-repeat="todo in $ctrl.todos">
				<todo-item item="todo" on-remove="$ctrl.remove($index)"
					on-update="$ctrl.update($index, data)"></todo-item>
			</li>
		</ul>
		<div ui-view></div>
	`,
	controller: function (TodoService) {
		const ctrl = this;

		ctrl.$onInit = function () {
			ctrl.todos = TodoService.get_todos;
		};

		ctrl.add_todo = (text) => {
			TodoService.add_todo(text);
		};

		ctrl.addItem = function (item) {
			ctrl.todos.push(item);
		};

		ctrl.remove = function(index) {
			ctrl.todos.splice(index,1);
		}

		ctrl.update = function(index,data) {
			Object.assign(ctrl.todos[index], data);
		}
	}
})

// .component('todoDetail',{
// 	template:'...',
// 	bindings:{
// 		todo:'<'
// 	},
// 	controller:function(TodoService)
// })

.component('todoItem', {
	bindings: {
		item: '<',
		onRemove: '&',
		onUpdate: '&'
	},
	template: `
		{{ $ctrl.item.text }}
		<button ng-click="$ctrl.onRemove()">Delete</button>
		<button ng-show="!$ctrl.item.done" ng-click="$ctrl.done()">Done</button>
	`,
	controller: function () {
		const ctrl = this;

		ctrl.done = function() {
			ctrl.onUpdate({
				data:{done:true}
			});
		};
	}
})

.component('todoForm', {
	bindings: {
		onAddItem: '&'
	},
	template: `
		<form ng-submit="$ctrl.addItem()">
			<label for="text"> Texte : </label>
			<input id="text" type="text" ng-model="$ctrl.text">
			<input type="submit">
		</form>
	`,
	controller: function () {
		const ctrl = this;

		ctrl.$onInit = function () {
			ctrl.text = '';
		};

		ctrl.addItem = function () {
			ctrl.onAddItem({
				item: { text: ctrl.text }
			});
			ctrl.text = '';
		};
	}
})

// .factory('TodoService', function() {
// 	let todos = [];
// 	function get_todos() { return todos;}
// 	function add_todo(text) {
// 		todos.push({text, done:false});}
// 		return {
// 			get_todos,
// 			add_todo
// 		}
// })

.config(($stateProvider, $urlRouterProvider)=> {
	$urlRouterProvider.otherwise('/');

	$stateProvider
	.state('home',{url:'/', component:'home'})
	.state('todo',{url:'/todo',component:'todoList'})
	.state('todo.detail',{
		url:'/:todoidx',
		component:'todoDetail'
		resolve:{todo:function(TodoService,$stateParams){return TodoService.get_todo($stateParams.todoidx);}}	
	})
})

.component('home',{template:'<h1>Home</h1>'}
);
