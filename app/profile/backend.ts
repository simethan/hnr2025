"use server";
const crawler = require("crawler-request");

export async function pdfToText(pdfUrl: string) {
  try {
    crawler(pdfUrl).then(function (response: any) {
      // handle response
      console.log(response);
      return response;
    });
  } catch (error) {
    console.error("Error fetching or parsing PDF:", error);
  }
}
