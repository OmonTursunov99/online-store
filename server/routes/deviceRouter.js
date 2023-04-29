const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController');
const roleMiddleware = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post('/', roleMiddleware("ADMIN"), deviceController.create);
router.get('/', authMiddleware,  deviceController.getAll);
router.get('/:id', authMiddleware, deviceController.getOne);

module.exports = router;