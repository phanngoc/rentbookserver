export default class BaseController {
  constructor(req, res) {
    this.request = req;
    this.response = res;
  }

  responseErrors(errors) {
    this.response.json({
      success: false,
      statusCode: 200,
      body: errors
    });
  }
  
  responseSuccess(body) {
    this.response.json({
      success: false,
      statusCode: 200,
      body: body
    });
  }
}
