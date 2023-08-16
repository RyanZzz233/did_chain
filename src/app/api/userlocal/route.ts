import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import crypto from "crypto";

function hashApiKey() {
  const API_KEY = process.env.API_KEY;
  const SALT = process.env.SALT;

  const hash = crypto.createHash("md5");

  // @ts-ignore
  hash.update(API_KEY);
  // @ts-ignore
  hash.update(SALT);

  return hash.digest("hex");
}

export async function GET(request: NextRequest) {
  const authKey = hashApiKey();

  const urlParam = new URL(request.nextUrl);
  const key = urlParam.searchParams.get("key");
  const value = urlParam.searchParams.get("value");

  const url = `http://192.168.0.177:8000/getSpecDomains?key=${key}&value=${value}`;
  console.log(url);

  try {
    const response = await fetch(url, {
      headers: {
        "Auth-Key": authKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // const base64Data = await response.text();
    // const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8');
    // const data = JSON.parse(decodedData);

    const urlParam = new URL(request.nextUrl);
    const domain = urlParam.searchParams.get("domain");

    // Filter the data based on the 'domain' query parameter
    //console.log("check1", domain)
    //console.log("check3",data)
    // const filteredData = domain
    //   ? data.filter((item: any) =>
    //       item.domain.toLowerCase().includes(domain.toLowerCase())
    //     )
    //   : data;

    //console.log("check2",filteredData)
    return NextResponse.json(data);
  } catch (error) {
    console.error("An error occurred while fetching the data:", error);
    // Return a 500 status code and the error message
    return NextResponse.error();
  }
}
