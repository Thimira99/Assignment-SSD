const router = require("express").Router();
const Group = require("../models/groups");
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Initialize and configure csurf middleware
const csrfProtection = csrf({ cookie: true });

router.use(cookieParser());  
router.use(bodyParser.urlencoded({ extended: true }));  
 
router.use(csrfProtection);

router.use((req, res, next) => {
    if (req.path === '/csrf-token') {
        
        next();
    } else {
        csrfProtection(req, res, next);
    }
});

// Create a route for fetching the CSRF token
router.route('/csrf-token').get((req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

router.route("/post").post((req, res) => {
    const { groupName, groupLeaderName, groupLeaderId, memberTwoName, memberTwoId, memberThreeName, memberThreeId, memberFourName, memberFourId } = req.body;

    const newGroup = new Group({
        groupName,
        groupLeaderName,
        groupLeaderId,
        memberTwoName,
        memberTwoId,
        memberThreeName,
        memberThreeId,
        memberFourName,
        memberFourId
    });

    console.log(newGroup)

    // Verify CSRF token before processing
    if (req.csrfToken() !== req.body._csrf) {
        return res.status(403).send('CSRF token mismatch.');
    }

    newGroup.save().then(() => {
        res.status(200).send({ status: "Student Group Updated", student: newGroup });
    }).catch((error) => {
        console.log(error);
    })
})

router.route("/get/:id").get((req, res) => {
    let id = req.params.id;
    Group.findById(id).then((group) => {
        res.json(group)
    }).catch((error) => {
        console.log(error)
    })
})

router.route("/get").get((req, res) => {
    Group.find().then((group) => {
        res.json(group)
    }).catch((error) => {
        console.log(error)
    })
})

router.route("/getbyLeader/:id").get((req, res) => {
    const id = req.params.id;
    console.log(id)
    Group.findOne({ groupLeaderId: id }).then((group) => {
        res.send(group)
        console.log(group)
    }).catch((error) => {
        console.log(error)
    })
})

router.route("/update/:id").put((req, res) => {
    let id = req.params.id;
    const { groupName, groupLeaderName, groupLeaderId, memberTwoName, memberTwoId, memberThreeName, memberThreeId, memberFourName, memberFourId } = req.body;


    const updateGroup = {
        groupName,
        groupLeaderName,
        groupLeaderId,
        memberTwoName,
        memberTwoId,
        memberThreeName,
        memberThreeId,
        memberFourName,
        memberFourId
    }

    const update = Group.findByIdAndUpdate(id, updateGroup).then(() => {

        res.status(200).send({ status: "Group Updated", updatedGroup: update });
    }).catch((error) => {
        res.status(500).send({ status: "error", error: error });
    })
})

router.route("/delete/:id").delete((req, res) => {
    const id = req.params.id;
    Group.findByIdAndDelete(id).then(() => {
        res.status(200).send({ status: "Student Deleted" });
    }).catch((error) => {
        console.log(error);
    })
})
module.exports = router;
