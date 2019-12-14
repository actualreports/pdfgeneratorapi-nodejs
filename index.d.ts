class PDFGeneratorAPI {
	baseUrl: string;
	key: string;
	workspace: string;
	timeout: number;
	constructor(key: string, secret: string, workspace?: string, timeout?: number);

	getRequestConfig<T>(
		method: string,
		resource: string,
		params: T
	): {
		baseURL: string;
		url: string;
		timeout: number;
		headers: {
			'X-Auth-Key': string;
			'X-Auth-Workspace': string;
			'X-Auth-Signature': ReturnType<PDFGeneratorAPI['createSignrature']>;
			'Content-Type': string;
			Accept: string;
		};
		responseType: 'json';
		params: T;
		method: string;
	};
	createSignrature(resource: string): string | Buffer;
	handleError(error: Error): { error: string; success: false };
	parseResponse<ResponseT extends { error: any; data: any }>(
		response: ResponseT
	): ResponseT extends { error: any; data: infer D } ? D | ResponseT : ResponseT;
	dataToString(data: any): string;
	sendRequest<T = any>(method: string, resource: string, config: Object): Promise<T>;
	setBaseUrl(url: string): PDFGeneratorAPI;
	setWorkspace(workspace: string): PDFGeneratorAPI;
	setTimeout(timeout: number): PDFGeneratorAPI;
	getAll(access: any[], tags: string[]): ReturnType<PDFGeneratorAPI['sendRequest']>;
	get(template: string): ReturnType<PDFGeneratorAPI['sendRequest']>;
	create(name: string): ReturnType<PDFGeneratorAPI['sendRequest']>;
	copy(template: number, newName: string): ReturnType<PDFGeneratorAPI['sendRequest']>;
	output(
		template: number,
		data: Object | Array<any> | string,
		format: string,
		name: string,
		params: Object
	): ReturnType<PDFGeneratorAPI['sendRequest']>;
	editor(template: number, data: Object | Array<any> | string, params: Object): string;
	delete(template: number): ReturnType<PDFGeneratorAPI['sendRequest']>;
}

export = PDFGeneratorAPI;