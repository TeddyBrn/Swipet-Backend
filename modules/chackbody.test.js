const { checkBody } = require('./checkbody');

it('Missing or empty field - Test', () => {
	const result = checkBody({name: 'mael', email: 'mael@gmail.com'}, ['firstname', 'email']);

	expect(result).toBe(true);
});