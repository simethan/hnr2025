"use server";
const crawler = require("crawler-request");

export async function pdfToText(pdfUrl: string) {
  try {
    crawler(pdfUrl).then(function (response: any) {
      // handle response
      console.log(response.text || "No response");
      return response.text;
    });
  } catch (error) {
    console.error("Error fetching or parsing PDF:", error);
  }
}
