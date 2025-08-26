// server.js
import express from "express";
import crypto from "crypto";
import axios from "axios";
import cors from "cors";

const app = express();   // 👉 phải khai báo app trước
app.use(cors());         // rồi mới gọi cors
app.use(express.json());

// Cấu hình từ MoMo
const partnerCodeM = "MOMOK8IO20250706_TEST";
const accessKeyM = "yx3HDNvqLE2Tpdey";
const secretKeyM = "MJD5rj3DUu9GTBuajQid20jWAUtO9zls";
const endpointM = "https://test-payment.momo.vn/v2/gateway/api/create";
const redirectUrlM = "http://localhost:8080/api/payment/momo/return";
const ipnUrlM = "http://localhost:8080/api/payment/momo/ipn";

app.post("/api/payment/momo", async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const requestId = orderId + new Date().getTime();

    const rawSignature = `accessKey=${accessKeyM}&amount=${amount}&extraData=&ipnUrl=${ipnUrlM}&orderId=${orderId}&orderInfo=Thanh toan don hang ${orderId}&partnerCode=${partnerCodeM}&redirectUrl=${redirectUrlM}&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto
      .createHmac("sha256", secretKeyM)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode: partnerCodeM,
      accessKey: accessKeyM,
      requestId,
      amount,
      orderId,
      orderInfo: `Thanh toan don hang ${orderId}`,
      redirectUrl: redirectUrlM,
      ipnUrl: ipnUrlM,
      extraData: "",
      requestType: "captureWallet",
      signature,
      lang: "vi",
    };

    const response = await axios.post(endpointM, requestBody);
    res.json(response.data);
  } catch (error) {
    console.error("Payment error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
