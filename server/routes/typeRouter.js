const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController');
const roleMiddleware = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post('/', roleMiddleware("ADMIN"), typeController.create);
router.get('/', authMiddleware, typeController.getAll);

module.exports = router;