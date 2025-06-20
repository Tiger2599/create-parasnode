const { body } = require('express-validator');

const noHtmlTags = (value) => {
	const htmlTagPattern = /<\/?[^>]+(>|$)/g;
	if (htmlTagPattern.test(value)) {
		// throw new Error('HTML tags are not allowed.');
		throw new Error('Invalid Input.');
	}
	return true;
};

const validateFields = (fields, req) => {
	return fields.map((field) => {
		switch (field) {
		case 'userName':
		case 'username':
			return body(field)
				.notEmpty().withMessage('Please enter a User Name.')
				.custom(noHtmlTags);

		case 'type':
			return body(field)
				.notEmpty().withMessage('Please Select Type.')
				.custom(noHtmlTags);

		case 'name':
		case 'firstname':
		case 'lastname':
			return body(field)
				.notEmpty().withMessage(`Please enter a ${field.charAt(0).toUpperCase() + field.slice(1)}.`)
				.custom(noHtmlTags);

		case 'email':
			return body('email')
				.notEmpty().withMessage('Please enter an Email Address.')
				.isEmail().withMessage('Enter a valid email address.')
				.custom(noHtmlTags);

		case 'countrycode':
			return body('countrycode')
				.notEmpty().withMessage('Please enter a country code.')
				.matches(/^\+\d+$/).withMessage('Country code must start with "+" and contain only numeric digits.')
				.custom(noHtmlTags);

		case 'mobileno':
			return body('mobileno')
				.notEmpty().withMessage('Enter a Mobile No.')
				.isMobilePhone().withMessage('Enter a valid Mobile No.')
				.custom(noHtmlTags);

		case 'password':
			return body('password')
				.notEmpty().withMessage('Password is required.')
				.isStrongPassword().withMessage('Please use a strong password.')
				.custom(noHtmlTags);

		case 'verification':
		case 'amountId':
			return body(field)
				.notEmpty().withMessage(`Please enter ${field === 'verification' ? 'a verification Code' : 'an amount'}.`)
				.isNumeric().withMessage(`${field === 'verification' ? 'Verification Code' : 'Amount'} must be a Number.`)
				.custom(noHtmlTags);

		case 'antiPhishing':
			return body('antiPhishing')
				.notEmpty().withMessage('Please enter Anti-Phishing Text.')
				.custom(noHtmlTags);

		case 'amount':
		case 'powerconsumption':
			return body(field)
				.isNumeric().withMessage('Value must be a valid number.')
				.isFloat({ min: 1 }).withMessage('Value must be greater than zero.')
				.custom(noHtmlTags);

		case 'discount':
			return body('discount')
				.isNumeric().withMessage('Discount must be a valid number.')
				.isFloat({ min: 1, max: 100 }).withMessage('Discount must be between 1% and 100%.')
				.custom(noHtmlTags);

		case 'hashrate':
			return body('hashrate')
				.isNumeric().withMessage('hashrate must be a valid number.')
				.isFloat({ min: 1 }).withMessage('hashrate must be greater than zero.')
				.custom(noHtmlTags);

		case 'fees':
			return body('fees')
				.isNumeric().withMessage('Fees must be a valid number.')
				.isFloat({ min: 1, max: 100 }).withMessage('Fees must be between 1% and 100%.')
				.custom(noHtmlTags);

		case 'month':
			return body('month')
				.isInt({ gt: 0 }).withMessage('Month must be a valid positive integer.')
				.custom(noHtmlTags);

		case 'pool_host':
		case 'algorithm':
			return body(field)
				.notEmpty().withMessage(`Please enter ${field === 'pool_host' ? 'Pool Host' : 'Algorithm'}.`)
				.custom(noHtmlTags);

		case 'inputData':
			return body('inputData')
				.isArray().withMessage('Please insert A value.')
				.notEmpty().withMessage('Please insert A value.')
		default:
			throw new Error(`Validation for field "${field}" is not defined.`);
		}
	});
};

module.exports = { validateFields, noHtmlTags };
