import { RepairInvoice } from "src/repairInvoice/entities/repairInvoice.entity";
import { Technician } from "../technician/entities/technician.entity";
import { IdGenerator } from "../id-generator/id-generator.service";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Task } from "src/task/entities/task.entity";
import { ItemRepairInvoice } from "src/itemRepairInvoice/entities/itemRepairInvoice.entity";
import { CreateItemRepairInvoiceDto } from "./dto/create-repairInvoice.dto";
import { isQueryAffected } from "src/helper/validation";
import { Complain } from "src/complain/entities/complain.entity";
@Injectable()
export class RepairInvoiceService {
    constructor(
        @InjectRepository(RepairInvoice)
        private readonly repairInvoiceRepository: Repository<RepairInvoice>,
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @InjectRepository(ItemRepairInvoice)
        private readonly itemRepairInvoiceRepository: Repository<ItemRepairInvoice>,
        @InjectRepository(Complain)
        private readonly complainRepository: Repository<Complain>,
        private readonly idGenerate: IdGenerator,
    ) {}
    async create(items: CreateItemRepairInvoiceDto[], task_id: string) {
        const task = (await this.taskRepository.findOne({
            where: { task_id },
        })) as Task;
        const id = "RI" + this.idGenerate.generateId();
        let total = 0;
        items.forEach((item: any) => {
            total += item.price;
        });
        console.log(items);
        console.log(id);
        const repairInvoice = this.repairInvoiceRepository.create({
            id,
            task,
            total,
        });

        await this.repairInvoiceRepository.save(repairInvoice);
        console.log(repairInvoice);
        items.forEach(async (item) => {
            const item_id = "IRI" + this.idGenerate.generateId();
            const itemData = this.itemRepairInvoiceRepository.create({
                id: item_id,
                ...item,
                invoice: repairInvoice,
            });
            await this.itemRepairInvoiceRepository.save(itemData);
        });
        const result = await this.repairInvoiceRepository.findOne({
            where: { id },
        });
        return result;
    }
    async findAll() {
        return await this.repairInvoiceRepository.find({
            relations: ["items", "task"],
        });
    }
    convertJsonToParams(jsonObject: any): string {
        const params = new URLSearchParams();

        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                params.append(key, jsonObject[key]);
            }
        }

        return params.toString();
    }
    async payment(CreateItemRepairInvoiceDto: CreateItemRepairInvoiceDto, residentId: string) {
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        //parameters
        var accessKey = "F8BBA842ECF85";
        var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        var orderInfo = CreateItemRepairInvoiceDto.orderInfo;
        var partnerCode = "MOMO";
        var invoiceId = "Inv" + this.idGenerate.generateId().toString();
        var redirectUrl =
        CreateItemRepairInvoiceDto.redirectUrl + "/" + invoiceId + "?auth=true";
        CreateItemRepairInvoiceDto.buyer_id = residentId;
        var ipnUrl =
        CreateItemRepairInvoiceDto.baseLink +
            "/invoice/create/" +
            invoiceId +
            "?" +
            this.convertJsonToParams(CreateItemRepairInvoiceDto) +
            "&id=" +
            invoiceId;
        var requestType = "payWithMethod";
        let servicePackage = await this.repairInvoiceRepository.findOne({
            where: { id: CreateItemRepairInvoiceDto.id },
        });

        // var amount =
        // CreateItemRepairInvoiceDto.amount * (servicePackage?.per_unit_price ?? 1);
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;
        var extraData = "";
        var paymentCode =
            "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
        var orderGroupId = "";
        var autoCapture = true;
        var lang = "vi";

        var rawSignature =
            "accessKey=" +
            accessKey +
            // "&amount=" +
            // amount +
            "&extraData=" +
            extraData +
            "&ipnUrl=" +
            ipnUrl +
            "&orderId=" +
            orderId +
            "&orderInfo=" +
            orderInfo +
            "&partnerCode=" +
            partnerCode +
            "&redirectUrl=" +
            redirectUrl +
            "&requestId=" +
            requestId +
            "&requestType=" +
            requestType;
        //puts raw signature

        console.log("--------------------RAW SIGNATURE----------------");
        console.log(rawSignature);
        //signature
        const crypto = require("crypto");
        var signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");
        console.log("--------------------SIGNATURE----------------");
        console.log(signature);

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            // amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
        });
        //Create the HTTPS objects
        const https = require("https");
        const options = {
            hostname: "test-payment.momo.vn",
            port: 443,
            path: "/v2/gateway/api/create",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
            },
        };
        //Send the request and get the response
        return new Promise<string>((resolve, reject) => {
            const req = https.request(options, (res) => {
                let result = "";

                console.log(`Status: ${res.statusCode}`);
                console.log(`Headers: ${JSON.stringify(res.headers)}`);

                res.setEncoding("utf8");
                res.on("data", (body) => {
                    result += body;
                    console.log("Body: ");
                    console.log(body);
                    console.log("resultCode: ");
                    console.log(JSON.parse(body).resultCode);
                });

                res.on("end", () => {
                    console.log("No more data in response.");
                    // Resolve the promise with the result when the request is complete
                    const originalResponse = JSON.parse(result);

                    // Create an object for additional information
                    const additionalInfo = {
                        ipnUrl: ipnUrl,
                        redirectUrl: redirectUrl,
                        orderInfo: orderInfo,
                        invoiceId: invoiceId,
                    };

                    // Add additional information to the original response
                    originalResponse.additionalInfo = additionalInfo;

                    // Resolve the promise with the modified JSON response
                    resolve(JSON.stringify(originalResponse));
                });
            });

            req.on("error", (e) => {
                console.log(`Problem with request: ${e.message}`);
                // Reject the promise with the error if there is a problem with the request
                reject(e.message);
            });

            // Write data to the request body
            console.log("Sending....");
            req.write(requestBody);

            // End the request
            req.end();
        });
    }
    async getInvoiceByTaskId(id: string) {
        console.log(id);
        const result = await this.repairInvoiceRepository.findOne({
            where: {
                task: {
                    task_id: id,
                },
            },
            relations: {
                items: true,
                task: true,
            },
        });
        return result;
    }
    
}
