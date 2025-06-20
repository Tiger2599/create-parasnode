var multer = require("multer");
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: String,
        mobileno: String,
        buildingno: String,
        roomno: String,
        deposit: Number,
        deposit_due: Number,
        rent: Number,
        rentstartfrom: String,
        adharno: String,
        adharfront: String,
        adharback: String,
        isActive: Boolean
    },
    {
        timestamps: true
    }
)

const rentSchema = new mongoose.Schema(
    {
        tenate:String,
        rent:Number,
        rentPay:Number,
        dueRent:Number,
        duration:String,
        totalDay:String,
        note:String,
        status:String,
        onadte:String,
        rentReciver:String,
        rentstartfrom:String,
        discount:Number,
        month:String,
        year:String
    },
    {
        timestamps: true
    }
)

const rentmasterSchema = new mongoose.Schema(
    {
        tenate:String,
        rent:String,
        due:Number,
        note:String,
        rentRecive:Number,
        rentReciver:String,
        onDate:String,
    },
    {
        timestamps: true
    }
)

const depositSchema = new mongoose.Schema(
    {
        tenate:String,
        deposit:Number,
        due:Number,
        note:String,
        reciver:String,
        onDate:String
    },
    {
        timestamps: true
    }
)

const User = mongoose.models.user || mongoose.model('user', userSchema)
const Rent = mongoose.models.rent || mongoose.model('rent', rentSchema)
const rentMaster = mongoose.models.rentMaster || mongoose.model('rentMaster', rentmasterSchema)
const Deposit = mongoose.models.deposit || mongoose.model('deposit', depositSchema)

exports.dashboard = async (req, res) => {
    let rent = await rentMaster.find();
    let deposit = await Deposit.find();

    let dashboardData = {
        toDay_rent: 0,
        lastDay_rent: 0,
        thisMonth_rent: 0,
        thisMonthDue_rent: 0,
        lastMonth_rent: 0,
        thisYear_rent: 0,
        toDay_deposit: 0,
        lastDay_deposit: 0,
        thisMonth_deposit: 0,
        thisMonthDue_deposit: 0,
        lastMonth_deposit: 0,
        thisYear_deposit: 0,
        totaldue_deposit: 0,
        totaldue_rent: 0
    }

    res.render('member/dashboard', { dashboardData });
}

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './adhar_image');
    },
    filename: function (req, file, callback) {
        req.middlewareStorage = {
            image: parseInt(Date.now() / 1000) + "-" + file.originalname
        }
        callback(null, parseInt(Date.now() / 1000) + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });
exports.add_tenant_details = (req, res) => {
    upload.any()(req, res, async() => {
        try {
            let adharback,adharfront;
            const {name, mobileno, buildingno, rentstartfrom, roomno, deposit, rent, adharno, month} = req.body;
            let requiredFields = [ 'name', 'mobileno', 'buildingno', 'roomno', 'deposit', 'rent', 'rentstartfrom', 'month' ];
            const isValid = await valiDate(res, requiredFields, req.body);
            if (!isValid) return;

            if(req?.files){
                req?.files.forEach(element => {
                    if(element.fieldname == "adharfront"){
                        adharfront = element?.filename || ''
                    }else{
                        adharback = element?.filename || ''
                    }
                });
            }

            const user = new User({
                name,
                mobileno,
                buildingno,
                roomno,
                deposit,
                deposit_due:deposit,
                rent,
                rentstartfrom,
                adharno,
                adharback,
                adharfront,
                isActive:true
            });

            user.save().then(async(savedUser) => {

                const Deposit_insert = new Deposit({
                    tenate:savedUser.id,
                    deposit:0,
                    due:deposit,
                    note:'',
                    reciver:''
                });

                await Deposit_insert.save()

                const tenateRent = new Rent({
                    tenate:savedUser.id,
                    rent,
                    rentPay:0,
                    dueRent:0,
                    duration:"",
                    totalDay:"",
                    note:"",
                    status:"Due",
                    onadte:"",
                    rentReciver:"",
                    rentstartfrom,
                    discount:0,
                    month,
                    year: new Date().getFullYear()
                });

                // Calculate rent pay and duration
                const startDate = new Date();
                startDate.setDate(rentstartfrom); // set the day of the month to the rentstartfrom value
                const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // last day of the month
                const totalDaysInMonth = endDate.getDate();
                const rentPayDays = (rentstartfrom != 1) ? 30 - startDate.getDate() : 30; //totalDaysInMonth - startDate.getDate() + 1; // calculate the number of days to pay rent

                // Calculate rent pay amount based on half month rent
                const rentPayAmount = rentPayDays * rent / 30;

                tenateRent.rentPay = rentPayAmount.toFixed();
                tenateRent.dueRent = rentPayAmount.toFixed();
                tenateRent.duration = `${startDate.getDate()} to ${endDate.getDate()}`; // format the duration as "15 to 30" or "15 to 31"
                tenateRent.totalDay = rentPayDays;

                tenateRent.save().then(() => {
                    res.send({
                        status: "success",
                        msg: "Tenant details added successfully.",
                    });
                }).catch((err) => {
                    console.log(error);
                    res.send({
                        status: "fail",
                        msg: "Something Went Wrong.",
                    });
                });
                
            }).catch((error) => {
                console.log(error);
                res.send({
                    status: "fail",
                    msg: "Something Went Wrong.",
                });
            });

        } catch (error) {
            console.log(error);
            res.send({
                status: "fail",
                msg: "Something Went Wrong."
            })
        }
    });
}
