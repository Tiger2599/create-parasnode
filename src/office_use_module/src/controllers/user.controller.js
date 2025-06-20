import { getTokenPrice } from "../helpers/getTokenPrice.helper.js";
import { sql } from "../DB/index.js";
import Web3 from "web3";
import {
    contract_abi,
    contract_address,
    privateKey,
    rpc,
    token_address,
} from "../constants.js";

class UserController {
    constructor() {
        this.web3 = new Web3(rpc);
        this.tokenAddress = token_address;
        this.smartContract = new this.web3.eth.Contract(
            contract_abi,
            contract_address
        );
        this.privateKey = privateKey;

        this.getUser = this.getUser.bind(this);
        this.beforeClaim = this.beforeClaim.bind(this);
        this.claim = this.claim.bind(this);
        this.claimList = this.claimList.bind(this);
    }

    getUser = async (req, res) => {
        try {
            return res.status(200).json({
                status: "Success",
                msg: "",
                data: { ...req.userId, ...req.user },
            });
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({
                    status: "Fail",
                    msg: "Internal server error. Please try again later.",
                });
        }
    };

    beforeClaim = async (req, res) => {
        try {
            const { address, point } = req.body;
            const { mid, uuid } = req.userId;

            if (!address || address.trim() === "") {
                return res
                    .status(400)
                    .json({ status: "Fail", msg: "All fields are required." });
            }

            if (point <= 0) {
                return res
                    .status(400)
                    .json({
                        status: "Fail",
                        msg: "No points available to claim.",
                    });
            }

            const { recordset } = await sql.query(`
                exec memberReg @mode = 'before_claim', @uuid = '${uuid}'
            `);

            const { msg, msgcode } = recordset[0];
            if (msgcode !== "Success") {
                return res.status(400).json({ status: "Fail", msg });
            }

            const tokenPrice = await getTokenPrice();
            const price = Web3.utils.toWei(String(tokenPrice), "ether");
            const amount = Web3.utils.toWei(String(point), "ether");
            const currentTime = Math.floor(Date.now() / 1000);

            const messageHash = await this.smartContract.methods
                .getMessageHash(
                    this.tokenAddress,
                    address,
                    amount,
                    price,
                    currentTime
                )
                .call();

            if (!messageHash) {
                return res
                    .status(500)
                    .json({
                        status: "Fail",
                        msg: "Error generating message hash.",
                    });
            }

            const signed = await this.web3.eth.accounts.sign(
                messageHash,
                this.privateKey
            );
            const { signature } = signed;

            return res.status(200).json({
                status: "Success",
                msg: "",
                data: {
                    tokenAddress: this.tokenAddress,
                    address,
                    point: amount,
                    price,
                    currentTime,
                    signature,
                },
            });
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({
                    status: "Fail",
                    msg: "Internal server error. Please try again later.",
                });
        }
    };

    claim = async (req, res) => {
        try {
            const {
                address,
                point: pointInWei,
                tranhash: tranHash,
                price: priceInWei,
            } = req.body;
            const { mid, uuid } = req.userId;

            if (
                [address, tranHash, priceInWei, pointInWei].some(
                    (e) => !e || e.trim() === ""
                )
            ) {
                return res
                    .status(400)
                    .json({ status: "Fail", msg: "All fields are required." });
            }

            const price = Web3.utils.fromWei(priceInWei, "ether");
            const point = Web3.utils.fromWei(pointInWei, "ether");

            const { recordset } = await sql.query(`
                exec memberReg 
                    @mode = 'claim',
                    @uuid = '${uuid}',
                    @price = ${price},
                    @point = ${point},
                    @tranhash = '${tranHash}',
                    @address = '${address}'
            `);

            const { msg, msgcode } = recordset[0];
            if (msgcode !== "Success") {
                return res.status(400).json({ status: "Fail", msg });
            }

            return res.status(200).json({ status: "Success", msg });
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({
                    status: "Fail",
                    msg: "Internal server error. Please try again later.",
                });
        }
    };

    claimList = async (req, res) => {
        try {
            const { uuid } = req.userId;

            const { recordset } = await sql.query(`
                exec memberReg 
                    @mode = 'claim_list',
                    @uuid = '${uuid}'
            `);

            return res.status(200).json({
                status: "Success",
                msg: "",
                data: recordset,
            });
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({
                    status: "Fail",
                    msg: "Internal server error. Please try again later.",
                });
        }
    };
}

export default new UserController();
