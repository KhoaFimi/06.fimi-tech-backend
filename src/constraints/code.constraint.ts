export enum SuccessCode {
	OK = 'S2000', // Created record successfully
	CREATED = 'S2010', // Request OK
	ACCEPTED = 'S2020', // Request Accepted by server
	NOT_VERIFIED = 'S2001' // Ok but verification requirement
}

export enum ErrorCode {
	VAL_ERROR = 'E4001', // Zod validation error
	MISSING_ERROR = 'E4002', // Missing data error
	NOT_MATCHED_ERROR = 'E4003', // Input data not matched
	OTP_EXPIRES_ERROR = 'E4004', // Otp is expires
	NO_TNC_ERROR = 'E4005', // No TNC
	ACCESS_TOKEN_EXPIRED_ERROR = 'E4011', // Access token is expired
	UNAUTHORIZED_ERROR = 'E4000',
	NOT_FOUND_ERROR = 'E4040', // Not found error
	WRONG_CREDENTIALS_ERROR = 'E4041', // Credentials is wrong
	DUPLICATED_ERROR = 'E4091' // Duplicated record
}
