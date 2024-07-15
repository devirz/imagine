import get from "axios"
import generateRandomString from "./randomString"

const url = "https://prithivmlmods-imagineo-4k.hf.space/queue/join?__theme=light"

const generateImage = async (prompt: string) => {
  const uid = generateRandomString(9)
  const response = await fetch(url, {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9,fa;q=0.8",
      "content-type": "application/json",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "cookie": "_gid=GA1.2.1519658409.1720968210; _ga=GA1.2.1398785108.1717221960; _ga_R1FN4KJKJH=GS1.1.1720968209.12.1.1720969367.0.0.0",
      "Referer": "https://prithivmlmods-imagineo-4k.hf.space/?__theme=light",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": `{\"data\":[\"${prompt} --ar 85:128 --v 6.0 --style raw5, 4K, Photo-Realistic\",\"(deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, (mutated hands and fingers:1.4), disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation\",true,\"3840 x 2160\",\"Hi-Res\",\"Vivid\",\"1x1\",301209258,1024,1024,6,true],\"event_data\":null,\"fn_index\":3,\"trigger_id\":6,\"session_hash\":\"${uid}\"}`,
    "method": "POST"
  });
  const res = await response.json()
  res.uid = uid
  return res
}

const checkQueue = (uid: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await get(`https://prithivmlmods-imagineo-4k.hf.space/queue/data?session_hash=${uid}`, {
        responseType: "stream"
      });
      const stream = response.data;
      stream.on('data', (data: string) => {
        data = data.toString();
        console.log(data)
        if (data.includes("process_complete")) {
          let res: any = data.substring(6);
          res = res.split("\n")[0];
          const result = JSON.parse(res);
          if (result.success) {
            resolve(result.output.data[0][0]);
          } else {
            resolve(false);
          }
        }
      });
      
      stream.on("end", () => {
        console.log("stream ended");
        resolve(null);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export { generateImage, checkQueue }

// ;(async () => {
//   const s = await generateImage("a dragon under water")
//   console.log(s)
//   const res = await checkQueue(s.uid)
//   if(res) console.log(res)
// })()