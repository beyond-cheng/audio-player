Y.User = Y.Base.create('user', Y.Model, [Sync], {
	apis: {
		create: '/api/user'
	},
	httpMethods: {
		create: 'post'
	}
	
}, {
	ATTRS: {
		name: {value: null},
		password: {value: null}
	}
});