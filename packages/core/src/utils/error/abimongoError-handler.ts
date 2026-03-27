import { ErrorType } from "./errorTypes.js";
// import { logger } from "../../config";


export const  AbiMongoError = (
	TypeError: ErrorType,
	message: string,
	stack?: string,
	cause?: string
) => {
	let reportError = new Error()
	reportError.name = TypeError;
	reportError.stack = stack;
	reportError.message = message;
	reportError.cause = cause;

	const error = `${reportError.name}` + `${reportError.stack}` + `${reportError.message}` + `${reportError.cause}`;


	switch (TypeError) {
		case ErrorType.AbiMongoError:
			console.log(error);
			break;
		case ErrorType.AbiMongoErrorStack:
			console.log(error)
			break;
		case ErrorType.AbiMongoErrorMessage:
			console.log(error)
			break;
		case ErrorType.AbiMongoErrorCause:
			console.log(error)
			break;
		case ErrorType.AbiMongoCollectionError:
			console.log(error)
			break;
		case ErrorType.AbiMongoConnectionError:
			console.log(error)
			break;
		case ErrorType.AbiMongoSchemaError:
			console.log(error)
			break;
		case ErrorType.AbiMongoModelError:
			console.log(error)
			break;
		case ErrorType.NULL_OR_UNDEFINED:
			console.log(error)
			break;
		case ErrorType.INVALID_SCHEME_ERROR:
			console.log(error)
			break;
		case ErrorType.CONNECTION_ERROR:
			console.log(error)
			break
		case ErrorType.UNEXPECTED_ERROR:
			console.log(error)
			break;
		case ErrorType.INITIALIZATION_ERROR:
			console.log(error)
			break;
		case ErrorType.VALIDATION_ERROR:
			console.log(error)
			break;
		default:
			reportError = new Error(error);
			break;
	}

	return reportError || error;
};

