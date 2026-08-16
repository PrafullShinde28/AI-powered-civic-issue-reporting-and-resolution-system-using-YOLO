const express =
    require("express");

const router =
    express.Router();

const AdminController =
    require("../../controllers/admin/admin.controller");

const devAuthMiddleware =
    require("../../middleware/devAuth.middleware");


/* ============================================================
   FINAL COMPLAINT CLOSURE
============================================================ */
router.post(
    "/complaints/:id/override-resolution",
    AdminController.overrideResolution
);

router.post(

    "/complaints/:id/close",

    devAuthMiddleware,

    AdminController.closeComplaint

);
router.post(
    "/complaints/:id/reassign-worker",
    devAuthMiddleware,
    AdminController.reassignWorker
);

router.post(
    "/complaints/:id/override-department",
    devAuthMiddleware,
    AdminController.overrideDepartment
);

router.post(
    "/complaints/:id/override-priority",
    devAuthMiddleware,
    AdminController.overridePriority
);

router.get(
    "/complaints",
    devAuthMiddleware,
    AdminController.getComplaints
);


router.get(
    "/complaints/:id",
    devAuthMiddleware,
    AdminController.getComplaintDetails
);


router.get(
    "/dashboard/analytics",
    devAuthMiddleware,
    AdminController.dashboardAnalytics
);


module.exports =
    router;